import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Types
import type {
  RequestLocation,
  MaintenanceCategory,
  MaintenanceRequest,
} from "./types";

// Components
import { LocationTab, CategoryButton, ActiveRequestCard } from "./components";

export default function MaintenanceScreen() {
  const navigation = useNavigation();
  const [selectedLocation, setSelectedLocation] =
    useState<RequestLocation>("At Home");

  // Categories Data
  const categories: MaintenanceCategory[] = [
    {
      id: "1",
      name: "Plumbing",
      icon: "water",
      backgroundColor: "#DBEAFE",
      iconColor: "#1E40AF",
    },
    {
      id: "2",
      name: "Electrical",
      icon: "flash",
      backgroundColor: "#FEF3C7",
      iconColor: "#92400E",
    },
    {
      id: "3",
      name: "AC/Heating",
      icon: "snow",
      backgroundColor: "#E0E7FF",
      iconColor: "#3730A3",
    },
    {
      id: "4",
      name: "Housekeeping",
      icon: "leaf",
      backgroundColor: "#D1FAE5",
      iconColor: "#065F46",
    },
    {
      id: "5",
      name: "Painting",
      icon: "brush",
      backgroundColor: "#FCE7F3",
      iconColor: "#9F1239",
    },
    {
      id: "6",
      name: "Carpentry",
      icon: "hammer",
      backgroundColor: "#FED7AA",
      iconColor: "#9A3412",
    },
    {
      id: "7",
      name: "Masonry",
      icon: "construct",
      backgroundColor: "#E5E7EB",
      iconColor: "#374151",
    },
    {
      id: "8",
      name: "Aluminum",
      icon: "apps",
      backgroundColor: "#DBEAFE",
      iconColor: "#1E3A8A",
    },
    {
      id: "9",
      name: "Other",
      icon: "duplicate",
      backgroundColor: "#DDD6FE",
      iconColor: "#5B21B6",
    },
  ];

  // Active Maintenance Requests
  const activeRequests: MaintenanceRequest[] = [
    {
      id: "1",
      title: "Leaking Faucet in Kitchen",
      category: "Plumbing",
      description: "Water leaking from kitchen sink faucet",
      location: "At Home",
      date: "Dec 15, 2024",
      status: "In Progress",
      technician: "John Smith",
    },
    {
      id: "2",
      title: "Broken Elevator in Building A",
      category: "Other",
      description: "Elevator not working properly",
      location: "Neighborhood",
      date: "Dec 12, 2024",
      status: "Pending",
    },
  ];

  const handleCategoryPress = (category: MaintenanceCategory) => {
    // Navigate to request details screen
    (navigation as any).navigate("RequestDetails", { category: category.name });
  };

  const handleRequestPress = (request: MaintenanceRequest) => {
    console.log("Request pressed:", request.id);
  };

  const handleHistoryPress = () => {
    (navigation as any).navigate("MaintenanceHistory");
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Maintenance</Text>
          <TouchableOpacity
            onPress={handleHistoryPress}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="time-outline" size={24} color="#0D9488" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Request Location */}
        <View className="px-4 pt-6 pb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-3">
            Request Location
          </Text>
          <View className="flex-row gap-3">
            <LocationTab
              location="At Home"
              isSelected={selectedLocation === "At Home"}
              onPress={() => setSelectedLocation("At Home")}
            />
            <LocationTab
              location="Neighborhood"
              isSelected={selectedLocation === "Neighborhood"}
              onPress={() => setSelectedLocation("Neighborhood")}
            />
          </View>
        </View>

        {/* Select Category */}
        <View className="px-4 pb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-3">
            Select Category
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {categories.map((category) => (
              <CategoryButton
                key={category.id}
                category={category}
                onPress={() => handleCategoryPress(category)}
              />
            ))}
          </View>
        </View>

        {/* Active Maintenance */}
        <View className="px-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Active Maintenance
            </Text>
            <TouchableOpacity onPress={handleHistoryPress}>
              <Ionicons name="chevron-forward" size={20} color="#0D9488" />
            </TouchableOpacity>
          </View>
          {activeRequests.map((request) => (
            <ActiveRequestCard
              key={request.id}
              request={request}
              onPress={() => handleRequestPress(request)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
