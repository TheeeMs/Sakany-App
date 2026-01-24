import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import type { MaintenanceCategory } from "../types";

interface CategoryButtonProps {
  category: MaintenanceCategory;
  onPress: () => void;
}

export default function CategoryButton({
  category,
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
        style={{ backgroundColor: category.backgroundColor }}
      >
        <IconComponent
          name={category.icon as any}
          size={28}
          color={category.iconColor}
        />
        <Text className="text-sm text-[#0D9488] text-center font-medium mt-2">
          {category.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
