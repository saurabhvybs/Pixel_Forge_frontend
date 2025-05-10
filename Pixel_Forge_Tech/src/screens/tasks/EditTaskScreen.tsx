import React, { useState, useEffect } from 'react';
import { 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  StyleSheet
} from 'react-native';
import { View } from '../../components/styled';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { TaskStackParamList } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import TaskForm from '../../components/TaskForm';
import Loading from '../../components/Loading';
import { CreateTaskData } from '../../types';
import { StatusBar } from 'expo-status-bar';

type EditTaskScreenRouteProp = RouteProp<TaskStackParamList, 'EditTask'>;

const EditTaskScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<EditTaskScreenRouteProp>();
  const { taskId } = route.params;
  
  const { getTask, updateTask } = useTasks();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    const loadTask = async () => {
      try {
        const task = await getTask(taskId);
        if (task) {
          setInitialValues({
            title: task.title,
            description: task.description || '',
          });
        } else {
          Alert.alert('Error', 'Could not find task');
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load task');
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };

    loadTask();
  }, [taskId, getTask, navigation]);

  const handleSubmit = async (data: CreateTaskData) => {
    try {
      setIsSubmitting(true);
      const result = await updateTask(taskId, data);
      if (result) {
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading message="Loading task..." />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView}>
        <TaskForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitButtonText="Update Task"
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

export default EditTaskScreen;