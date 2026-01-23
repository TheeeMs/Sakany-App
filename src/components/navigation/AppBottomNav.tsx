import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

type TabIconName = keyof typeof Ionicons.glyphMap;

interface TabItem {
  name: string;
  route: string;
  icon: TabIconName;
  activeIcon: TabIconName;
  label: string;
}

const TABS: TabItem[] = [
  {
    name: "Home",
    route: "Main",
    icon: "home-outline",
    activeIcon: "home",
    label: "Home",
  },
  {
    name: "Maintenance",
    route: "Main",
    icon: "construct-outline",
    activeIcon: "construct",
    label: "Maintenance",
  },
  {
    name: "Payment",
    route: "Main",
    icon: "card-outline",
    activeIcon: "card",
    label: "Payment",
  },
  {
    name: "Profile",
    route: "Main",
    icon: "person-outline",
    activeIcon: "person",
    label: "Profile",
  },
];

export default function AppBottomNav() {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View className="flex-row bg-white border-t border-gray-200 pb-1 pt-1">
      {TABS.map((tab) => {
        const isFocused = route.name === tab.name;
        const iconName = isFocused ? tab.activeIcon : tab.icon;

        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(
              tab.route as never,
              { screen: tab.name } as never,
            );
          }
        };

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={onPress}
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
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
