import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { MaintenanceRequest, RequestStatus } from "./types";
import { ActiveRequestCard } from "./components";

type FilterType = "All" | RequestStatus;

export default function MaintenanceHistoryScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("All");

  const filters: FilterType[] = ["All", "In Progress", "Completed"];

  // History Data
  const historyRequests: MaintenanceRequest[] = [
    {
      id: "1",
      title: "AC Not Working",
      category: "AC/Heating",
      description: "Air conditioner stopped cooling",
      location: "At Home",
      date: "Dec 5, 2024",
      status: "Completed",
      technician: "Mike Johnson",
    },
    {
      id: "2",
      title: "Kitchen Faucet Leak",
      category: "Plumbing",
      description: "Water leaking from kitchen sink",
      location: "At Home",
      date: "Nov 28, 2024",
      status: "Completed",
      technician: "John Smith",
    },
    {
      id: "3",
      title: "Leaking Faucet in Kitchen",
      category: "Plumbing",
      description: "Water leaking from kitchen sink faucet",
      location: "At Home",
      date: "Dec 15, 2024",
      status: "In Progress",
      technician: "John Smith",
    },
  ];

  const filteredRequests =
    selectedFilter === "All"
      ? historyRequests
      : historyRequests.filter((req) => req.status === selectedFilter);

  const handleRequestPress = (request: MaintenanceRequest) => {
    console.log("Request pressed:", request.id);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View
        className="bg-white px-4 pb-4 border-b border-gray-100"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">History</Text>
          <View className="w-10" />
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full ${
                selectedFilter === filter ? "bg-teal-500" : "bg-gray-100"
              }`}
              activeOpacity={0.7}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedFilter === filter ? "text-white" : "text-gray-600"
                }`}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* History List */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <ActiveRequestCard
              key={request.id}
              request={request}
              onPress={() => handleRequestPress(request)}
            />
          ))
        ) : (
          <View className="items-center justify-center py-20">
            <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 text-base mt-4">
              No {selectedFilter.toLowerCase()} requests found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
