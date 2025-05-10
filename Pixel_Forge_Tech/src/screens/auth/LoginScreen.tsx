import React, { useContext, useState } from 'react';
import { 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet
} from 'react-native';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from '../../components/styled';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types';
import { AuthContext } from '../../context/AuthContext';
import { StatusBar } from 'expo-status-bar';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const auth = useContext(AuthContext);
  
  if (!auth) {
    throw new Error("AuthContext not found");
  }
  
  const { signIn, state, clearError } = auth;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Display error if there is one
  React.useEffect(() => {
    if (state.error) {
      Alert.alert('Error', state.error);
      clearError();
    }
  }, [state.error]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await signIn({ email, password });
    } catch (error) {
      // Error is already handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center px-8 py-16 bg-white">
          <View className="mb-8 items-center">
            <Text className="text-3xl font-bold text-gray-800">Task Manager</Text>
            <Text className="text-gray-500 mt-2">Login to your account</Text>
          </View>
          
          <View className="mb-6">
            <Text className="text-gray-700 mb-2 font-medium">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 bg-gray-50"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          
          <View className="mb-8">
            <Text className="text-gray-700 mb-2 font-medium">Password</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 bg-gray-50"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity
            className={`rounded-lg p-4 ${isSubmitting ? 'bg-primary-light' : 'bg-primary'}`}
            onPress={handleLogin}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-semibold text-center">Login</Text>
            )}
          </TouchableOpacity>
          
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text className="text-primary font-semibold">Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LoginScreen;