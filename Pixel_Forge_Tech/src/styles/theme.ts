import { StyleSheet, Dimensions, TextStyle } from 'react-native';

const { width, height } = Dimensions.get('window');

export const colors = {
  primary: '#4F46E5',
  primaryLight: '#818CF8',
  secondary: '#10B981',
  background: '#FFFFFF',
  surface: '#F9FAFB',
  card: '#FFFFFF',
  text: {
    primary: '#1F2937',
    secondary: '#4B5563',
    light: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  shadow: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography: Record<string, TextStyle> = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text.primary,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
  },
  body: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  caption: {
    fontSize: 14,
    color: colors.text.light,
  },
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    color: colors.text.primary,
    fontSize: 16,
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const dimensions = {
  width,
  height,
}; 