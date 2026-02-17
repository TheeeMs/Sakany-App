import React from "react";
import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type {
  MyPost,
  PostStatus,
  FeedbackCategoryType,
  CategoryConfig,
} from "../types";

const CATEGORY_CONFIG: Record<FeedbackCategoryType, CategoryConfig> = {
  security_safety: {
    label: "Security & Safety",
    backgroundColor: "#FFE2E2",
    textColor: "#C10007",
  },
  amenities: {
    label: "Amenities",
    backgroundColor: "#F3E8FF",
    textColor: "#8200DB",
  },
  maintenance: {
    label: "Maintenance",
    backgroundColor: "#DBEAFE",
    textColor: "#1447E6",
  },
  community: {
    label: "Community",
    backgroundColor: "#D1FAE5",
    textColor: "#047857",
  },
  other: {
    label: "Other",
    backgroundColor: "#F3F4F6",
    textColor: "#6A7282",
  },
};

interface StatusDisplay {
  label: string;
  backgroundColor: string;
  textColor: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

const STATUS_CONFIG: Record<PostStatus, StatusDisplay> = {
  approved: {
    label: "Approved",
    backgroundColor: "#DCFCE7",
    textColor: "#008236",
    iconName: "checkmark-circle-outline",
  },
  under_review: {
    label: "Under Review",
    backgroundColor: "#DBEAFE",
    textColor: "#1447E6",
    iconName: "time-outline",
  },
  not_approved: {
    label: "Not Approved",
    backgroundColor: "#FFE2E2",
    textColor: "#C10007",
    iconName: "close-circle-outline",
  },
};

interface MyPostCardProps {
  post: MyPost;
}

export default function MyPostCard({ post }: MyPostCardProps) {
  const categoryConfig = CATEGORY_CONFIG[post.category];
  const statusConfig = STATUS_CONFIG[post.status];

  return (
    <View
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
      {/* Image (optional) */}
      {post.image && (
        <Image
          source={post.image}
          style={{
            width: "100%",
            height: 160,
            backgroundColor: "#F3F4F6",
          }}
          resizeMode="cover"
        />
      )}

      {/* Content */}
      <View style={{ padding: 16, gap: 12 }}>
        {/* Title */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#101828",
            lineHeight: 22.4,
          }}
        >
          {post.title}
        </Text>

        {/* Category Tag */}
        <View
          style={{
            alignSelf: "flex-start",
            backgroundColor: categoryConfig.backgroundColor,
            borderRadius: 999,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "400",
              color: categoryConfig.textColor,
              lineHeight: 16,
            }}
          >
            {categoryConfig.label}
          </Text>
        </View>

        {/* Description */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: "400",
            color: "#4A5565",
            lineHeight: 22.75,
          }}
        >
          {post.description}
        </Text>

        {/* Status Badge */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: statusConfig.backgroundColor,
            borderRadius: 16,
            paddingLeft: 12,
            height: 36,
          }}
        >
          <Ionicons
            name={statusConfig.iconName}
            size={16}
            color={statusConfig.textColor}
          />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "400",
              color: statusConfig.textColor,
              lineHeight: 20,
            }}
          >
            {statusConfig.label}
          </Text>
        </View>

        {/* Admin Response (if available) */}
        {post.adminResponse && (
          <View
            style={{
              backgroundColor: "#EFF6FF",
              borderWidth: 1.71,
              borderColor: "#BEDBFF",
              borderRadius: 16,
              paddingHorizontal: 14,
              paddingTop: 14,
              paddingBottom: 10,
              gap: 4,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "400",
                color: "#1C398E",
                lineHeight: 16,
              }}
            >
              Admin Response:
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "400",
                color: "#1447E6",
                lineHeight: 19.5,
              }}
            >
              {post.adminResponse.message}
            </Text>
          </View>
        )}

        {/* Bottom Row: Stats + Date */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderTopWidth: 1.71,
            borderTopColor: "#F3F4F6",
            paddingTop: 8,
          }}
        >
          {/* Stats */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* Upvotes */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ionicons name="thumbs-up-outline" size={16} color="#00A63E" />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: "#00A63E",
                  lineHeight: 20,
                }}
              >
                {post.upvotes}
              </Text>
            </View>

            {/* Downvotes */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ionicons name="thumbs-down-outline" size={16} color="#E7000B" />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: "#E7000B",
                  lineHeight: 20,
                }}
              >
                {post.downvotes}
              </Text>
            </View>

            {/* Views */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ionicons name="eye-outline" size={16} color="#6A7282" />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: "#6A7282",
                  lineHeight: 20,
                }}
              >
                {post.views}
              </Text>
            </View>
          </View>

          {/* Date */}
          <Text
            style={{
              fontSize: 12,
              fontWeight: "400",
              color: "#99A1AF",
              lineHeight: 16,
            }}
          >
            {post.date}
          </Text>
        </View>
      </View>
    </View>
  );
}
