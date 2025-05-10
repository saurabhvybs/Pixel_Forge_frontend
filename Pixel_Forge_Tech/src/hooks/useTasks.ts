import { useState, useEffect, useCallback } from 'react';
import { Task, CreateTaskData, UpdateTaskData } from '../types';
import * as taskApi from '../api/tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await taskApi.fetchTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const getTask = useCallback(async (id: string): Promise<Task | null> => {
    try {
      return await taskApi.fetchTask(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get task');
      return null;
    }
  }, []);

  const addTask = useCallback(async (taskData: CreateTaskData): Promise<Task | null> => {
    try {
      setError(null);
      const newTask = await taskApi.createTask(taskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
      return null;
    }
  }, []);

  const updateTask = useCallback(async (id: string, taskData: UpdateTaskData): Promise<Task | null> => {
    try {
      setError(null);
      const updatedTask = await taskApi.updateTask(id, taskData);
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === id ? updatedTask : task)
      );
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      return null;
    }
  }, []);

  const toggleTaskStatus = useCallback(async (id: string, completed: boolean): Promise<Task | null> => {
    try {
      setError(null);
      const updatedTask = await taskApi.toggleTaskStatus(id, completed);
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === id ? updatedTask : task)
      );
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle task status');
      return null;
    }
  }, []);

  const removeTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await taskApi.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      return false;
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    getTask,
    addTask,
    updateTask,
    toggleTaskStatus,
    removeTask,
  };
};