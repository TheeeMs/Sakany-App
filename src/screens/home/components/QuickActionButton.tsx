import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";

interface QuickActionButtonProps {
  label: string;
  icon: string;
  iconFamily: "Ionicons" | "MaterialCommunityIcons" | "Feather" | "Octicons";
  backgroundColor: string;
  iconColor: string;
  onPress: () => void;
}

export default function QuickActionButton({
  label,
  icon,
  iconFamily,
  backgroundColor,
  iconColor,
  onPress,
}: QuickActionButtonProps) {
  const renderIcon = () => {
    const iconProps = { size: 34, color: iconColor };

    switch (iconFamily) {
      case "Ionicons":
        return <Ionicons name={icon as any} {...iconProps} />;
      case "MaterialCommunityIcons":
        return <MaterialCommunityIcons name={icon as any} {...iconProps} />;
      case "Feather":
        return <Feather name={icon as any} {...iconProps} />;
      case "Octicons":
        return <Octicons name={icon as any} {...iconProps} />;
      default:
        return <Ionicons name="help-circle-outline" {...iconProps} />;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="items-center justify-center w-[75px]"
      activeOpacity={0.7}
    >
      <View
        className="w-[70px] h-[70px] rounded-2xl items-center justify-center mb-2"
        style={{
          backgroundColor,
          shadowColor: backgroundColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        {renderIcon()}
      </View>
      <Text className="text-gray-700 text-xs font-medium text-center">
        {label}
      </Text>
    </TouchableOpacity>
  );
}
