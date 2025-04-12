import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  GestureResponderEvent,
} from "react-native";
import Indicator from "./indicator";

interface LoadingButtonProps {
  isLoading: boolean;
  loadingText: string;
  defaultText: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  spinnerSize?: "small" | "large" | number;
  spinnerColor?: string;
  className?: string;
  textClassName?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  loadingText = "Loading...",
  defaultText = "Submit",
  onPress,
  disabled = false,
  spinnerSize = "small",
  spinnerColor = "white",
  className = "",
  textClassName = "text-white font-medium text-center",
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading || disabled}
      className={`${className}`}
    >
      {isLoading ? (
        <View className="flex-row items-center justify-center gap-4">
          <Indicator size={spinnerSize} color={spinnerColor} />
          <Text className={textClassName}>{loadingText}</Text>
        </View>
      ) : (
        <Text className={textClassName}>{defaultText}</Text>
      )}
    </TouchableOpacity>
  );
};

export default LoadingButton;
