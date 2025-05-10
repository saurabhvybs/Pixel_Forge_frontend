import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { View, Text, TextInput, TouchableOpacity } from './styled';
import { CreateTaskData } from '../types';

interface TaskFormProps {
  initialValues?: {
    title: string;
    description: string;
  };
  onSubmit: (data: CreateTaskData) => Promise<void>;
  submitButtonText: string;
  isLoading: boolean;
}

const TaskForm = ({ 
  initialValues = { title: '', description: '' }, 
  onSubmit, 
  submitButtonText,
  isLoading 
}: TaskFormProps) => {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description || '');
  const [titleError, setTitleError] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    
    setTitleError('');
    await onSubmit({ 
      title: title.trim(), 
      description: description.trim() || undefined 
    });
  };

  return (
    <View className="p-4">
      <View className="mb-4">
        <Text className="text-gray-700 mb-2 font-medium">Title *</Text>
        <TextInput
          className={`border rounded-lg p-3 bg-gray-50 ${
            titleError ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Task title"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (text.trim()) setTitleError('');
          }}
        />
        {titleError ? (
          <Text className="text-red-500 text-sm mt-1">{titleError}</Text>
        ) : null}
      </View>

      <View className="mb-6">
        <Text className="text-gray-700 mb-2 font-medium">Description (optional)</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 bg-gray-50"
          placeholder="Task description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity
        className={`rounded-lg p-4 ${isLoading ? 'bg-primary-light' : 'bg-primary'}`}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-white font-semibold text-center">{submitButtonText}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TaskForm;