import Constants from 'expo-constants';

const ENV = {
  dev: {
    API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
    APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || 'Pixel Forge Tech',
  },
  staging: {
    API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://staging-api.pixelforge.tech/api',
    APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || 'Pixel Forge Tech',
  },
  prod: {
    API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.pixelforge.tech/api',
    APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || 'Pixel Forge Tech',
  },
};

const getEnvVars = () => {
  // First try to get environment from .env file
  const envFromEnvFile = process.env.EXPO_PUBLIC_ENV;
  // Fallback to expo config
  const envFromExpo = Constants.expoConfig?.extra?.ENV;
  // Default to dev if nothing is set
  const env = envFromEnvFile || envFromExpo || 'dev';
  
  return ENV[env as keyof typeof ENV];
};

export default getEnvVars(); 