import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import type { MaintenanceCategory } from "../types";

interface CategoryButtonProps {
  category: MaintenanceCategory;
  isSelected?: boolean;
  onPress: () => void;
}

export default function CategoryButton({
  category,
  isSelected = false,
  onPress,
}: CategoryButtonProps) {
  const getIconComponent = () => {
    if (category.icon.startsWith("air")) return Entypo;
    if (
      category.icon.startsWith("wrench") ||
      category.icon.startsWith("hammer") ||
      category.icon.startsWith("snow") ||
      category.icon.startsWith("water") ||
      category.icon.startsWith("flash")
    )
      return Ionicons;
    return MaterialCommunityIcons;
  };

  const IconComponent = getIconComponent();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-[32%] mb-3"
      activeOpacity={0.7}
    >
      <View
        className="w-28 h-20 rounded-2xl items-center justify-center py-4 px-2"
        style={{
          backgroundColor: isSelected ? "#14B8A6" : category.backgroundColor,
          borderWidth: isSelected ? 2 : 0,
          borderColor: isSelected ? "#0F766E" : "transparent",
        }}
      >
        <IconComponent
          name={category.icon as any}
          size={28}
          color={isSelected ? "#FFFFFF" : category.iconColor}
        />
        <Text
          className="text-sm text-center font-medium mt-2"
          style={{ color: isSelected ? "#FFFFFF" : "#0D9488" }}
        >
          {category.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
