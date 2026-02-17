import React from "react";
import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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

// Get badge color based on item type (missing = red, found = green)
const getBadgeColor = (type: string): string => {
  return type === "found" ? "#059669" : "#DE4544";
};

export default function MissingItemCard({
  item,
  onDetailsPress,
}: MissingItemCardProps) {
  const handleCall = () => {
    Linking.openURL(`tel:${item.ownerPhone}`);
  };

  const badgeColor = getBadgeColor(item.type);

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 8,
        padding: 12,
      }}
    >
      {/* Content Section */}
      <View style={{ gap: 12 }}>
        {/* Top Section: Image + Info */}
        <View style={{ flexDirection: "row", gap: 8, height: 128 }}>
          {/* Image with category badge */}
          <View
            style={{
              width: 128,
              height: 128,
              borderRadius: 12,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Image
              source={item.image}
              style={{
                width: 128,
                height: 128,
                borderRadius: 12,
                backgroundColor: "#F3F4F6",
              }}
              resizeMode="cover"
            />
            {/* Category Badge */}
            <View
              style={{
                position: "absolute",
                bottom: 4,
                left: 4,
                backgroundColor: badgeColor,
                paddingHorizontal: 10,
                paddingVertical: 2,
                borderRadius: 6,
                minWidth: 66,
                height: 18,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: "#FFFFFF",
                  textAlign: "center",
                  lineHeight: 18,
                }}
              >
                {getCategoryLabel(item.category)}
              </Text>
            </View>
          </View>

          {/* Info */}
          <View style={{ flex: 1, gap: 8 }}>
            {/* Title */}
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#000000",
                lineHeight: 24,
              }}
              numberOfLines={1}
            >
              {item.title}
            </Text>

            {/* Owner */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 200,
                  backgroundColor: "#99DCD5",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="person" size={12} color="#FFFFFF" />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  color: "#666666",
                  fontWeight: "500",
                  lineHeight: 24,
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
                gap: 4,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="location" size={18} color="#00A996" />
              </View>
              <Text
                style={{
                  fontSize: 13,
                  color: "#666666",
                  fontWeight: "500",
                  flex: 1,
                  lineHeight: 18.5,
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
                gap: 4,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="time" size={18} color="#00A996" />
              </View>
              <Text
                style={{
                  fontSize: 13,
                  color: "#666666",
                  fontWeight: "500",
                  lineHeight: 19.5,
                }}
              >
                {item.date || "Recently"} · {item.timeAgo}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text
          style={{
            fontSize: 13,
            color: "#666666",
            fontWeight: "500",
            lineHeight: 19.5,
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
          gap: 8,
          marginTop: 12,
          height: 46,
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
            backgroundColor: "#00A996",
            height: 46,
            borderRadius: 12,
            gap: 5,
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="call" size={20} color="#FFFFFF" />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#FFFFFF",
            }}
          >
            Contact
          </Text>
        </TouchableOpacity>

        {/* Details Button */}
        <TouchableOpacity
          onPress={() => onDetailsPress(item)}
          style={{
            width: 114,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
            height: 46,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#63CBC4",
            gap: 5,
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#63CBC4"
          />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#63CBC4",
            }}
          >
            Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
