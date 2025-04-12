import React from "react";
import { ActivityIndicator } from "react-native";

const Indicator = ({
  size = "small",
  color = "#1672EC",
}: {
  size?: "large" | "small" | number;
  color?: string;
}) => {
  return <ActivityIndicator size={size} color={color} />;
};

export default Indicator;
