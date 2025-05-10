import { Platform } from 'react-native';

const getApiUrl = () => {
  // if (Platform.OS === 'android') {
  //   return 'http://10.0.2.2:3000/api';
  // } else if (Platform.OS === 'ios') {
  //   return 'http://localhost:3000/api';
  // }
  // // Fallback for web or physical device (replace with your machine's IP if needed)
  // return 'http://192.168.220.239:3000/api';
  return 'https://pixel-forge-tech.onrender.com/api';
};

export default {
  API_URL: getApiUrl(),
  APP_NAME: 'Pixel Forge Tech',
};