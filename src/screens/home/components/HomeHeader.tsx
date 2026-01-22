import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { UserInfo } from "../types";

interface HomeHeaderProps {
  userInfo: UserInfo;
  onNotificationPress: () => void;
  onBuildingPress: () => void;
}

export default function HomeHeader({
  userInfo,
  onNotificationPress,
  onBuildingPress,
}: HomeHeaderProps) {
  return (
    <View className="bg-[#0D9488] px-5 pt-12 pb-6 rounded-b-[30px]">
      <View className="flex-row items-center justify-between mb-4">
        {/* Profile Icon */}
        <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
          <Ionicons name="person" size={24} color="white" />
        </View>

        {/* Notification Icon */}
        <TouchableOpacity
          onPress={onNotificationPress}
          className="w-12 h-12 bg-white rounded-full items-center justify-center"
        >
          <Ionicons name="notifications-outline" size={24} color="#0D9488" />
          {/* Notification Badge */}
          <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </TouchableOpacity>
      </View>

      {/* Welcome Text */}
      <Text className="text-white text-2xl font-bold mb-2">
        Welcome, {userInfo.name}
      </Text>

      {/* Building Info with Dropdown */}
      <TouchableOpacity
        onPress={onBuildingPress}
        className="flex-row items-center"
      >
        <Text className="text-white/90 text-base mr-2">
          {userInfo.building} - {userInfo.unit}
        </Text>
        <Ionicons name="chevron-down" size={20} color="rgba(255,255,255,0.9)" />
      </TouchableOpacity>
    </View>
  );
}
