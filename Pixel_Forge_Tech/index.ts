import 'react-native-gesture-handler'; // ✅ MUST BE FIRST
import { LogBox } from 'react-native';
import { registerRootComponent } from 'expo';
import App from './App';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered',
  'Non-serializable values were found in the navigation state',
]);

// Register the root component
registerRootComponent(App);
