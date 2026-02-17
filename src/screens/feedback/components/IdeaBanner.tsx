import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface IdeaBannerProps {
  onNewPost: () => void;
}

export default function IdeaBanner({ onNewPost }: IdeaBannerProps) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderWidth: 1.71,
        borderColor: "#E5E7EB",
        borderRadius: 16,
        padding: 16,
        gap: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      {/* Top row with icon and text */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Teal circle icon */}
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 16,
            backgroundColor: "#00A996",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="bulb-outline" size={20} color="#FFFFFF" />
        </View>

        {/* Text content */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#101828",
              lineHeight: 20,
            }}
          >
            Have an idea?
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "400",
              color: "#6A7282",
              lineHeight: 16,
              marginTop: 4,
            }}
          >
            Share suggestions to improve our community
          </Text>
        </View>
      </View>

      {/* New Post Button */}
      <TouchableOpacity
        onPress={onNewPost}
        style={{
          backgroundColor: "#00A996",
          borderRadius: 16,
          height: 40,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={16} color="#FFFFFF" />
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: "#FFFFFF",
            lineHeight: 20,
          }}
        >
          New Post
        </Text>
      </TouchableOpacity>
    </View>
  );
}
