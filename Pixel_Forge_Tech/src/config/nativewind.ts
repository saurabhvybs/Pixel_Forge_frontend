import { StyleSheet } from 'react-native';
import { styled } from 'nativewind';

// Create a style object
const styles = StyleSheet.create({});

// Export the styled function and styles
export { styled, styles };

// Export a function to use Tailwind classes
export const useTailwind = () => {
  return {
    className: (classes: string) => {
      return classes;
    },
  };
}; 