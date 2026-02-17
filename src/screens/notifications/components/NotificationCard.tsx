import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NotificationItem, NotificationCategoryConfig } from "../types";

// Category visual config matching the Figma design
const CATEGORY_CONFIG: Record<string, NotificationCategoryConfig> = {
  maintenance: {
    iconName: "construct-outline",
    iconColor: "#3B82F6",
    backgroundColor: "#D1E7FF",
  },
  announcement: {
    iconName: "megaphone-outline",
    iconColor: "#F59E0B",
    backgroundColor: "#FFF4D9",
  },
  payment: {
    iconName: "card-outline",
    iconColor: "#22C55E",
    backgroundColor: "#D4F4DD",
  },
  achievement: {
    iconName: "trophy-outline",
    iconColor: "#EF4444",
    backgroundColor: "#FFE4E9",
  },
  missing: {
    iconName: "alert-circle-outline",
    iconColor: "#EF4444",
    backgroundColor: "#FFEBEE",
  },
  reading: {
    iconName: "book-outline",
    iconColor: "#3B82F6",
    backgroundColor: "#D1E7FF",
  },
  general: {
    iconName: "notifications-outline",
    iconColor: "#6B7280",
    backgroundColor: "#F3F4F6",
  },
};

interface NotificationCardProps {
  notification: NotificationItem;
  onPress?: (id: string) => void;
  showBottomBorder?: boolean;
}

export default function NotificationCard({
  notification,
  onPress,
  showBottomBorder = false,
}: NotificationCardProps) {
  const config =
    CATEGORY_CONFIG[notification.category] || CATEGORY_CONFIG.general;

  return (
    <TouchableOpacity
      onPress={() => onPress?.(notification.id)}
      activeOpacity={0.7}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "flex-start",
        padding: 15,
        gap: 12,
        // Unread items get teal border on left, right, top + thicker bottom
        ...(notification.isRead
          ? {
              borderBottomWidth: 1,
              borderBottomColor: "rgba(0,0,0,0.2)",
            }
          : {
              borderWidth: 1,
              borderColor: "#00A996",
              borderBottomWidth: 2,
              borderBottomColor: "#00A996",
            }),
      }}
    >
      {/* Icon Circle */}
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 999,
          backgroundColor: config.backgroundColor,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name={config.iconName as keyof typeof Ionicons.glyphMap}
          size={24}
          color={config.iconColor}
        />
      </View>

      {/* Content */}
      <View style={{ flex: 1, gap: 4, paddingTop: 2 }}>
        {/* Title */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: "#101828",
            lineHeight: 20,
          }}
          numberOfLines={2}
        >
          {notification.title}
        </Text>

        {/* Description */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: "400",
            color: "#6A7282",
            lineHeight: 19.5,
          }}
          numberOfLines={2}
        >
          {notification.description}
        </Text>

        {/* Time Ago */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: "400",
            color: "#99A1AF",
            lineHeight: 16,
          }}
        >
          {notification.timeAgo}
        </Text>
      </View>

      {/* Unread Dot Indicator */}
      {!notification.isRead && (
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            backgroundColor: "#00A996",
            marginTop: 8,
          }}
        />
      )}
    </TouchableOpacity>
  );
}
