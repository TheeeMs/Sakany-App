import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface PassTypeTabProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function PassTypeTab({
  label,
  isSelected,
  onPress,
}: PassTypeTabProps) {
  return (
    <TouchableOpacity onPress={onPress} className="flex-1 items-center py-2">
      <Text
        className={`text-sm font-semibold ${
          isSelected ? "text-[#0D9488]" : "text-gray-400"
        }`}
      >
        {label}
      </Text>
      {isSelected && (
        <View className="absolute bottom-0 w-16 h-0.5 bg-[#0D9488] rounded-full" />
      )}
    </TouchableOpacity>
  );
}
