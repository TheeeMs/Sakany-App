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
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
import type { TabType, MissingFoundItem } from "./types";

// Components
import { TabSwitch, MissingItemCard } from "./components";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MissingFoundScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  // State
  const [activeTab, setActiveTab] = useState<TabType>("missing");

  // Sample Data - Missing Items
  const missingItems: MissingFoundItem[] = [
    {
      id: "1",
      type: "missing",
      category: "pet",
      title: "Blue Trek Mountain Bike",
      description:
        "Blue Trek mountain bike with silver handlebars. She responds to her name but might be hiding under parked cars or bushes as she gets scared easily by loud noises. If found, please hold her gently, she does not scratch.",
      location: "Building A Bike Rack",
      locationDetail: "Near the north entrance gate",
      date: "Dec 22, 2024",
      timeAgo: "1d ago",
      image: require("../../../assets/build.png"),
      ownerName: "Sarah Jenkins",
      ownerPhone: "+201234567890",
      ownerUnit: "Unit 205",
      isVerified: true,
    },
    {
      id: "2",
      type: "missing",
      category: "pet",
      title: "Tabby Cat - 'Luna'",
      description:
        "Green eyes, wearing a black collar with a bell. Very friendly and loves treats.",
      location: "Block B Garage",
      locationDetail: "Underground parking level 2",
      date: "Dec 21, 2024",
      timeAgo: "2d ago",
      image: require("../../../assets/build.png"),
      ownerName: "Ahmed Hassan",
      ownerPhone: "+201234567891",
      ownerUnit: "Unit 312",
      isVerified: true,
    },
    {
      id: "3",
      type: "missing",
      category: "item",
      title: "Silver MacBook Pro",
      description:
        "15-inch MacBook Pro with stickers on the cover. Last seen at the coffee shop.",
      location: "Community Center",
      locationDetail: "Coffee shop area",
      date: "Dec 20, 2024",
      timeAgo: "3d ago",
      image: require("../../../assets/build.png"),
      ownerName: "Mohamed Ali",
      ownerPhone: "+201234567892",
      ownerUnit: "Unit 118",
      isVerified: false,
    },
  ];

  // Sample Data - Found Items
  const foundItems: MissingFoundItem[] = [
    {
      id: "4",
      type: "found",
      category: "item",
      title: "Black Leather Wallet",
      description:
        "Found near the main entrance. Contains some cards and cash. Please describe contents to claim.",
      location: "Building A Lobby",
      locationDetail: "Reception desk",
      date: "Dec 22, 2024",
      timeAgo: "1h ago",
      image: require("../../../assets/build.png"),
      ownerName: "Security Office",
      ownerPhone: "+201234567893",
      ownerUnit: "Security",
      isVerified: true,
    },
    {
      id: "5",
      type: "found",
      category: "pet",
      title: "Golden Retriever",
      description:
        "Friendly dog found wandering in the garden. No collar but very well trained.",
      location: "Central Garden",
      locationDetail: "Near the fountain",
      date: "Dec 21, 2024",
      timeAgo: "3h ago",
      image: require("../../../assets/build.png"),
      ownerName: "Guard Station",
      ownerPhone: "+201234567894",
      ownerUnit: "Gate 1",
      isVerified: true,
    },
  ];

  // Get items based on active tab
  const displayItems = activeTab === "missing" ? missingItems : foundItems;

  // Handle Details Press
  const handleDetailsPress = (item: MissingFoundItem) => {
    navigation.navigate("ReportDetails", { item });
  };

  // Handle Filter Press
  const handleFilterPress = () => {
    Alert.alert("Filter", "Filter options coming soon!");
  };

  // Handle Add New Press
  const handleAddNew = () => {
    Alert.alert(
      "Report Item",
      `Would you like to report a ${activeTab} item?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Continue", onPress: () => console.log("Add new item") },
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingTop: insets.top + 12,
          paddingBottom: 16,
          backgroundColor: "#FFFFFF",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#1F2937",
          }}
        >
          Missing & Found
        </Text>
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="search-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Tab Switch */}
      <TabSwitch activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Items Count and Filter */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: "#1F2937",
          }}
        >
          {displayItems.length} {activeTab === "missing" ? "Missing" : "Found"}{" "}
          Items
        </Text>
        <TouchableOpacity
          onPress={handleFilterPress}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: "#F9FAFB",
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="filter-variant"
            size={18}
            color="#6B7280"
          />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: "#374151",
              marginLeft: 6,
            }}
          >
            Filter
          </Text>
        </TouchableOpacity>
      </View>

      {/* Items List */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {displayItems.map((item) => (
          <MissingItemCard
            key={item.id}
            item={item}
            onDetailsPress={handleDetailsPress}
          />
        ))}

        {displayItems.length === 0 && (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 60,
            }}
          >
            <MaterialCommunityIcons
              name={
                activeTab === "missing"
                  ? "alert-circle-outline"
                  : "check-circle-outline"
              }
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
              No {activeTab} items
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={handleAddNew}
        style={{
          position: "absolute",
          bottom: 100,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "#0D9488",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#0D9488",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
