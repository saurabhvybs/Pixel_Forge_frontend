import { StyleSheet } from 'react-native';
import {
  ScrollView as RNScrollView,
  View as RNView,
  Text as RNText,
  TouchableOpacity as RNTouchableOpacity,
  TextInput as RNTextInput,
  Image as RNImage,
  Pressable as RNPressable,
} from 'react-native';
import {
  StyledViewProps,
  StyledTextProps,
  StyledTouchableOpacityProps,
  StyledTextInputProps,
  StyledImageProps,
  StyledPressableProps,
  StyledScrollViewProps,
} from '../types/styled';

// Create styled components using StyleSheet
const styles = StyleSheet.create({
  scrollView: {},
  view: {},
  text: {},
  touchableOpacity: {},
  textInput: {},
  image: {},
  pressable: {},
});

// Export styled components
export const ScrollView = (props: StyledScrollViewProps) => (
  <RNScrollView {...props} style={[styles.scrollView, props.style]} />
);
export const View = (props: StyledViewProps) => (
  <RNView {...props} style={[styles.view, props.style]} />
);
export const Text = (props: StyledTextProps) => (
  <RNText {...props} style={[styles.text, props.style]} />
);
export const TouchableOpacity = (props: StyledTouchableOpacityProps) => (
  <RNTouchableOpacity {...props} style={[styles.touchableOpacity, props.style]} />
);
export const TextInput = (props: StyledTextInputProps) => (
  <RNTextInput {...props} style={[styles.textInput, props.style]} />
);
export const Image = (props: StyledImageProps) => (
  <RNImage {...props} style={[styles.image, props.style]} />
);
export const Pressable = (props: StyledPressableProps) => (
  <RNPressable {...props} style={[styles.pressable, props.style]} />
); 