import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { RootStackParamList, MainTabParamList } from "../../navigation";
import { Ionicons } from "@expo/vector-icons";

// Types
import type { UserInfo, Banner, RecentAction } from "./types";

// Components
import {
  HomeHeader,
  BannerCard,
  QuickActionButton,
  RecentActionCard,
} from "./components";
import { AppBottomNav } from "../../components/navigation";

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, "Home">,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  // User Info (in real app, fetch from API or store)
  const userInfo: UserInfo = {
    name: "Ahmed",
    building: "Building A",
    unit: "Unit 205",
  };

  // Banners Data
  const banners: Banner[] = [
    {
      id: "1",
      title: "New Mall Open Now!",
      description:
        "Shops, cafes, and services are now available for all residents.",
      buttonText: "Explore",
      image: require("../../../assets/build.png"),
      onPress: () => console.log("Banner pressed"),
    },
    {
      id: "2",
      title: "Join Our Community Event",
      description: "Open Air Cinema this Friday at 8 PM",
      buttonText: "Explore",
      image: require("../../../assets/build.png"),
      onPress: () => console.log("Event banner pressed"),
    },
  ];

  // Recent Actions Data
  const recentActions: RecentAction[] = [
    {
      id: "1",
      title: "AC Repair Completed",
      description: "Your AC repair request has been completed",
      date: "Dec 12, 2024",
      status: "completed",
    },
    {
      id: "2",
      title: "November Fee Paid",
      description: "Monthly management fee - $450.00",
      date: "Nov 1, 2024",
      status: "paid",
    },
  ];

  // Quick Actions Configuration
  const quickActions = [
    {
      id: "1",
      label: "QR Access",
      icon: "qrcode-scan",
      iconFamily: "MaterialCommunityIcons" as const,
      backgroundColor: "#A7F3D0",
      iconColor: "#0D9488",
      onPress: () => navigation.navigate("QRAccess"),
    },
    {
      id: "2",
      label: "Missing",
      icon: "alert-circle-outline",
      iconFamily: "Ionicons" as const,
      backgroundColor: "#FECACA",
      iconColor: "#DC2626",
      onPress: () => console.log("Missing pressed"),
    },
    {
      id: "3",
      label: "Events",
      icon: "calendar-outline",
      iconFamily: "Ionicons" as const,
      backgroundColor: "#FED7AA",
      iconColor: "#EA580C",
      onPress: () => console.log("Events pressed"),
    },
    {
      id: "4",
      label: "Feedback",
      icon: "comment",
      iconFamily: "Octicons" as const,
      backgroundColor: "#DDD6FE",
      iconColor: "#7C3AED",
      onPress: () => console.log("Feedback pressed"),
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <HomeHeader
        userInfo={userInfo}
        onNotificationPress={() => console.log("Notifications pressed")}
        onBuildingPress={() => console.log("Building selector pressed")}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Banners Section */}
        <View className="mt-5">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {banners.map((banner) => (
              <BannerCard key={banner.id} banner={banner} />
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions Section */}
        <View className="px-5 mt-6">
          <Text className="text-gray-900 text-lg font-bold mb-4">
            Quick Actions
          </Text>
          <View className="flex-row justify-between">
            {quickActions.map((action) => (
              <QuickActionButton
                key={action.id}
                label={action.label}
                icon={action.icon}
                iconFamily={action.iconFamily}
                backgroundColor={action.backgroundColor}
                iconColor={action.iconColor}
                onPress={action.onPress}
              />
            ))}
          </View>
        </View>

        {/* Recent Actions Section */}
        <View className="px-5 mt-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-900 text-lg font-bold">
              Recent Actions
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-[#0D9488] text-sm font-semibold">
                View all
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color="#0D9488"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </View>
          {recentActions.map((action) => (
            <RecentActionCard key={action.id} action={action} />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <AppBottomNav />
    </View>
  );
}
