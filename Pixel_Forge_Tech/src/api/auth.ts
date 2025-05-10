import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginCredentials, SignupCredentials, AuthResponse, AuthError } from '../types/auth';
import env from '../config/env';
import { Platform } from 'react-native';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

console.log('API URL from env:', env.API_URL); // Debug log
console.log('Platform:', Platform.OS); // Debug log

const api = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // 15 second timeout
  validateStatus: (status) => status >= 200 && status < 300, // Only accept 2xx responses as success
});

// Add token to requests if it exists
api.interceptors.request.use(async (config) => {
  console.log('Making request to:', `${config.baseURL}${config.url}`, 'with data:', config.data);
  console.log('Request headers:', config.headers);
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Handle token refresh
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.data);
    return response;
  },
  async (error: AxiosError) => {
    console.error('API Error:', {
      baseURL: error.config?.baseURL,
      url: error.config?.url,
      fullUrl: `${error.config?.baseURL}${error.config?.url}`,
      method: error.config?.method,
      data: error.config?.data,
      status: error.response?.status,
      responseData: error.response?.data,
      message: error.message,
      code: error.code,
      platform: Platform.OS,
      headers: error.config?.headers
    });

    // Handle network errors
    if (!error.response) {
      const errorMessage = error.code === 'ECONNABORTED' 
        ? 'Request timed out. Please check your internet connection.'
        : `Network error. Please check if the server is running and you have internet connection. (Platform: ${Platform.OS}, URL: ${error.config?.baseURL}${error.config?.url})`;
      
      throw { 
        message: errorMessage,
        code: error.code || 'NETWORK_ERROR',
        platform: Platform.OS
      } as AuthError;
    }

    // Handle 401 Unauthorized
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) throw new Error('No token available');
        
        // Try to refresh the token
        const response = await api.post('/auth/refresh', { token });
        const { token: newToken } = response.data;
        
        await AsyncStorage.setItem('userToken', newToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        
        return api(originalRequest);
      } catch (refreshError) {
        await AsyncStorage.removeItem('userToken');
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const data = error.response?.data;
    const authError: AuthError = {
      message: (data && typeof data === 'object' && 'message' in data) ? (data as any).message : error.message,
      code: (data && typeof data === 'object' && 'code' in data) ? (data as any).code : error.code || 'UNKNOWN_ERROR',
      status: error.response?.status,
      platform: Platform.OS
    };
    return Promise.reject(authError);
  }
);

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    console.log('Attempting login with:', credentials);
    console.log('Using API URL:', env.API_URL);
    console.log('Platform:', Platform.OS);
    
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    console.log('Login successful:', response.data);
    
    // Store the token
    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    if (axios.isAxiosError(error)) {
      const authError: AuthError = {
        message: error.response?.data?.message || 'Login failed',
        code: error.response?.data?.code || error.code,
        status: error.response?.status,
        platform: Platform.OS
      };
      throw authError;
    }
    throw { 
      message: 'Network error occurred',
      code: 'UNKNOWN_ERROR',
      platform: Platform.OS
    } as AuthError;
  }
};

export const signup = async (credentials: SignupCredentials): Promise<AuthResponse> => {
  try {
    console.log('Attempting signup with:', credentials);
    const response = await api.post<AuthResponse>('/auth/signup', credentials);
    console.log('Signup successful:', response.data);
    
    // Store the token
    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Signup failed:', error);
    if (axios.isAxiosError(error)) {
      const authError: AuthError = {
        message: error.response?.data?.message || 'Signup failed',
        code: error.response?.data?.code || error.code,
        status: error.response?.status,
        platform: Platform.OS
      };
      throw authError;
    }
    throw { 
      message: 'Network error occurred',
      code: 'UNKNOWN_ERROR',
      platform: Platform.OS
    } as AuthError;
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
  }
};