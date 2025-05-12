import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../styles/theme';
import { useAuth } from '../hooks/useAuth';

const ProfileScreen = () => {
  const { state, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.email}>{state.user?.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.md,
  },
  email: {
    ...typography.body,
    color: colors.text.secondary,
  },
});

export default ProfileScreen; 