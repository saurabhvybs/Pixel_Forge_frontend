import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, LoginCredentials, SignupCredentials, User, AuthError } from '../types/auth';
import { login, signup, logout } from '../api/auth';

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  error: null,
};

// Action types
type AuthAction =
  | { type: 'RESTORE_TOKEN'; payload: { user: User; token: string } }
  | { type: 'SIGN_IN'; payload: { user: User; token: string } }
  | { type: 'SIGN_OUT' }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        error: null,
      };
    case 'SIGN_IN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        error: null,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Context
type AuthContextType = {
  state: AuthState;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: SignupCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for stored token on app start
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userJson = await AsyncStorage.getItem('user');
        
        if (token && userJson) {
          const user = JSON.parse(userJson) as User;
          dispatch({
            type: 'RESTORE_TOKEN',
            payload: { user, token },
          });
        } else {
          dispatch({
            type: 'SIGN_OUT',
          });
        }
      } catch (e) {
        dispatch({
          type: 'SIGN_OUT',
        });
      }
    };

    bootstrapAsync();
  }, []);

  // Auth actions
  const authActions = {
    signIn: async (credentials: LoginCredentials) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await login(credentials);
        const { user, token } = response;
        
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        dispatch({
          type: 'SIGN_IN',
          payload: { user, token },
        });
      } catch (error) {
        const authError = error as AuthError;
        dispatch({
          type: 'AUTH_ERROR',
          payload: authError.message || 'Login failed',
        });
      }
    },
    
    signUp: async (credentials: SignupCredentials) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await signup(credentials);
        const { user, token } = response;
        
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        dispatch({
          type: 'SIGN_IN',
          payload: { user, token },
        });
      } catch (error) {
        const authError = error as AuthError;
        dispatch({
          type: 'AUTH_ERROR',
          payload: authError.message || 'Signup failed',
        });
      }
    },
    
    signOut: async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await logout();
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('user');
        dispatch({ type: 'SIGN_OUT' });
      } catch (error) {
        console.error('Logout error:', error);
        dispatch({ type: 'SIGN_OUT' });
      }
    },
    
    clearError: () => {
      dispatch({ type: 'CLEAR_ERROR' });
    },
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        ...authActions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };