// Authentication Types
export interface User {
    id: string;
    email: string;
    name: string;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface SignupCredentials {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }
  
  // Task Types
  export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateTaskData {
    title: string;
    description?: string;
  }
  
  export interface UpdateTaskData {
    title?: string;
    description?: string;
    completed?: boolean;
  }
  
  // Navigation Types
  export type AuthStackParamList = {
    Splash: undefined;
    Login: undefined;
    Signup: undefined;
  };
  
  export type TaskStackParamList = {
    TaskList: undefined;
    AddTask: undefined;
    EditTask: { taskId: string };
    TaskDetail: { taskId: string };
  };