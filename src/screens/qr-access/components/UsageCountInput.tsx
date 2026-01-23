import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface UsageCountInputProps {
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
}

export function UsageCountInput({
  value,
  onChange,
  minValue = 1,
  maxValue = 10,
}: UsageCountInputProps) {
  const increment = () => {
    if (value < maxValue) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > minValue) {
      onChange(value - 1);
    }
  };

  return (
    <View className="flex-row items-center border border-gray-200 rounded-xl px-4 py-3">
      <Ionicons name="refresh-outline" size={20} color="#9CA3AF" />
      <Text className="flex-1 ml-3 text-base text-gray-700">Usage Count</Text>

      <View className="flex-row items-center">
        {/* Decrement Button */}
        <TouchableOpacity
          onPress={decrement}
          disabled={value <= minValue}
          className={`w-9 h-9 rounded-lg items-center justify-center ${
            value <= minValue ? "bg-gray-100" : "bg-[#0D9488]/10"
          }`}
          activeOpacity={0.7}
        >
          <Ionicons
            name="remove"
            size={20}
            color={value <= minValue ? "#D1D5DB" : "#0D9488"}
          />
        </TouchableOpacity>

        {/* Value Display */}
        <View className="w-12 items-center">
          <Text className="text-lg font-bold text-gray-800">{value}</Text>
        </View>

        {/* Increment Button */}
        <TouchableOpacity
          onPress={increment}
          disabled={value >= maxValue}
          className={`w-9 h-9 rounded-lg items-center justify-center ${
            value >= maxValue ? "bg-gray-100" : "bg-[#0D9488]/10"
          }`}
          activeOpacity={0.7}
        >
          <Ionicons
            name="add"
            size={20}
            color={value >= maxValue ? "#D1D5DB" : "#0D9488"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default UsageCountInput;
