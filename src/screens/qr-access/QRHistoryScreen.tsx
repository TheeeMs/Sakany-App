import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Status Types
type StatusType = "all" | "Active" | "Used" | "Expired";

// History Item Type
interface HistoryItemData {
  id: string;
  name: string;
  type: string;
  date: string;
  status: "Active" | "Used" | "Expired";
  accessCode: string;
  usageCount?: number;
}

// Helper for status colors and icons
const getStatusConfig = (status: string) => {
  switch (status) {
    case "Expired":
      return {
        bg: "bg-red-50",
        text: "text-red-500",
        icon: "close-circle" as const,
        iconColor: "#EF4444",
        gradient: ["#FEE2E2", "#FECACA"] as const,
      };
    case "Used":
      return {
        bg: "bg-gray-100",
        text: "text-gray-500",
        icon: "checkmark-circle" as const,
        iconColor: "#6B7280",
        gradient: ["#F3F4F6", "#E5E7EB"] as const,
      };
    case "Active":
      return {
        bg: "bg-green-50",
        text: "text-green-500",
        icon: "checkmark-circle" as const,
        iconColor: "#10B981",
        gradient: ["#D1FAE5", "#A7F3D0"] as const,
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-500",
        icon: "ellipse" as const,
        iconColor: "#6B7280",
        gradient: ["#F3F4F6", "#E5E7EB"] as const,
      };
  }
};

const getTypeConfig = (type: string) => {
  switch (type) {
    case "Visitor":
      return {
        bg: "#E6F7F6",
        text: "#0D9488",
        icon: "person-outline" as const,
      };
    case "Delivery":
      return { bg: "#FFF7ED", text: "#EA580C", icon: "cube-outline" as const };
    case "Service":
      return {
        bg: "#EFF6FF",
        text: "#2563EB",
        icon: "construct-outline" as const,
      };
    case "Family":
      return {
        bg: "#F3E8FF",
        text: "#9333EA",
        icon: "people-outline" as const,
      };
    default:
      return {
        bg: "#F3F4F6",
        text: "#6B7280",
        icon: "person-outline" as const,
      };
  }
};

// Filter Tab Component
const FilterTab = ({
  label,
  isSelected,
  onPress,
  count,
}: {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  count: number;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-4 py-2 rounded-full mr-2 flex-row items-center ${
      isSelected ? "bg-[#0D9488]" : "bg-gray-100"
    }`}
    activeOpacity={0.7}
  >
    <Text
      className={`text-sm font-semibold ${
        isSelected ? "text-white" : "text-gray-600"
      }`}
    >
      {label}
    </Text>
    <View
      className={`ml-2 px-1.5 py-0.5 rounded-full ${
        isSelected ? "bg-white/20" : "bg-gray-200"
      }`}
    >
      <Text
        className={`text-xs font-bold ${
          isSelected ? "text-white" : "text-gray-500"
        }`}
      >
        {count}
      </Text>
    </View>
  </TouchableOpacity>
);

// History Item Component
const HistoryItem = ({
  item,
  onReactivate,
  onDelete,
}: {
  item: HistoryItemData;
  onReactivate: (item: HistoryItemData) => void;
  onDelete: (item: HistoryItemData) => void;
}) => {
  const statusConfig = getStatusConfig(item.status);
  const typeConfig = getTypeConfig(item.type);

  return (
    <View
      className="bg-white rounded-3xl p-5 mb-4 border border-gray-100"
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
        {/* QR Icon with Gradient */}
        <View
          className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
          style={{ overflow: "hidden" }}
        >
          <LinearGradient
            colors={["#0D9488", "#0F766E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          />
          <MaterialCommunityIcons name="qrcode" size={32} color="white" />
        </View>

        {/* Info Section */}
        <View className="flex-1">
          {/* Name */}
          <Text
            className="text-lg font-bold text-gray-900 mb-2"
            numberOfLines={1}
          >
            {item.name}
          </Text>

          {/* Tags Row */}
          <View className="flex-row flex-wrap gap-2 mb-2">
            {/* Type Badge with Icon */}
            <View
              className="flex-row items-center px-3 py-1 rounded-full"
              style={{ backgroundColor: typeConfig.bg }}
            >
              <Ionicons
                name={typeConfig.icon}
                size={12}
                color={typeConfig.text}
              />
              <Text
                className="text-xs font-semibold ml-1"
                style={{ color: typeConfig.text }}
              >
                {item.type}
              </Text>
            </View>

            {/* Status Badge */}
            <View
              className={`flex-row items-center px-3 py-1 rounded-full ${statusConfig.bg}`}
            >
              <Ionicons
                name={statusConfig.icon}
                size={12}
                color={statusConfig.iconColor}
              />
              <Text
                className={`text-xs font-semibold ml-1 ${statusConfig.text}`}
              >
                {item.status}
              </Text>
            </View>
          </View>

          {/* Date & Access Code */}
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={14} color="#9CA3AF" />
            <Text className="text-gray-400 text-xs ml-1 font-medium">
              {item.date}
            </Text>
          </View>
        </View>
      </View>

      {/* Access Code Box */}
      <View className="bg-gray-50 rounded-2xl p-4 mt-4 mb-4 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-xs text-gray-400 mb-1 font-medium">
            Access Code
          </Text>
          <Text className="text-base font-bold text-gray-800 tracking-wider">
            {item.accessCode}
          </Text>
        </View>
        <TouchableOpacity
          className="w-10 h-10 bg-[#0D9488]/10 rounded-xl items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="copy-outline" size={20} color="#0D9488" />
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-3">
        {/* Re-activate Button */}
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center py-3.5 rounded-xl overflow-hidden"
          activeOpacity={0.8}
          onPress={() => onReactivate(item)}
          style={{ backgroundColor: "#0D9488" }}
        >
          <Ionicons name="refresh" size={18} color="white" />
          <Text className="text-white font-bold ml-2">Re-activate</Text>
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity
          className="w-14 bg-red-50 items-center justify-center py-3.5 rounded-xl"
          activeOpacity={0.8}
          onPress={() => onDelete(item)}
        >
          <Feather name="trash-2" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Empty State Component
const EmptyState = ({ filter }: { filter: StatusType }) => (
  <View className="items-center justify-center py-16">
    <View
      className="w-24 h-24 rounded-full items-center justify-center mb-6"
      style={{ backgroundColor: "#E6F7F6" }}
    >
      <MaterialCommunityIcons name="history" size={48} color="#0D9488" />
    </View>
    <Text className="text-xl font-bold text-gray-800 mb-2">
      No History Found
    </Text>
    <Text className="text-gray-500 text-center px-8 text-sm">
      {filter === "all"
        ? "Your QR code history will appear here once you create and use access passes."
        : `No ${filter.toLowerCase()} passes found in your history.`}
    </Text>
  </View>
);

export default function QRHistoryScreen() {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState<StatusType>("all");

  // Sample History Data
  const historyData: HistoryItemData[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      type: "Visitor",
      date: "Dec 10, 2024 8:00 PM",
      status: "Expired",
      accessCode: "VIS-2024-098",
      usageCount: 1,
    },
    {
      id: "2",
      name: "Ahmed Ali",
      type: "Delivery",
      date: "Dec 12, 2024 2:30 PM",
      status: "Used",
      accessCode: "DEL-2024-156",
      usageCount: 3,
    },
    {
      id: "3",
      name: "Mohamed Hassan",
      type: "Service",
      date: "Dec 15, 2024 10:00 AM",
      status: "Expired",
      accessCode: "SRV-2024-042",
      usageCount: 1,
    },
    {
      id: "4",
      name: "Fatima Ahmed",
      type: "Family",
      date: "Dec 18, 2024 4:00 PM",
      status: "Active",
      accessCode: "FAM-2024-077",
      usageCount: 5,
    },
  ];

  // Filter data based on selected filter
  const filteredData =
    selectedFilter === "all"
      ? historyData
      : historyData.filter((item) => item.status === selectedFilter);

  // Get counts for each filter
  const getCounts = () => ({
    all: historyData.length,
    Active: historyData.filter((item) => item.status === "Active").length,
    Used: historyData.filter((item) => item.status === "Used").length,
    Expired: historyData.filter((item) => item.status === "Expired").length,
  });

  const counts = getCounts();

  // Handlers
  const handleReactivate = (item: HistoryItemData) => {
    Alert.alert(
      "Re-activate Pass",
      `Would you like to re-activate the pass for ${item.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Re-activate",
          onPress: () => {
            Alert.alert("Success", "Pass has been re-activated!");
          },
        },
      ],
    );
  };

  const handleDelete = (item: HistoryItemData) => {
    Alert.alert(
      "Delete Pass",
      `Are you sure you want to delete the pass for ${item.name}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert("Deleted", "Pass has been removed from history.");
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header with Logo */}
      <View className="px-4 pt-12 pb-4">
        {/* Navigation Row */}
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#1F2937" />
          </TouchableOpacity>

          <TouchableOpacity
            className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center"
            activeOpacity={0.7}
          >
            <Ionicons name="search-outline" size={22} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Title with Logo */}
        <View className="flex-row items-center mb-4">
          {/* History Logo */}
          <View
            className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
            style={{ overflow: "hidden" }}
          >
            <LinearGradient
              colors={["#0D9488", "#0F766E"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
            />
            <MaterialCommunityIcons name="history" size={28} color="white" />
          </View>

          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">QR History</Text>
            <Text className="text-gray-500 text-sm mt-0.5">
              View and manage your past access passes
            </Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-2"
        >
          <FilterTab
            label="All"
            isSelected={selectedFilter === "all"}
            onPress={() => setSelectedFilter("all")}
            count={counts.all}
          />
          <FilterTab
            label="Active"
            isSelected={selectedFilter === "Active"}
            onPress={() => setSelectedFilter("Active")}
            count={counts.Active}
          />
          <FilterTab
            label="Used"
            isSelected={selectedFilter === "Used"}
            onPress={() => setSelectedFilter("Used")}
            count={counts.Used}
          />
          <FilterTab
            label="Expired"
            isSelected={selectedFilter === "Expired"}
            onPress={() => setSelectedFilter("Expired")}
            count={counts.Expired}
          />
        </ScrollView>
      </View>

      {/* List */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              onReactivate={handleReactivate}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <EmptyState filter={selectedFilter} />
        )}
      </ScrollView>
    </View>
  );
}
