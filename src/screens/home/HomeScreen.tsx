import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation";

// Types
import type { UserInfo, Banner, RecentAction } from "./types";

// Components
import {
  HomeHeader,
  BannerCard,
  QuickActionButton,
  RecentActionCard,
} from "./components";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

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
      onPress: () => console.log("Banner pressed"),
    },
    {
      id: "2",
      title: "Join Our Community Event",
      description: "Open Air Cinema this Friday at 8 PM",
      buttonText: "Learn More",
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
      icon: "qrcode",
      iconFamily: "MaterialCommunityIcons" as const,
      backgroundColor: "#14B8A6",
      onPress: () => navigation.navigate("QRAccess"),
    },
    {
      id: "2",
      label: "Missing",
      icon: "alert-circle-outline",
      iconFamily: "Ionicons" as const,
      backgroundColor: "#EF4444",
      onPress: () => console.log("Missing pressed"),
    },
    {
      id: "3",
      label: "Events",
      icon: "calendar-outline",
      iconFamily: "Ionicons" as const,
      backgroundColor: "#F59E0B",
      onPress: () => console.log("Events pressed"),
    },
    {
      id: "4",
      label: "Feedback",
      icon: "chatbubble-outline",
      iconFamily: "Ionicons" as const,
      backgroundColor: "#8B5CF6",
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
            <TouchableOpacity>
              <Text className="text-[#0D9488] text-sm font-semibold">
                View all
              </Text>
            </TouchableOpacity>
          </View>
          {recentActions.map((action) => (
            <RecentActionCard key={action.id} action={action} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
