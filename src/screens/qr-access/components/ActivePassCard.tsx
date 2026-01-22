import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import type { ActivePass } from "../types";

interface ActivePassCardProps {
  pass: ActivePass;
}

export default function ActivePassCard({ pass }: ActivePassCardProps) {
  return (
    <View
      className="bg-white rounded-2xl p-4 mb-3"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="flex-row items-start">
        {/* QR Icon */}
        <View className="w-14 h-14 bg-[#0D9488] rounded-xl items-center justify-center mr-3">
          <MaterialCommunityIcons name="qrcode" size={28} color="white" />
        </View>

        {/* Pass Info */}
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-800 mb-1.5">
            {pass.name}
          </Text>
          <View className="flex-row items-center mb-2">
            <View className="bg-[#E6F7F6] px-2.5 py-1 rounded-full mr-2">
              <Text className="text-[#0D9488] text-xs font-medium">
                {pass.type}
              </Text>
            </View>
            <View className="bg-orange-50 px-2.5 py-1 rounded-full">
              <Text className="text-orange-500 text-xs font-medium">
                {pass.usage}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={14} color="#9CA3AF" />
            <Text className="text-gray-400 text-xs ml-1">
              Valid until {pass.validUntil}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row mt-3 pt-3 border-t border-gray-100">
        <TouchableOpacity className="flex-row items-center bg-[#0D9488] px-4 py-2.5 rounded-lg mr-2">
          <MaterialCommunityIcons name="qrcode" size={16} color="white" />
          <Text className="text-white text-sm font-medium ml-1.5">View QR</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center bg-white border border-gray-200 px-4 py-2.5 rounded-lg mr-2">
          <Feather name="share-2" size={16} color="#374151" />
          <Text className="text-gray-700 text-sm font-medium ml-1.5">
            Share
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center justify-center bg-red-50 w-10 h-10 rounded-lg">
          <Feather name="trash-2" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
