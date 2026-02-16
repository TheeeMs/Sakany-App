import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
}

export default function ActionButton({
  icon,
  label,
  onPress,
  variant = "primary",
}: ActionButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-center py-3 px-4 rounded-xl ${
        variant === "primary" ? "bg-white" : "bg-teal-400"
      }`}
      activeOpacity={0.8}
    >
      <Ionicons
        name={icon}
        size={18}
        color={variant === "primary" ? "#0D9488" : "#FFFFFF"}
      />
      <Text
        className={`ml-2 text-sm font-semibold ${
          variant === "primary" ? "text-teal-600" : "text-white"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
