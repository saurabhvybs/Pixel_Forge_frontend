import React, { useState, useCallback } from 'react';
import { ActivityIndicator, View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { CreateTaskData } from '../types';
import { colors, spacing, typography } from '../styles/theme';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      Keyboard.dismiss();
      await onSubmit({ 
        title: title.trim(), 
        description: description.trim() || undefined 
      });
    } catch (error) {
      console.error('Error submitting task:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  }, [title, description, onSubmit]);

  const handleTitleChange = useCallback((text: string) => {
    setTitle(text);
    if (text.trim()) setTitleError('');
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={[styles.input, titleError ? styles.inputError : null]}
          placeholder="Task title"
          value={title}
          onChangeText={handleTitleChange}
          maxLength={100}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => {
            // Focus the description input
            // You'll need to add a ref to the description input
          }}
          accessibilityLabel="Task title input"
          accessibilityHint="Enter the title for your task"
        />
        {titleError ? (
          <Text style={styles.errorText} accessibilityRole="alert">{titleError}</Text>
        ) : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Task description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={500}
          autoCapitalize="sentences"
          returnKeyType="done"
          blurOnSubmit={true}
          onSubmitEditing={handleSubmit}
          accessibilityLabel="Task description input"
          accessibilityHint="Enter a description for your task"
        />
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          (isLoading || isSubmitting) ? styles.submitButtonDisabled : null
        ]}
        onPress={handleSubmit}
        disabled={isLoading || isSubmitting}
        accessibilityRole="button"
        accessibilityLabel={submitButtonText}
        accessibilityState={{ disabled: isLoading || isSubmitting }}
      >
        {(isLoading || isSubmitting) ? (
          <ActivityIndicator color={colors.text.inverse} />
        ) : (
          <Text style={styles.submitButtonText}>{submitButtonText}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    ...typography.body,
  },
  inputError: {
    borderColor: colors.error,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.sm,
    padding: spacing.md,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: colors.primaryLight,
    opacity: 0.7,
  },
  submitButtonText: {
    ...typography.body,
    color: colors.text.inverse,
    fontWeight: '600',
  },
});

export default TaskForm;