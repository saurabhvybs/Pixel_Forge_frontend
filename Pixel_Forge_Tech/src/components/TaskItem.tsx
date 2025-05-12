import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../types';
import { colors, spacing, typography } from '../styles/theme';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onPress: (id: string) => void;
}

const TaskItem = ({ task, onToggle, onPress }: TaskItemProps) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(task.id)}
      style={styles.container}
    >
      <TouchableOpacity
        onPress={() => onToggle(task.id, !task.completed)}
        style={[
          styles.checkbox,
          task.completed ? styles.checkboxCompleted : styles.checkboxIncomplete
        ]}
      >
        {task.completed && (
          <View style={styles.checkboxInner} />
        )}
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text 
          style={[
            styles.title,
            task.completed ? styles.textCompleted : styles.textActive
          ]}
        >
          {task.title}
        </Text>
        {task.description ? (
          <Text 
            style={[
              styles.description,
              task.completed ? styles.textCompleted : styles.textSecondary
            ]}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: spacing.sm,
    marginBottom: spacing.sm,
    elevation: 1,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxIncomplete: {
    borderColor: colors.border,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.body,
    fontWeight: '500',
  },
  description: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  textActive: {
    color: colors.text.primary,
  },
  textCompleted: {
    color: colors.text.secondary,
    textDecorationLine: 'line-through',
  },
  textSecondary: {
    color: colors.text.secondary,
  },
});

export default TaskItem;