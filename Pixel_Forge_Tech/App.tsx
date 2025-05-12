import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, LogBox, Platform, AppState, BackHandler, AppStateStatus } from 'react-native';

// Ignore specific warnings that might be causing issues
LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered',
  'Non-serializable values were found in the navigation state',
  'Tried to remove non-existent frame callback',
]);

export default function App() {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const [isReady, setIsReady] = useState(false);

  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    setAppState(nextAppState);
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Handle back button on Android
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        // Return true to prevent default behavior
        return true;
      });
      return () => {
        subscription.remove();
        backHandler.remove();
      };
    }

    return () => {
      subscription.remove();
    };
  }, [handleAppStateChange]);

  // Initialize app
  useEffect(() => {
    const init = async () => {
      try {
        // Add any initialization logic here
        setIsReady(true);
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    init();
  }, []);

  if (!isReady) {
    return null; // Or a loading screen
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <View 
            style={{ 
              flex: 1, 
              backgroundColor: '#ffffff',
              opacity: 1
            }}
            collapsable={false}
          >
            <StatusBar style="auto" />
            <RootNavigator />
          </View>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}