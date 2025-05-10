import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { ActivityIndicator } from 'react-native';
import { View } from '../components/styled';

const RootNavigator = () => {
  const auth = useContext(AuthContext);
  
  if (!auth) {
    throw new Error("AuthContext not found");
  }
  
  const { state } = auth;

  if (state.isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  // If user is authenticated, show the app stack
  if (state.user) {
    return <AppNavigator />;
  }

  // Otherwise, show the auth stack
  return <AuthNavigator />;
};

export default RootNavigator;