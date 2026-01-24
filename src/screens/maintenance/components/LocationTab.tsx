import { TouchableOpacity, Text } from "react-native";
import type { RequestLocation } from "../types";

interface LocationTabProps {
  location: RequestLocation;
  isSelected: boolean;
  onPress: () => void;
}

export default function LocationTab({
  location,
  isSelected,
  onPress,
}: LocationTabProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 py-2 px-4 rounded-full ${
        isSelected ? "bg-teal-500" : "bg-gray-100"
      }`}
      activeOpacity={0.7}
    >
      <Text
        className={`text-center text-sm font-medium ${
          isSelected ? "text-white" : "text-gray-600"
        }`}
      >
        {location}
      </Text>
    </TouchableOpacity>
  );
}
