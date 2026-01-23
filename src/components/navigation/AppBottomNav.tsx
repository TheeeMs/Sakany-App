import { View, Text, Pressable } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
    icon: "build-outline",
    activeIcon: "build",
    label: "Service",
  },
  {
    name: "Payment",
    route: "Main",
    icon: "wallet-outline",
    activeIcon: "wallet",
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
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
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
      <View
        style={{
          flexDirection: "row",
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        {TABS.map((tab) => {
          const isFocused = route.name === tab.name;
          const iconName = isFocused ? tab.activeIcon : tab.icon;

          const onPress = () => {
            if (!isFocused) {
              // @ts-ignore - Navigation typing is complex with nested navigators
              navigation.navigate(tab.route, { screen: tab.name });
            }
          };

          return (
            <Pressable
              key={tab.name}
              onPress={onPress}
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
                  {tab.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
