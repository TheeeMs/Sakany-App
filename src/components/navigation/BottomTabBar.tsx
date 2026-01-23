import { View, Text, TouchableOpacity } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

type TabIconName = keyof typeof Ionicons.glyphMap;

interface TabConfig {
  name: string;
  icon: TabIconName;
  activeIcon: TabIconName;
  label: string;
}

const TAB_CONFIG: Record<string, TabConfig> = {
  Home: {
    name: "Home",
    icon: "home-outline",
    activeIcon: "home",
    label: "Home",
  },
  Maintenance: {
    name: "Maintenance",
    icon: "construct-outline",
    activeIcon: "construct",
    label: "Maintenance",
  },
  Payment: {
    name: "Payment",
    icon: "card-outline",
    activeIcon: "card",
    label: "Payment",
  },
  Profile: {
    name: "Profile",
    icon: "person-outline",
    activeIcon: "person",
    label: "Profile",
  },
};

export default function BottomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View className="flex-row bg-white border-t border-gray-200 pb-1 pt-1 rounded-t-3xl shadow-lg">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const tabConfig = TAB_CONFIG[route.name];
        const label = tabConfig?.label || route.name;
        const iconName = isFocused
          ? tabConfig?.activeIcon
          : tabConfig?.icon || "home-outline";

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            className="flex-1 items-center justify-center py-1"
          >
            <Ionicons
              name={iconName}
              size={22}
              color={isFocused ? "#14B8A6" : "#9CA3AF"}
            />
            <Text
              className={`mt-0.5 text-[10px] ${
                isFocused ? "text-teal-500 font-medium" : "text-gray-400"
              }`}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
