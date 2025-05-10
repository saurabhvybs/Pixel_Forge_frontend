import { ViewProps, TextProps, TouchableOpacityProps, TextInputProps, ImageProps, PressableProps, ScrollViewProps } from 'react-native';

export interface StyledViewProps extends ViewProps {
  className?: string;
}

export interface StyledTextProps extends TextProps {
  className?: string;
}

export interface StyledTouchableOpacityProps extends TouchableOpacityProps {
  className?: string;
}

export interface StyledTextInputProps extends TextInputProps {
  className?: string;
}

export interface StyledImageProps extends ImageProps {
  className?: string;
}

export interface StyledPressableProps extends PressableProps {
  className?: string;
}

export interface StyledScrollViewProps extends ScrollViewProps {
  className?: string;
} 