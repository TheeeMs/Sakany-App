import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface PassTypeButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function PassTypeButton({
  label,
  isSelected,
  onPress,
}: PassTypeButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 items-center py-3 rounded-xl mx-1 ${
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
      <Text
        className={`text-sm font-semibold ${
          isSelected ? "text-white" : "text-gray-500"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
