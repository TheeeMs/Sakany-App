import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { RecentAction, ActionStatus } from "../types";

interface RecentActionCardProps {
  action: RecentAction;
}

export default function RecentActionCard({ action }: RecentActionCardProps) {
  const getStatusConfig = (
    status: ActionStatus,
  ): { label: string; bgColor: string; textColor: string } => {
    switch (status) {
      case "completed":
        return {
          label: "Completed",
          bgColor: "bg-green-50",
          textColor: "text-green-600",
        };
      case "paid":
        return {
          label: "Paid",
          bgColor: "bg-blue-50",
          textColor: "text-blue-600",
        };
      case "pending":
        return {
          label: "Pending",
          bgColor: "bg-orange-50",
          textColor: "text-orange-600",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          bgColor: "bg-red-50",
          textColor: "text-red-600",
        };
    }
  };

  const statusConfig = getStatusConfig(action.status);

  return (
    <View
      className="bg-white rounded-2xl p-4 mb-3"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 mr-3">
          <Text className="text-gray-900 text-base font-bold mb-1">
            {action.title}
          </Text>
          <Text className="text-gray-500 text-sm mb-2" numberOfLines={2}>
            {action.description}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
            <Text className="text-gray-400 text-xs ml-1">{action.date}</Text>
          </View>
        </View>

        <View className={`${statusConfig.bgColor} px-3 py-1.5 rounded-full`}>
          <Text className={`${statusConfig.textColor} text-xs font-semibold`}>
            {statusConfig.label}
          </Text>
        </View>
      </View>
    </View>
  );
}
