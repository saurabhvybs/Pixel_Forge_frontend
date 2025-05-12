import React, { useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  Alert,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TaskStackParamList } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import TaskItem from '../../components/TaskItem';
import Loading from '../../components/Loading';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, typography, commonStyles } from '../../styles/theme';

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
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddTask')}
            style={styles.headerButton}
          >
            <Ionicons name="add" size={24} color={colors.background} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color={colors.background} />
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
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchTasks}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="list" size={64} color={colors.text.light} />
          <Text style={styles.emptyText}>
            You don't have any tasks yet
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddTask')}
          >
            <Text style={styles.addButtonText}>Add Your First Task</Text>
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
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchTasks}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
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
    ...typography.body,
    color: colors.error,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    ...commonStyles.button,
    paddingHorizontal: spacing.lg,
  },
  retryButtonText: {
    ...commonStyles.buttonText,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.h2,
    color: colors.text.secondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  addButton: {
    ...commonStyles.button,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  addButtonText: {
    ...commonStyles.buttonText,
  },
  listContent: {
    padding: spacing.md,
  },
});

export default TaskListScreen;