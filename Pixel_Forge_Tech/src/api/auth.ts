import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginCredentials, SignupCredentials, AuthResponse, AuthError } from '../types/auth';
import env from '../config/env';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add token to requests if it exists
api.interceptors.request.use(async (config) => {
  console.log('Making request to:', config.url, 'with data:', config.data);
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.data);
    return response;
  },
  async (error: AxiosError) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data,
      status: error.response?.status,
      responseData: error.response?.data,
      message: error.message
    });

    if (error.code === 'ECONNABORTED') {
      throw { message: 'Request timed out. Please check your internet connection.' } as AuthError;
    }

    if (!error.response) {
      throw { 
        message: 'Network error. Please check if the server is running and you have internet connection.',
        code: 'NETWORK_ERROR'
      } as AuthError;
    }

    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');
        
        const response = await api.post('/auth/refresh', { refreshToken });
        const { token } = response.data;
        
        await AsyncStorage.setItem('userToken', token);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        
        return api(originalRequest);
      } catch (refreshError) {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    console.log('Attempting login with:', credentials);
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    if (axios.isAxiosError(error)) {
      const authError: AuthError = {
        message: error.response?.data?.message || 'Login failed',
        code: error.response?.data?.code || error.code,
        status: error.response?.status,
      };
      throw authError;
    }
    throw { message: 'Network error occurred' } as AuthError;
  }
};

export const signup = async (credentials: SignupCredentials): Promise<AuthResponse> => {
  try {
    console.log('Attempting signup with:', credentials);
    const response = await api.post<AuthResponse>('/auth/signup', credentials);
    console.log('Signup successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Signup failed:', error);
    if (axios.isAxiosError(error)) {
      const authError: AuthError = {
        message: error.response?.data?.message || 'Signup failed',
        code: error.response?.data?.code || error.code,
        status: error.response?.status,
      };
      throw authError;
    }
    throw { message: 'Network error occurred' } as AuthError;
  }
};

export const logout = async (): Promise<void> => {
  try {
    console.log('Attempting logout');
    await api.post('/auth/logout');
    console.log('Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('refreshToken');
  }
};