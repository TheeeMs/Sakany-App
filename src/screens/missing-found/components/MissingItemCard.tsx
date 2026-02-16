import React from "react";
import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import type { MissingFoundItem } from "../types";

interface MissingItemCardProps {
  item: MissingFoundItem;
  onDetailsPress: (item: MissingFoundItem) => void;
}

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

// Get category badge color
const getCategoryColor = (category: string): string => {
  switch (category) {
    case "pet":
      return "#F59E0B"; // amber
    case "item":
      return "#0D9488"; // teal
    case "person":
      return "#6366F1"; // indigo
    case "vehicle":
      return "#EF4444"; // red
    default:
      return "#6B7280"; // gray
  }
};

export default function MissingItemCard({
  item,
  onDetailsPress,
}: MissingItemCardProps) {
  const handleCall = () => {
    Linking.openURL(`tel:${item.ownerPhone}`);
  };

  const categoryColor = getCategoryColor(item.category);

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        overflow: "hidden",
      }}
    >
      {/* Top Section: Image + Info */}
      <View style={{ flexDirection: "row", padding: 14 }}>
        {/* Image with category badge */}
        <View style={{ position: "relative" }}>
          <Image
            source={item.image}
            style={{
              width: 100,
              height: 100,
              borderRadius: 12,
              backgroundColor: "#F3F4F6",
            }}
            resizeMode="cover"
          />
          {/* Category Badge on Image */}
          <View
            style={{
              position: "absolute",
              bottom: 6,
              left: 6,
              backgroundColor: categoryColor,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: "700",
                color: "#FFFFFF",
              }}
            >
              {getCategoryLabel(item.category)}
            </Text>
          </View>
        </View>

        {/* Info */}
        <View style={{ flex: 1, marginLeft: 12, justifyContent: "center" }}>
          {/* Title */}
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#1F2937",
              marginBottom: 8,
            }}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          {/* Owner */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                backgroundColor: "#D1FAE5",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 6,
              }}
            >
              <Ionicons name="person" size={12} color="#059669" />
            </View>
            <Text
              style={{
                fontSize: 13,
                color: "#4B5563",
                fontWeight: "500",
              }}
            >
              {item.ownerName}
            </Text>
          </View>

          {/* Location */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              marginBottom: 5,
            }}
          >
            <Ionicons
              name="location-outline"
              size={16}
              color="#EF4444"
              style={{ marginTop: 1, marginRight: 5 }}
            />
            <Text
              style={{
                fontSize: 12,
                color: "#6B7280",
                flex: 1,
              }}
              numberOfLines={2}
            >
              {item.location}
              {item.locationDetail ? ` · ${item.locationDetail}` : ""}
            </Text>
          </View>

          {/* Date & Time */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="time-outline"
              size={15}
              color="#9CA3AF"
              style={{ marginRight: 5 }}
            />
            <Text
              style={{
                fontSize: 12,
                color: "#9CA3AF",
              }}
            >
              {item.date || "Recently"} · {item.timeAgo}
            </Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
        <Text
          style={{
            fontSize: 13,
            color: "#6B7280",
            lineHeight: 19,
          }}
          numberOfLines={2}
        >
          {item.description}
        </Text>
      </View>

      {/* Action Buttons */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 14,
          paddingBottom: 14,
          gap: 10,
        }}
      >
        {/* Contact Button */}
        <TouchableOpacity
          onPress={handleCall}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0D9488",
            paddingVertical: 11,
            borderRadius: 10,
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="call" size={16} color="#FFFFFF" />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#FFFFFF",
              marginLeft: 6,
            }}
          >
            Contact
          </Text>
        </TouchableOpacity>

        {/* Details Button */}
        <TouchableOpacity
          onPress={() => onDetailsPress(item)}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
            paddingVertical: 11,
            borderRadius: 10,
            borderWidth: 1.5,
            borderColor: "#0D9488",
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#0D9488"
          />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#0D9488",
              marginLeft: 5,
            }}
          >
            Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
