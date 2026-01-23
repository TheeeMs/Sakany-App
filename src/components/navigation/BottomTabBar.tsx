import { View, Text, Pressable } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
    icon: "build-outline",
    activeIcon: "build",
    label: "Service",
  },
  Payment: {
    name: "Payment",
    icon: "wallet-outline",
    activeIcon: "wallet",
    label: "Payment",
  },
  Profile: {
    name: "Profile",
    icon: "person-outline",
    activeIcon: "person",
    label: "Profile",
  },
};

// Animated Tab Item Component
function TabItem({
  route,
  isFocused,
  options,
  onPress,
  onLongPress,
}: {
  route: any;
  isFocused: boolean;
  options: any;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const tabConfig = TAB_CONFIG[route.name];
  const label = tabConfig?.label || route.name;
  const iconName = isFocused
    ? tabConfig?.activeIcon
    : tabConfig?.icon || "home-outline";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      onPress={onPress}
      onLongPress={onLongPress}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 6,
      }}
    >
      <View style={{ alignItems: "center" }}>
        {/* Icon Container */}
        {isFocused ? (
          <LinearGradient
            colors={["#14B8A6", "#0D9488"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#14B8A6",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Ionicons name={iconName} size={18} color="#FFFFFF" />
          </LinearGradient>
        ) : (
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name={iconName} size={18} color="#94A3B8" />
          </View>
        )}

        {/* Label */}
        <Text
          style={{
            marginTop: 2,
            fontSize: 10,
            fontWeight: isFocused ? "600" : "400",
            color: isFocused ? "#14B8A6" : "#94A3B8",
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

export default function BottomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: insets.bottom,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 20,
      }}
    >
      {/* Tab Items Container */}
      <View
        style={{
          flexDirection: "row",
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

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
            <TabItem
              key={route.key}
              route={route}
              isFocused={isFocused}
              options={options}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </View>
  );
}
