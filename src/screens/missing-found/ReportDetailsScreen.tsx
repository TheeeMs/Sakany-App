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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
import type { MissingFoundItem } from "./types";

type ReportDetailsRouteProp = RouteProp<
  { ReportDetails: { item: MissingFoundItem } },
  "ReportDetails"
>;

// Get category badge
const getCategoryBadge = (category: string, type: string): string => {
  const prefix = type === "missing" ? "MISSING" : "FOUND";
  switch (category) {
    case "pet":
      return `${prefix} PET`;
    case "item":
      return `${prefix} ITEM`;
    case "person":
      return `${prefix} PERSON`;
    default:
      return prefix;
  }
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

  const badgeColor = item.type === "missing" ? "#F87171" : "#34D399";

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
          Report Details
        </Text>
        <TouchableOpacity
          onPress={handleShare}
          style={{
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="share-social-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Main Image */}
        <View
          style={{
            marginHorizontal: 16,
            borderRadius: 16,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Image
            source={item.image}
            style={{
              width: "100%",
              height: 220,
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
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "700",
                color: "#FFFFFF",
                letterSpacing: 0.5,
              }}
            >
              {getCategoryBadge(item.category, item.type)}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: "#1F2937",
            marginHorizontal: 16,
            marginTop: 20,
          }}
        >
          {item.title}
        </Text>

        {/* Date and Time */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 16,
            marginTop: 10,
          }}
        >
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text
            style={{
              fontSize: 14,
              color: "#6B7280",
              marginLeft: 6,
            }}
          >
            {item.date || "Dec 22, 2024"}
          </Text>
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: "#D1D5DB",
              marginHorizontal: 10,
            }}
          />
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text
            style={{
              fontSize: 14,
              color: "#6B7280",
              marginLeft: 6,
            }}
          >
            {item.timeAgo}
          </Text>
        </View>

        {/* Description Section */}
        <View style={{ marginHorizontal: 16, marginTop: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#1F2937",
              marginBottom: 10,
            }}
          >
            Description
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: "#4B5563",
              lineHeight: 24,
            }}
          >
            {item.description}
          </Text>
        </View>

        {/* Location Card */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 16,
            marginTop: 24,
            backgroundColor: "#F9FAFB",
            borderRadius: 12,
            padding: 16,
          }}
          activeOpacity={0.7}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "#ECFDF5",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="location" size={22} color="#10B981" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: "600",
                color: "#9CA3AF",
                letterSpacing: 0.5,
                marginBottom: 4,
              }}
            >
              LAST SEEN LOCATION
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "600",
                color: "#1F2937",
              }}
            >
              {item.location}
            </Text>
            {item.locationDetail && (
              <Text
                style={{
                  fontSize: 13,
                  color: "#6B7280",
                  marginTop: 2,
                }}
              >
                {item.locationDetail}
              </Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Reported By Section */}
        <View style={{ marginHorizontal: 16, marginTop: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#1F2937",
              marginBottom: 12,
            }}
          >
            Reported By
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#F9FAFB",
              borderRadius: 12,
              padding: 16,
            }}
          >
            {/* Avatar */}
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#D1FAE5",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#059669",
                }}
              >
                {item.ownerInitials ||
                  item.ownerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
              </Text>
            </View>

            {/* Info */}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#1F2937",
                }}
              >
                {item.ownerName}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                {item.isVerified && (
                  <>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#10B981",
                        marginRight: 6,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#6B7280",
                      }}
                    >
                      Verified Resident
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#D1D5DB",
                        marginHorizontal: 6,
                      }}
                    >
                      •
                    </Text>
                  </>
                )}
                <Text
                  style={{
                    fontSize: 13,
                    color: "#6B7280",
                  }}
                >
                  {item.ownerUnit || "Unit 205"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Call Button */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: insets.bottom + 16,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F3F4F6",
        }}
      >
        <TouchableOpacity
          onPress={handleCall}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0D9488",
            paddingVertical: 16,
            borderRadius: 12,
            shadowColor: "#0D9488",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 5,
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="call-outline" size={20} color="#FFFFFF" />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#FFFFFF",
              marginLeft: 8,
            }}
          >
            Call Reporter
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
