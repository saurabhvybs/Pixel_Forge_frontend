import React, { useState } from 'react';
import { 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  StyleSheet
} from 'react-native';
import { View, Text, TextInput, TouchableOpacity } from '../../components/styled';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { StatusBar } from 'expo-status-bar';

const SignupScreen = () => {
  const navigation = useNavigation();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      await signUp({ name, email, password });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView}>
        <View className="flex-1 p-6">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Create Account
            </Text>
            <Text className="text-gray-600">
              Sign up to start managing your tasks
            </Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 mb-2">Name</Text>
              <TextInput
                className="bg-gray-100 p-4 rounded-lg text-gray-800"
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2">Email</Text>
              <TextInput
                className="bg-gray-100 p-4 rounded-lg text-gray-800"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2">Password</Text>
              <TextInput
                className="bg-gray-100 p-4 rounded-lg text-gray-800"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2">Confirm Password</Text>
              <TextInput
                className="bg-gray-100 p-4 rounded-lg text-gray-800"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              className="bg-primary py-4 rounded-lg mt-6"
              onPress={handleSignUp}
              disabled={isSubmitting}
            >
              <Text className="text-white text-center font-semibold">
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-4"
              onPress={() => navigation.goBack()}
            >
              <Text className="text-gray-600 text-center">
                Already have an account? <Text className="text-primary font-semibold">Sign In</Text>
              </Text>
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
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default SignupScreen;
