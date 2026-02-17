import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
import type { NotificationFilterType, NotificationItem } from "./types";

// Components
import { NotificationCard } from "./components";

export default function NotificationScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [activeFilter, setActiveFilter] =
    useState<NotificationFilterType>("all");

  // Sample Data
  const notifications: NotificationItem[] = [
    // Today
    {
      id: "1",
      title: "Maintenance Request Completed",
      description: "Your AC repair request has been completed by John Smith",
      timeAgo: "2 mins ago",
      category: "maintenance",
      isRead: false,
      date: "today",
    },
    {
      id: "2",
      title: "Important Announcement",
      description: "Water will be shut off in Building A-C from 2 PM to 5 PM",
      timeAgo: "30 mins ago",
      category: "announcement",
      isRead: false,
      isUrgent: true,
      date: "today",
    },
    // Yesterday
    {
      id: "3",
      title: "Payment Due Reminder",
      description: "Your December management fee is due in 3 days",
      timeAgo: "1 day ago",
      category: "payment",
      isRead: false,
      isUrgent: true,
      date: "yesterday",
    },
    {
      id: "4",
      title: "Pool Maintenance Notice",
      description: "Swimming pool will be closed Dec 20-22 for maintenance",
      timeAgo: "1 day ago",
      category: "announcement",
      isRead: true,
      date: "yesterday",
    },
    {
      id: "5",
      title: "Achievement Milestone Reached!",
      description: "You have completed 85% of the Web Development course",
      timeAgo: "1 day ago",
      category: "achievement",
      isRead: true,
      isPersonal: true,
      date: "yesterday",
    },
    // Monday, December 27, 2024
    {
      id: "6",
      title: "New Missing Report",
      description: "A golden retriever has been reported missing in Building C",
      timeAgo: "2 days ago",
      category: "missing",
      isRead: false,
      isUrgent: true,
      date: "2024-12-27",
    },
    {
      id: "7",
      title: "Recommended Reading Material",
      description: "Check out the latest lecture slides and resources",
      timeAgo: "2 days ago",
      category: "reading",
      isRead: true,
      isPersonal: true,
      date: "2024-12-27",
    },
  ];

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "urgent") return n.isUrgent;
    if (activeFilter === "personal") return n.isPersonal;
    return true; // "all"
  });

  // Group notifications by date
  const groupNotifications = (items: NotificationItem[]) => {
    const groups: { label: string; items: NotificationItem[] }[] = [];
    const groupMap = new Map<string, NotificationItem[]>();

    items.forEach((item) => {
      const key = item.date;
      if (!groupMap.has(key)) {
        groupMap.set(key, []);
      }
      groupMap.get(key)!.push(item);
    });

    groupMap.forEach((groupItems, key) => {
      let label = key;
      if (key === "today") {
        label = "Today";
      } else if (key === "yesterday") {
        label = "Yesterday";
      } else {
        // Format ISO date string to readable date
        const date = new Date(key);
        label = date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      groups.push({ label, items: groupItems });
    });

    return groups;
  };

  const groupedNotifications = groupNotifications(filteredNotifications);

  // Count for filter tabs
  const urgentCount = notifications.filter((n) => n.isUrgent).length;
  const personalCount = notifications.filter((n) => n.isPersonal).length;
  const allCount = notifications.length;

  // Mark all as read handler
  const handleMarkAllRead = () => {
    // Would update state in a real app
  };

  // Filter tabs data
  const filterTabs: {
    key: NotificationFilterType;
    label: string;
    count: number;
    iconName?: keyof typeof Ionicons.glyphMap;
  }[] = [
    { key: "all", label: "All", count: allCount },
    {
      key: "urgent",
      label: "Urgent",
      count: urgentCount,
      iconName: "warning-outline",
    },
    {
      key: "personal",
      label: "Personal",
      count: personalCount,
      iconName: "person-outline",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFC" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header / Top Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
          paddingHorizontal: 16,
          paddingTop: insets.top + 8,
          paddingBottom: 12,
          backgroundColor: "#FFFFFF",
          height: insets.top + 56,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 24,
            height: 24,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            fontSize: 20,
            fontWeight: "600",
            color: "#000000",
            lineHeight: 30,
          }}
        >
          Notification
        </Text>
        {/* Mark all as read */}
        <TouchableOpacity onPress={handleMarkAllRead}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: "#00A996",
              lineHeight: 20,
            }}
          >
            Mark all as read
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 40,
          gap: 16,
        }}
      >
        {/* Filter Tabs */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveFilter(tab.key)}
                activeOpacity={0.7}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 7,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 15,
                  backgroundColor: isActive ? "#00A996" : "#FFFFFF",
                  borderWidth: isActive ? 0 : 1,
                  borderColor: "#999999",
                }}
              >
                {tab.iconName && (
                  <Ionicons
                    name={tab.iconName}
                    size={16}
                    color={isActive ? "#FFFFFF" : "#999999"}
                  />
                )}
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: isActive ? "#FFFFFF" : "#999999",
                    lineHeight: 21,
                    textAlign: "center",
                  }}
                >
                  {tab.label} {tab.count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Notification Groups */}
        {groupedNotifications.map((group) => (
          <View key={group.label} style={{ gap: 8 }}>
            {/* Section Header */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#101828",
                lineHeight: 20,
                paddingHorizontal: 4,
              }}
            >
              {group.label}
            </Text>

            {/* Notification Cards */}
            <View style={{ gap: 4 }}>
              {group.items.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </View>
          </View>
        ))}

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 60,
            }}
          >
            <Ionicons
              name="notifications-off-outline"
              size={64}
              color="#D1D5DB"
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#9CA3AF",
                marginTop: 16,
              }}
            >
              No notifications found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
