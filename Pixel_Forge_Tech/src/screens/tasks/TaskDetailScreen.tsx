import React, { useEffect, useState } from 'react';
import { 
  Alert, 
  ScrollView 
} from 'react-native';
import { View, Text, TouchableOpacity } from '../../components/styled';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TaskStackParamList } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import Loading from '../../components/Loading';
import { Task } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

type TaskDetailScreenRouteProp = RouteProp<TaskStackParamList, 'TaskDetail'>;
type TaskDetailScreenNavigationProp = StackNavigationProp<TaskStackParamList, 'TaskDetail'>;

const TaskDetailScreen = () => {
  const navigation = useNavigation<TaskDetailScreenNavigationProp>();
  const route = useRoute<TaskDetailScreenRouteProp>();
  const { taskId } = route.params;
  
  const { getTask, toggleTaskStatus, removeTask } = useTasks();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadTask = async () => {
    try {
      setIsLoading(true);
      const fetchedTask = await getTask(taskId);
      setTask(fetchedTask);
    } catch (error) {
      Alert.alert('Error', 'Failed to load task');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTask();
  }, [taskId]);

  // Set header right buttons
  React.useLayoutEffect(() => {
    if (task) {
      navigation.setOptions({
        headerRight: () => (
          <View className="flex-row mr-4">
            <TouchableOpacity
              onPress={() => navigation.navigate('EditTask', { taskId })}
              className="mr-6"
            >
              <Ionicons name="create-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Ionicons name="trash-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ),
      });
    }
  }, [navigation, task, taskId]);

  const handleToggleStatus = async () => {
    if (!task) return;
    
    try {
      const updatedTask = await toggleTaskStatus(taskId, !task.completed);
      if (updatedTask) {
        setTask(updatedTask);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update task status');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            try {
              const success = await removeTask(taskId);
              if (success) {
                navigation.goBack();
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task');
            }
          } 
        }
      ]
    );
  };

  if (isLoading) {
    return <Loading message="Loading task..." />;
  }

  if (!task) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-lg text-gray-600">Task not found</Text>
        <TouchableOpacity
          className="mt-4 bg-primary py-2 px-6 rounded-lg"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      <ScrollView>
        <View className="p-6">
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              onPress={handleToggleStatus}
              className={`w-8 h-8 rounded-full border-2 mr-4 items-center justify-center ${
                task.completed ? 'bg-primary border-primary' : 'border-gray-400'
              }`}
            >
              {task.completed && (
                <Ionicons name="checkmark" size={20} color="white" />
              )}
            </TouchableOpacity>
            
            <Text 
              className={`text-2xl font-semibold ${
                task.completed ? 'text-gray-400 line-through' : 'text-gray-800'
              }`}
            >
              {task.title}
            </Text>
          </View>

          {task.description ? (
            <View className="mt-2 mb-6">
              <Text className="text-gray-600 text-lg leading-relaxed">
                {task.description}
              </Text>
            </View>
          ) : null}

          <View className="mt-8 pt-6 border-t border-gray-200">
            <Text className="text-gray-500 mb-2">
              Status: <Text className={task.completed ? "text-green-600 font-medium" : "text-orange-500 font-medium"}>
                {task.completed ? 'Completed' : 'Pending'}
              </Text>
            </Text>
            <Text className="text-gray-500">
              Created: {new Date(task.createdAt).toLocaleString()}
            </Text>
            <Text className="text-gray-500">
              Last updated: {new Date(task.updatedAt).toLocaleString()}
            </Text>
          </View>

          <View className="mt-8 flex-row">
            <TouchableOpacity
              onPress={() => navigation.navigate('EditTask', { taskId })}
              className="flex-1 bg-primary py-3 rounded-lg mr-2 flex-row justify-center items-center"
            >
              <Ionicons name="create-outline" size={20} color="white" />
              <Text className="text-white font-medium ml-2">Edit Task</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleToggleStatus}
              className="flex-1 bg-secondary py-3 rounded-lg ml-2 flex-row justify-center items-center"
            >
              <Ionicons 
                name={task.completed ? "refresh-outline" : "checkmark-circle-outline"} 
                size={20}
                color="white" 
              />
              <Text className="text-white font-medium ml-2">
                {task.completed ? 'Mark as Pending' : 'Mark as Complete'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TaskDetailScreen;