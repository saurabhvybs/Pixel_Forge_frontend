import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, CreateTaskData, UpdateTaskData } from '../types';
import env from '../config/env';

// Create axios instance with auth header
const authAxios = axios.create({
  baseURL: env.API_URL,
});

// Add request interceptor to include auth token
authAxios.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await authAxios.get('/tasks');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch tasks');
    }
    throw new Error('Network error occurred');
  }
};

export const fetchTask = async (id: string): Promise<Task> => {
  try {
    const response = await authAxios.get(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch task');
    }
    throw new Error('Network error occurred');
  }
};

export const createTask = async (taskData: CreateTaskData): Promise<Task> => {
  try {
    const response = await authAxios.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to create task');
    }
    throw new Error('Network error occurred');
  }
};

export const updateTask = async (id: string, taskData: UpdateTaskData): Promise<Task> => {
  try {
    const response = await authAxios.put(`/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to update task');
    }
    throw new Error('Network error occurred');
  }
};

export const toggleTaskStatus = async (id: string, completed: boolean): Promise<Task> => {
  return updateTask(id, { completed });
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    await authAxios.delete(`/tasks/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to delete task');
    }
    throw new Error('Network error occurred');
  }
};