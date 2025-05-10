import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTasks } from '../../hooks/useTasks';
import TaskForm from '../../components/TaskForm';
import { CreateTaskData } from '../../types';
import { StatusBar } from 'expo-status-bar';

const AddTaskScreen = () => {
  const navigation = useNavigation();
  const { addTask } = useTasks();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateTaskData) => {
    try {
      setIsSubmitting(true);
      const result = await addTask(data);
      if (result) {
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create task. Please try again.');
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
        <TaskForm
          onSubmit={handleSubmit}
          submitButtonText="Create Task"
          isLoading={isSubmitting}
        />
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

export default AddTaskScreen;