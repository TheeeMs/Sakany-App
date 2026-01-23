import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import type { ActivePass } from "../types";

interface ActivePassCardProps {
  pass: ActivePass;
  onViewQR?: (pass: ActivePass) => void;
  onShare?: (pass: ActivePass) => void;
  onDelete?: (pass: ActivePass) => void;
}

export default function ActivePassCard({
  pass,
  onViewQR,
  onShare,
  onDelete,
}: ActivePassCardProps) {
  return (
    <View
      className="bg-white rounded-3xl p-4 mb-4 border border-gray-100"
      style={{
        shadowColor: "#0D9488",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 5,
      }}
    >
      {/* Top Section */}
      <View className="flex-row">
        {/* QR Icon Container */}
        <View
          className="w-14 h-14 rounded-xl items-center justify-center mr-3"
          style={{
            backgroundColor: "#0D9488",
          }}
        >
          <MaterialCommunityIcons name="qrcode" size={28} color="white" />
        </View>

        {/* Pass Info */}
        <View className="flex-1">
          {/* Name */}
          <Text
            className="text-base font-bold text-gray-900 mb-1.5"
            numberOfLines={1}
          >
            {pass.name}
          </Text>

          {/* Tags Row */}
          <View className="flex-row items-center mb-1.5">
            <View className="bg-[#E6F7F6] px-2 py-0.5 rounded-full mr-1.5">
              <Text className="text-[#0D9488] text-[11px] font-semibold">
                {pass.type}
              </Text>
            </View>
            <View className="bg-orange-50 px-2 py-0.5 rounded-full">
              <Text className="text-orange-500 text-[11px] font-semibold">
                {pass.usage}
              </Text>
            </View>
          </View>

          {/* Valid Until */}
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={12} color="#9CA3AF" />
            <Text className="text-gray-400 text-[11px] ml-1">
              {pass.validUntil}
            </Text>
          </View>
        </View>

        {/* Right Side - Quick Actions */}
        <View className="items-end justify-between">
          {/* Status Badge */}
          <View className="flex-row items-center bg-green-50 px-2 py-1 rounded-full">
            <View className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1" />
            <Text className="text-green-600 text-[10px] font-semibold">
              Active
            </Text>
          </View>

          {/* Mini Actions */}
          <View className="flex-row items-center mt-2">
            <TouchableOpacity
              onPress={() => onShare?.(pass)}
              className="w-8 h-8 bg-gray-50 rounded-lg items-center justify-center mr-1.5"
            >
              <Feather name="share-2" size={14} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDelete?.(pass)}
              className="w-8 h-8 bg-red-50 rounded-lg items-center justify-center"
            >
              <Feather name="trash-2" size={14} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* View QR Button - Full Width */}
      <TouchableOpacity
        onPress={() => onViewQR?.(pass)}
        className="flex-row items-center justify-center py-3 rounded-xl mt-4"
        style={{
          backgroundColor: "#0D9488",
        }}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="qrcode-scan" size={18} color="white" />
        <Text className="text-white text-sm font-bold ml-2">View QR Code</Text>
      </TouchableOpacity>
    </View>
  );
}
