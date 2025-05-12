import React, { useEffect, useState } from 'react';
import { 
  Alert, 
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TaskStackParamList } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import Loading from '../../components/Loading';
import { Task } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, typography, commonStyles } from '../../styles/theme';

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

  React.useLayoutEffect(() => {
    if (task) {
      navigation.setOptions({
        headerRight: () => (
          <View style={styles.headerButtons}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditTask', { taskId })}
              style={styles.headerButton}
            >
              <Ionicons name="create-outline" size={24} color={colors.background} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Ionicons name="trash-outline" size={24} color={colors.background} />
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
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Task not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <TouchableOpacity
              onPress={handleToggleStatus}
              style={[
                styles.checkbox,
                task.completed && styles.checkboxCompleted
              ]}
            >
              {task.completed && (
                <Ionicons name="checkmark" size={20} color={colors.background} />
              )}
            </TouchableOpacity>
            
            <Text style={[
              styles.title,
              task.completed && styles.titleCompleted
            ]}>
              {task.title}
            </Text>
          </View>

          {task.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>
                {task.description}
              </Text>
            </View>
          ) : null}

          <View style={styles.metadataContainer}>
            <Text style={styles.metadataText}>
              Status: <Text style={[
                styles.metadataValue,
                task.completed ? styles.statusCompleted : styles.statusPending
              ]}>
                {task.completed ? 'Completed' : 'Pending'}
              </Text>
            </Text>
            <Text style={styles.metadataText}>
              Created: {new Date(task.createdAt).toLocaleString()}
            </Text>
            <Text style={styles.metadataText}>
              Last updated: {new Date(task.updatedAt).toLocaleString()}
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditTask', { taskId })}
              style={[styles.actionButton, styles.editButton]}
            >
              <Ionicons name="create-outline" size={20} color={colors.background} />
              <Text style={styles.actionButtonText}>Edit Task</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleToggleStatus}
              style={[styles.actionButton, styles.toggleButton]}
            >
              <Ionicons 
                name={task.completed ? "refresh-outline" : "checkmark-circle-outline"} 
                size={20}
                color={colors.background} 
              />
              <Text style={styles.actionButtonText}>
                {task.completed ? 'Mark as Pending' : 'Mark as Complete'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButtons: {
    flexDirection: 'row',
    marginRight: spacing.md,
  },
  headerButton: {
    marginRight: spacing.lg,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  errorText: {
    ...typography.h3,
    color: colors.text.secondary,
  },
  backButton: {
    ...commonStyles.button,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  backButtonText: {
    ...commonStyles.buttonText,
  },
  content: {
    padding: spacing.xl,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.text.light,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  title: {
    ...typography.h1,
    flex: 1,
  },
  titleCompleted: {
    color: colors.text.light,
    textDecorationLine: 'line-through',
  },
  descriptionContainer: {
    marginBottom: spacing.lg,
  },
  description: {
    ...typography.body,
    lineHeight: 24,
  },
  metadataContainer: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metadataText: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  metadataValue: {
    fontWeight: '600',
  },
  statusCompleted: {
    color: colors.success,
  },
  statusPending: {
    color: colors.error,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  toggleButton: {
    backgroundColor: colors.secondary,
  },
  actionButtonText: {
    ...commonStyles.buttonText,
    marginLeft: spacing.xs,
  },
});

export default TaskDetailScreen;