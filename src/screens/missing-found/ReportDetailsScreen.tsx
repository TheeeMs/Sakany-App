import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Share,
  Linking,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
import type { MissingFoundItem } from "./types";

type ReportDetailsRouteProp = RouteProp<
  { ReportDetails: { item: MissingFoundItem } },
  "ReportDetails"
>;

// Get category label
const getCategoryLabel = (category: string): string => {
  switch (category) {
    case "pet":
      return "Pet";
    case "item":
      return "Item";
    case "person":
      return "Person";
    case "vehicle":
      return "Vehicle";
    default:
      return "Other";
  }
};

// Get badge color based on item type
const getBadgeColor = (type: string): string => {
  return type === "found" ? "#059669" : "#DE4544";
};

export default function ReportDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<ReportDetailsRouteProp>();
  const insets = useSafeAreaInsets();

  const item = route.params?.item;

  if (!item) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Item not found</Text>
      </View>
    );
  }

  const badgeColor = getBadgeColor(item.type);

  // Get owner initials
  const ownerInitials =
    item.ownerInitials ||
    item.ownerName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  // Handle Share
  const handleShare = async () => {
    try {
      const message = `
🔍 ${item.type === "missing" ? "Missing" : "Found"} Report

📌 ${item.title}
📅 ${item.date || "Recently"} • ${item.timeAgo}
📍 ${item.location}${item.locationDetail ? ` - ${item.locationDetail}` : ""}

📝 ${item.description}

👤 Reported by: ${item.ownerName}
      `.trim();

      await Share.share({
        message,
        title: `${item.type === "missing" ? "Missing" : "Found"}: ${item.title}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Handle Call
  const handleCall = () => {
    Linking.openURL(`tel:${item.ownerPhone}`);
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
          Report Details
        </Text>
        <TouchableOpacity
          onPress={handleShare}
          style={{
            width: 24,
            height: 24,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="share-social-outline" size={22} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Main Image */}
        <View
          style={{
            marginHorizontal: 16,
            marginTop: 8,
            borderRadius: 15,
            overflow: "hidden",
            position: "relative",
            height: 273,
          }}
        >
          <Image
            source={item.image}
            style={{
              width: "100%",
              height: 273,
              backgroundColor: "#F3F4F6",
            }}
            resizeMode="cover"
          />
          {/* Category Badge */}
          <View
            style={{
              position: "absolute",
              bottom: 12,
              left: 12,
              backgroundColor: badgeColor,
              width: 100,
              height: 27,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#FFFFFF",
                textAlign: "center",
                lineHeight: 24,
              }}
            >
              {getCategoryLabel(item.category)}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            color: "#000000",
            marginHorizontal: 16,
            marginTop: 16,
            lineHeight: 30,
          }}
        >
          {item.title}
        </Text>

        {/* Date and Time Row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 16,
            marginTop: 8,
            gap: 4,
          }}
        >
          {/* Date */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              flex: 1,
            }}
          >
            <Ionicons name="calendar-outline" size={21} color="#666666" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#666666",
                lineHeight: 24,
              }}
            >
              {item.date || "Dec 22, 2024"}
            </Text>
          </View>

          {/* Time */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              flex: 1,
            }}
          >
            <Ionicons name="time-outline" size={22} color="#666666" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#666666",
                lineHeight: 24,
              }}
            >
              {item.timeAgo}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: "400",
            color: "#666666",
            marginHorizontal: 16,
            marginTop: 16,
            lineHeight: 21,
          }}
        >
          {item.description}
        </Text>

        {/* Location Card */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 16,
            marginTop: 20,
            backgroundColor: "#FFFFFF",
            borderRadius: 15,
            height: 80,
            paddingHorizontal: 20,
            gap: 20,
          }}
          activeOpacity={0.7}
        >
          {/* Location Icon Circle */}
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "#E7F7F7",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="location" size={22} color="#00A996" />
          </View>

          {/* Location Text */}
          <View style={{ flex: 1, gap: 4 }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "600",
                color: "#000000",
                lineHeight: 22.5,
              }}
            >
              {item.location}
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "400",
                color: "#999999",
                lineHeight: 19.5,
              }}
            >
              Tap for the last seen location
            </Text>
          </View>

          {/* Caret Right */}
          <Ionicons name="chevron-forward" size={24} color="#000000" />
        </TouchableOpacity>

        {/* Reported By Section */}
        <View style={{ marginHorizontal: 16, marginTop: 20, gap: 8 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#000000",
              lineHeight: 24,
            }}
          >
            Reported By
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderRadius: 15,
              height: 80,
              paddingHorizontal: 16,
            }}
          >
            {/* Avatar + Info */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                flex: 1,
              }}
            >
              {/* Teal Avatar */}
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "#00A996",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: "#FFFFFF",
                    lineHeight: 24,
                  }}
                >
                  {ownerInitials}
                </Text>
              </View>

              {/* Name + Unit */}
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#101828",
                    lineHeight: 19.6,
                  }}
                >
                  {item.ownerName}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "400",
                    color: "#6A7282",
                    lineHeight: 16,
                  }}
                >
                  {item.ownerUnit || "Events Team"}
                </Text>
              </View>
            </View>

            {/* Phone Button */}
            <TouchableOpacity
              onPress={handleCall}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(0, 169, 150, 0.1)",
                alignItems: "center",
                justifyContent: "center",
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={20} color="#00A996" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Call Reporter Button */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: insets.bottom + 16,
          backgroundColor: "#F9FAFC",
        }}
      >
        <TouchableOpacity
          onPress={handleCall}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#00A996",
            height: 56,
            borderRadius: 16,
            gap: 8,
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="call" size={20} color="#FFFFFF" />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#FFFFFF",
              lineHeight: 24,
            }}
          >
            Call Reporter
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
