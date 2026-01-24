import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import type { MaintenanceCategory } from "../types";

interface CategoryButtonProps {
  category: MaintenanceCategory;
  onPress: () => void;
}

export default function CategoryButton({
  category,
  onPress,
}: CategoryButtonProps) {
  const IconComponent =
    category.icon.startsWith("wrench") || category.icon.startsWith("hammer")
      ? Ionicons
      : MaterialCommunityIcons;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="items-center w-[30%] mb-4"
      activeOpacity={0.7}
    >
      <View
        className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
        style={{ backgroundColor: category.backgroundColor }}
      >
        <IconComponent
          name={category.icon as any}
          size={28}
          color={category.iconColor}
        />
      </View>
      <Text className="text-xs text-gray-700 text-center">{category.name}</Text>
    </TouchableOpacity>
  );
}
