import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TaskStackParamList } from '../types';
import TaskListScreen from '../screens/tasks/TaskListScreen';
import AddTaskScreen from '../screens/tasks/AddTaskScreen';
import EditTaskScreen from '../screens/tasks/EditTaskScreen';
import TaskDetailScreen from '../screens/tasks/TaskDetailScreen';

const Stack = createStackNavigator<TaskStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="TaskList"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4f46e5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="TaskList" 
        component={TaskListScreen} 
        options={{ title: 'My Tasks' }} 
      />
      <Stack.Screen 
        name="AddTask" 
        component={AddTaskScreen} 
        options={{ title: 'Add New Task' }} 
      />
      <Stack.Screen 
        name="EditTask" 
        component={EditTaskScreen} 
        options={{ title: 'Edit Task' }} 
      />
      <Stack.Screen 
        name="TaskDetail" 
        component={TaskDetailScreen} 
        options={{ title: 'Task Details' }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;