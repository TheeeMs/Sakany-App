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
      category: "item",
      title: "Black Mountain Bike",
      description:
        "Blue Trek mountain bike with silver handlebars. She responds to her name but might be hiding under parked cars or bushes as she gets scared easily by loud noises. If found, please hold her gently, she does not scratch.",
      location: "Building A Bike Rack",
      locationDetail: "",
      date: "Dec 22, 2024",
      timeAgo: "2 min ago",
      image: require("../../../assets/build.png"),
      ownerName: "Social Committee",
      ownerPhone: "+201234567890",
      ownerUnit: "Events Team",
      isVerified: true,
    },
    {
      id: "2",
      type: "missing",
      category: "pet",
      title: "Lost Golden Retrieve...",
      description:
        "Max ran off while playing in the garden. He is wearing a blue collar with a name tag. He is very f...",
      location: "Building B Garden, Near the back gate",
      locationDetail: "",
      date: "Today",
      timeAgo: "4:30 PM",
      image: require("../../../assets/build.png"),
      ownerName: "Ahmed Hassan",
      ownerPhone: "+201234567891",
      ownerUnit: "Unit 312",
      isVerified: true,
    },
    {
      id: "3",
      type: "missing",
      category: "vehicle",
      title: "Black Electric Scooter",
      description:
        'I left my Xiaomi electric scooter parked near the elevator entrance last night. It has a "Sakane" stic...',
      location: "Zone C Parking · Spot 45",
      locationDetail: "",
      date: "Yesterday",
      timeAgo: "8:00 PM",
      image: require("../../../assets/build.png"),
      ownerName: "John Smith",
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
      category: "pet",
      title: "White Persian Cat",
      description:
        "Found this lovely white cat wandering near the market. She is very tame and wearing a pink colla...",
      location: "Near Supermarket",
      locationDetail: "",
      date: "Today",
      timeAgo: "8:15 AM",
      image: require("../../../assets/build.png"),
      ownerName: "Mona El-Sayed",
      ownerPhone: "+201234567893",
      ownerUnit: "Apt 102",
      isVerified: true,
    },
    {
      id: "5",
      type: "found",
      category: "item",
      title: "Set of Car Keys (Toy...",
      description:
        'Found a set of keys with a Toyota logo and a blue "Sakane" keychain on the bench. I handed them o...',
      location: "Walkway near Pool Area",
      locationDetail: "",
      date: "Today",
      timeAgo: "10:00 AM",
      image: require("../../../assets/build.png"),
      ownerName: "Layla Mahmoud",
      ownerPhone: "+201234567894",
      ownerUnit: "Gate 4",
      isVerified: true,
    },
    {
      id: "6",
      type: "found",
      category: "vehicle",
      title: "Kids' Blue Bicycle",
      description:
        'A small blue bicycle has been parked in front of the lobby for over 24 hours. It has no lock and a "Spid...',
      location: "Building D Entrance",
      locationDetail: "",
      date: "Yesterday",
      timeAgo: "6:00 PM",
      image: require("../../../assets/build.png"),
      ownerName: "Karim Tarek",
      ownerPhone: "+201234567895",
      ownerUnit: "Lobby",
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
    navigation.navigate("CreateReport" as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFC" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header / Top Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
          paddingHorizontal: 16,
          paddingTop: insets.top + 8,
          paddingBottom: 12,
          backgroundColor: "#FFFFFF",
          height: insets.top + 56,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 24,
            height: 24,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            fontSize: 20,
            fontWeight: "600",
            color: "#000000",
            textAlign: "center",
            lineHeight: 30,
          }}
        >
          Missing & Found
        </Text>
        <TouchableOpacity
          style={{
            width: 24,
            height: 24,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="search-outline" size={22} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Tab Switch */}
      <View style={{ paddingTop: 8, paddingBottom: 4 }}>
        <TabSwitch activeTab={activeTab} onTabChange={setActiveTab} />
      </View>

      {/* Items Count and Filter */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#000000",
            lineHeight: 24,
          }}
        >
          {displayItems.length} {activeTab === "missing" ? "Missing" : "Found"}{" "}
          Reports
        </Text>
        <TouchableOpacity
          onPress={handleFilterPress}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            gap: 8,
            height: 37,
            width: 82,
          }}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="filter-variant"
            size={16}
            color="#666666"
          />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: "#666666",
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
              No {activeTab} reports
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Add Button (FAB) */}
      <TouchableOpacity
        onPress={handleAddNew}
        style={{
          position: "absolute",
          bottom: 30,
          right: 16,
          width: 56,
          height: 56,
          borderRadius: 50,
          backgroundColor: "#00A996",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#00A996",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
