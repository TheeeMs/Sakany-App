import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { RootStackParamList, MainTabParamList } from "../../navigation";
import { Ionicons } from "@expo/vector-icons";
import { getEvents, getMaintenanceRequestsByResident } from "../../services";
import { getMyFeedback, type FeedbackStatus } from "../../services/feedback";
import type { MaintenanceApiStatus } from "../../services/maintenance";
import { useAuthStore } from "../../store/authStore";

// Types
import type { UserInfo, Banner, RecentAction, ActionStatus } from "./types";

// Components
import {
  HomeHeader,
  BannerCard,
  QuickActionButton,
  RecentActionCard,
} from "./components";

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, "Home">,
  NativeStackNavigationProp<RootStackParamList>
>;

function formatShortDate(iso?: string | null): string {
  if (!iso) {
    return "";
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function mapMaintenanceStatus(
  status?: MaintenanceApiStatus | null,
): ActionStatus {
  switch (status) {
    case "RESOLVED":
      return "completed";
    case "REJECTED":
    case "CANCELLED":
      return "cancelled";
    case "IN_PROGRESS":
    case "ASSIGNED":
    case "PENDING":
    default:
      return "pending";
  }
}

function mapFeedbackStatus(status: FeedbackStatus): ActionStatus {
  switch (status) {
    case "APPROVED":
    case "ADDRESSED":
      return "completed";
    case "CLOSED":
      return "cancelled";
    case "OPEN":
    case "UNDER_REVIEW":
    default:
      return "pending";
  }
}

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore((state) => state.user);
  const unitId = useAuthStore((state) => state.unitId);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [recentActions, setRecentActions] = useState<RecentAction[]>([]);

  const userInfo: UserInfo = useMemo(() => {
    const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "";
    return {
      name: fullName || "Resident",
      building: "",
      unit: unitId ? `Unit ${unitId}` : "",
    };
  }, [unitId, user]);

  useEffect(() => {
    let isActive = true;

    const loadHomeData = async () => {
      try {
        const [events, feedbackSummary, maintenance] = await Promise.all([
          getEvents("APPROVED"),
          getMyFeedback(),
          user?.id
            ? getMaintenanceRequestsByResident(user.id)
            : Promise.resolve([]),
        ]);

        if (!isActive) {
          return;
        }

        const openEvents = events
          .sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
          )
          .slice(0, 2)
          .map<Banner>((event) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            image: event.imageUrl ?? require("../../../assets/build.png"),
            buttonText: "Explore",
            onPress: () =>
              navigation.navigate("EventDetails", { eventId: event.id }),
          }));

        const maintenanceActions = maintenance.slice(0, 2).map((item) => {
          const timestamp = new Date(
            item.updatedAt || item.createdAt || 0,
          ).getTime();
          return {
            action: {
              id: item.id,
              title: item.title || "Maintenance Request",
              description:
                item.description || item.category || "Maintenance update",
              date: formatShortDate(item.updatedAt || item.createdAt),
              status: mapMaintenanceStatus(item.status),
            } satisfies RecentAction,
            timestamp: Number.isNaN(timestamp) ? 0 : timestamp,
          };
        });

        const feedbackActions = feedbackSummary.posts.map((post) => {
          const timestamp = new Date(post.createdAt).getTime();
          return {
            action: {
              id: post.id,
              title: post.title,
              description: post.content,
              date: formatShortDate(post.createdAt),
              status: mapFeedbackStatus(post.status),
            } satisfies RecentAction,
            timestamp: Number.isNaN(timestamp) ? 0 : timestamp,
          };
        });

        const mergedActions = [...maintenanceActions, ...feedbackActions]
          .filter((item) => item.action.date !== "")
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 2)
          .map((item) => item.action);

        setBanners(openEvents);
        setRecentActions(mergedActions);
      } catch (error) {
        if (isActive) {
          setBanners([]);
          setRecentActions([]);
        }
      }
    };

    loadHomeData();

    return () => {
      isActive = false;
    };
  }, [navigation, user?.id]);

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
      onPress: () => navigation.navigate("MissingFound"),
    },
    {
      id: "3",
      label: "Events",
      icon: "calendar-outline",
      iconFamily: "Ionicons" as const,
      backgroundColor: "#FED7AA",
      iconColor: "#EA580C",
      onPress: () => navigation.navigate("Events"),
    },
    {
      id: "4",
      label: "Feedback",
      icon: "comment",
      iconFamily: "Octicons" as const,
      backgroundColor: "#DDD6FE",
      iconColor: "#7C3AED",
      onPress: () => navigation.navigate("Feedback"),
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <HomeHeader
        userInfo={userInfo}
        onNotificationPress={() => navigation.navigate("Notifications")}
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
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => navigation.navigate("Maintenance")}
            >
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
    </View>
  );
}
