import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// Helper for status colors
const getStatusStyles = (status: string) => {
  switch (status) {
    case "Expired":
      return { bg: "bg-red-50", text: "text-red-500" };
    case "Used":
      return { bg: "bg-gray-100", text: "text-gray-500" };
    case "Active":
      return { bg: "bg-green-50", text: "text-green-500" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-500" };
  }
};

const getTypeStyles = (type: string) => {
  return { bg: "bg-blue-50", text: "text-blue-500" };
};

// History Item Component
const HistoryItem = ({ item }: { item: any }) => (
  <View
    className="bg-white rounded-[24px] p-5 mb-5"
    style={{
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 15,
      elevation: 3,
    }}
  >
    {/* Top Section */}
    <View className="flex-row mb-5">
      {/* Large Icon */}
      <View className="w-16 h-16 bg-[#0D9488] rounded-2xl items-center justify-center mr-4">
        <MaterialCommunityIcons name="qrcode" size={32} color="white" />
      </View>

      {/* Info */}
      <View className="flex-1 justify-center">
        <Text className="text-lg font-bold text-gray-900 mb-2">
          {item.name}
        </Text>

        <View className="flex-row flex-wrap gap-2 mb-2">
          {/* Type Badge */}
          <View
            className={`px-3 py-1 rounded-full ${getTypeStyles(item.type).bg}`}
          >
            <Text
              className={`text-xs font-semibold ${getTypeStyles(item.type).text}`}
            >
              {item.type}
            </Text>
          </View>
          {/* Status Badge */}
          <View
            className={`px-3 py-1 rounded-full ${getStatusStyles(item.status).bg}`}
          >
            <Text
              className={`text-xs font-semibold ${getStatusStyles(item.status).text}`}
            >
              {item.status}
            </Text>
          </View>
        </View>

        {/* Date */}
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={14} color="#9CA3AF" />
          <Text className="text-gray-400 text-xs ml-1.5 font-medium">
            {item.date}
          </Text>
        </View>
      </View>
    </View>

    {/* Access Code Box */}
    <View className="bg-gray-50 rounded-2xl p-4 mb-5">
      <Text className="text-xs text-gray-400 mb-1">Access Code</Text>
      <Text className="text-base font-bold text-gray-800 tracking-wider">
        {item.accessCode || "VIS-2024-098"}
      </Text>
    </View>

    {/* Action Buttons */}
    <View className="flex-row gap-3">
      {/* Re-activate Button */}
      <TouchableOpacity
        className="flex-1 bg-[#0D9488] flex-row items-center justify-center py-3.5 rounded-xl"
        activeOpacity={0.8}
        onPress={() =>
          Alert.alert("Re-activate", `Re-activating pass for ${item.name}`)
        }
      >
        <Ionicons name="refresh" size={18} color="white" />
        <Text className="text-white font-bold ml-2">Re-activate</Text>
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity
        className="flex-[0.6] bg-red-50 flex-row items-center justify-center py-3.5 rounded-xl"
        activeOpacity={0.8}
        onPress={() => Alert.alert("Delete", "Are you sure?")}
      >
        <Ionicons name="trash-outline" size={18} color="#EF4444" />
        <Text className="text-[#EF4444] font-bold ml-2">Delete</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function QRHistoryScreen() {
  const navigation = useNavigation();

  // Sample History Data
  const historyData = [
    {
      id: "1",
      name: "Sarah Johnson",
      type: "Visitor",
      date: "Dec 10, 2024 8:00 PM",
      status: "Expired",
      accessCode: "VIS-2024-098",
    },
    {
      id: "2",
      name: "Ahmed Ali",
      type: "Delivery",
      date: "Dec 12, 2024 2:30 PM",
      status: "Used",
      accessCode: "DEL-2024-156",
    },
    {
      id: "3",
      name: "Maintenance Tech",
      type: "Service",
      date: "Dec 15, 2024 10:00 AM",
      status: "Expired",
      accessCode: "SRV-2024-042",
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8F0" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-12 pb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">History</Text>
        <View className="w-10" />
      </View>

      {/* List */}
      <ScrollView
        className="flex-1 px-5 pt-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {historyData.map((item) => (
          <HistoryItem key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}
