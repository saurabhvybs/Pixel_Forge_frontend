import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import { View, Text } from '../components/styled';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../types';

type SplashScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Splash'>;

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const { state } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.user) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [state.user, navigation]);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text className="text-2xl font-bold text-primary">Task Manager</Text>
      <Text className="text-gray-600 mt-2">Organize your tasks efficiently</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 128,
    height: 128,
    marginBottom: 16,
  },
});

export default SplashScreen; 