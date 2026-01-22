import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { VisitorType } from "../types";

interface VisitorTypeButtonProps {
  type: VisitorType;
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onPress: () => void;
}

export default function VisitorTypeButton({
  type,
  label,
  icon,
  isSelected,
  onPress,
}: VisitorTypeButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`items-center justify-center w-[70px] h-[70px] rounded-xl ${
        isSelected ? "bg-[#0D9488]" : "bg-white border border-gray-200"
      }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isSelected ? 0.15 : 0.05,
        shadowRadius: 4,
        elevation: isSelected ? 4 : 2,
      }}
    >
      <View className="mb-1">{icon}</View>
      <Text
        className={`text-xs font-medium ${
          isSelected ? "text-white" : "text-gray-600"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
