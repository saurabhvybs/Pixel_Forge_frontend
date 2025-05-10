import React, { useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  Alert
} from 'react-native';
import { View, Text, TouchableOpacity } from '../../components/styled';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TaskStackParamList } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import TaskItem from '../../components/TaskItem';
import Loading from '../../components/Loading';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

type TaskListScreenNavigationProp = StackNavigationProp<TaskStackParamList, 'TaskList'>;

const TaskListScreen = () => {
  const navigation = useNavigation<TaskListScreenNavigationProp>();
  const { signOut } = useAuth();
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    toggleTaskStatus
  } = useTasks();

  // Refresh tasks when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );

  // Handle signout
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => signOut() }
      ]
    );
  };

  // Set header right button
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="flex-row mr-4">
          <TouchableOpacity
            onPress={() => navigation.navigate('AddTask')}
            className="mr-6"
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const handleToggleTask = async (id: string, completed: boolean) => {
    await toggleTaskStatus(id, completed);
  };

  const handleTaskPress = (id: string) => {
    navigation.navigate('TaskDetail', { taskId: id });
  };

  if (loading && tasks.length === 0) {
    return <Loading message="Loading tasks..." />;
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 mb-4 text-center">{error}</Text>
        <TouchableOpacity
          className="bg-primary rounded-lg py-3 px-6"
          onPress={fetchTasks}
        >
          <Text className="text-white font-medium">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar style="light" />
      {tasks.length === 0 ? (
        <View className="flex-1 justify-center items-center p-8">
          <Ionicons name="list" size={64} color="#d1d5db" />
          <Text className="text-xl text-gray-600 mt-4 text-center">
            You don't have any tasks yet
          </Text>
          <TouchableOpacity
            className="mt-6 bg-primary py-3 px-6 rounded-lg"
            onPress={() => navigation.navigate('AddTask')}
          >
            <Text className="text-white font-semibold">Add Your First Task</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={handleToggleTask}
              onPress={handleTaskPress}
            />
          )}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchTasks}
              colors={['#4f46e5']}
            />
          }
        />
      )}
    </View>
  );
};

export default TaskListScreen;