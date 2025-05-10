import React from 'react';
import { View, Text, TouchableOpacity } from './styled';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onPress: (id: string) => void;
}

const TaskItem = ({ task, onToggle, onPress }: TaskItemProps) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(task.id)}
      className="flex-row items-center p-4 bg-white rounded-lg mb-3 shadow-sm"
    >
      <TouchableOpacity
        onPress={() => onToggle(task.id, !task.completed)}
        className={`w-6 h-6 rounded-full border mr-3 items-center justify-center ${
          task.completed ? 'bg-primary border-primary' : 'border-gray-400'
        }`}
      >
        {task.completed && (
          <View className="w-3 h-3 bg-white rounded-full" />
        )}
      </TouchableOpacity>
      
      <View className="flex-1">
        <Text 
          className={`text-base font-medium ${
            task.completed ? 'text-gray-400 line-through' : 'text-gray-800'
          }`}
        >
          {task.title}
        </Text>
        {task.description ? (
          <Text 
            className={`text-sm mt-1 ${
              task.completed ? 'text-gray-400' : 'text-gray-600'
            }`}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default TaskItem;