import React from "react";
import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { MissingFoundItem } from "../types";

interface MissingItemCardProps {
  item: MissingFoundItem;
  onDetailsPress: (item: MissingFoundItem) => void;
}

// Get category badge text
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

export default function MissingItemCard({
  item,
  onDetailsPress,
}: MissingItemCardProps) {
  const handleCall = () => {
    Linking.openURL(`tel:${item.ownerPhone}`);
  };

  const badgeColor = item.type === "missing" ? "#F87171" : "#34D399";

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        {/* Image */}
        <Image
          source={item.image}
          style={{
            width: 80,
            height: 80,
            borderRadius: 12,
            backgroundColor: "#F3F4F6",
          }}
          resizeMode="cover"
        />

        {/* Content */}
        <View style={{ flex: 1, marginLeft: 12 }}>
          {/* Badge and Time Row */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            {/* Category Badge */}
            <View
              style={{
                backgroundColor: `${badgeColor}20`,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "700",
                  color: badgeColor,
                  letterSpacing: 0.5,
                }}
              >
                {getCategoryBadge(item.category, item.type)}
              </Text>
            </View>

            {/* Time Ago */}
            <Text
              style={{
                fontSize: 12,
                color: "#9CA3AF",
                marginLeft: 8,
              }}
            >
              {item.timeAgo}
            </Text>
          </View>

          {/* Title */}
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#1F2937",
              marginBottom: 4,
            }}
            numberOfLines={1}
          >
            {item.title}
          </Text>

          {/* Description */}
          <Text
            style={{
              fontSize: 13,
              color: "#6B7280",
              lineHeight: 18,
            }}
            numberOfLines={2}
          >
            {item.description}
          </Text>

          {/* Location */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <Ionicons name="location-outline" size={14} color="#9CA3AF" />
            <Text
              style={{
                fontSize: 12,
                color: "#6B7280",
                marginLeft: 4,
              }}
            >
              {item.location}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View
        style={{
          flexDirection: "row",
          marginTop: 16,
          gap: 12,
        }}
      >
        {/* Call Owner Button */}
        <TouchableOpacity
          onPress={handleCall}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0D9488",
            paddingVertical: 12,
            borderRadius: 10,
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="call-outline" size={18} color="#FFFFFF" />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#FFFFFF",
              marginLeft: 6,
            }}
          >
            Call Owner
          </Text>
        </TouchableOpacity>

        {/* Details Button */}
        <TouchableOpacity
          onPress={() => onDetailsPress(item)}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
            paddingVertical: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
          activeOpacity={0.7}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
