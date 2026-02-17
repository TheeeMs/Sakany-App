import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { PrivateFeedbackMessage, PrivateMessageStatus } from "../types";

// Category tag config
const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  security_safety: { bg: "#FFE2E2", text: "#C10007" },
  maintenance: { bg: "#DBEAFE", text: "#1447E6" },
  other: { bg: "#F3F4F6", text: "#364153" },
};

// Status tag config
const STATUS_STYLES: Record<
  PrivateMessageStatus,
  { bg: string; text: string; iconName: keyof typeof Ionicons.glyphMap }
> = {
  responded: {
    bg: "#DCFCE7",
    text: "#008236",
    iconName: "checkmark-circle-outline",
  },
  pending: {
    bg: "#FEF9C2",
    text: "#A65F00",
    iconName: "time-outline",
  },
};

interface PrivateMessageCardProps {
  message: PrivateFeedbackMessage;
}

export default function PrivateMessageCard({
  message,
}: PrivateMessageCardProps) {
  const [isExpanded, setIsExpanded] = useState(
    message.status === "responded" && message.adminResponse
      ? true
      : message.status === "pending"
        ? true
        : false,
  );

  const categoryStyle =
    CATEGORY_STYLES[message.category] || CATEGORY_STYLES.other;
  const statusStyle = STATUS_STYLES[message.status];

  return (
    <TouchableOpacity
      onPress={() => setIsExpanded(!isExpanded)}
      activeOpacity={0.8}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      {/* Header: Title + Tags + Time */}
      <View style={{ padding: 16, gap: 8 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, gap: 8 }}>
            {/* Title */}
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#101828",
                lineHeight: 22.4,
              }}
            >
              {message.title}
            </Text>

            {/* Category + Status tags */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              {/* Category tag */}
              <View
                style={{
                  backgroundColor: categoryStyle.bg,
                  borderRadius: 999,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "400",
                    color: categoryStyle.text,
                    lineHeight: 16,
                  }}
                >
                  {message.categoryLabel}
                </Text>
              </View>

              {/* Status tag */}
              <View
                style={{
                  backgroundColor: statusStyle.bg,
                  borderRadius: 999,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Ionicons
                  name={statusStyle.iconName}
                  size={12}
                  color={statusStyle.text}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "400",
                    color: statusStyle.text,
                    lineHeight: 16,
                  }}
                >
                  {message.status === "responded" ? "Responded" : "Pending"}
                </Text>
              </View>
            </View>
          </View>

          {/* Time ago */}
          <Text
            style={{
              fontSize: 12,
              fontWeight: "400",
              color: "#99A1AF",
              lineHeight: 16,
            }}
          >
            {message.timeAgo}
          </Text>
        </View>
      </View>

      {/* Expanded content */}
      {isExpanded && (
        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {/* Your Message label */}
          <Text
            style={{
              fontSize: 12,
              fontWeight: "400",
              color: "#6A7282",
              lineHeight: 16,
            }}
          >
            Your Message:
          </Text>

          {/* User's message */}
          <View
            style={{
              backgroundColor: "#F9FAFB",
              borderRadius: 16,
              padding: 12,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: "#4A5565",
                lineHeight: 22.75,
              }}
            >
              {message.userMessage}
            </Text>
          </View>

          {/* Admin Response (if responded) */}
          {message.adminResponse && (
            <View
              style={{
                backgroundColor: "#F0FDF4",
                borderWidth: 1.71,
                borderColor: "#B9F8CF",
                borderRadius: 16,
                paddingHorizontal: 18,
                paddingTop: 18,
                paddingBottom: 12,
                gap: 12,
              }}
            >
              {/* Team info row */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                {/* Green circle avatar */}
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                    backgroundColor: "#00A63E",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={16}
                    color="#FFFFFF"
                  />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "400",
                      color: "#0D542B",
                      lineHeight: 20,
                    }}
                  >
                    {message.adminResponse.teamName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "400",
                      color: "#00A63E",
                      lineHeight: 16,
                    }}
                  >
                    {message.adminResponse.date}
                  </Text>
                </View>
              </View>

              {/* Response message */}
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: "#016630",
                  lineHeight: 22.75,
                }}
              >
                {message.adminResponse.message}
              </Text>
            </View>
          )}

          {/* Pending Response (if pending) */}
          {message.pendingResponse && (
            <View
              style={{
                backgroundColor: "#FEFCE8",
                borderWidth: 1.71,
                borderColor: "#FFF085",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 16,
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ionicons name="time-outline" size={32} color="#A65F00" />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: "#894B00",
                  lineHeight: 20,
                  textAlign: "center",
                }}
              >
                {message.pendingResponse.message}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Footer: Tap to view/collapse */}
      <View
        style={{
          borderTopWidth: 1.71,
          borderTopColor: "#F3F4F6",
          marginTop: 12,
          alignItems: "center",
          justifyContent: "center",
          height: 47,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "400",
            color: "#6A7282",
            lineHeight: 16,
            textAlign: "center",
          }}
        >
          {isExpanded ? "Tap to collapse" : "Tap to view details"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
