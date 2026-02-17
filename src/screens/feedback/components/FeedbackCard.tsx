import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type {
  FeedbackPost,
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

interface FeedbackCardProps {
  post: FeedbackPost;
  onBookmark?: (id: string) => void;
  onUpvote?: (id: string) => void;
  onDownvote?: (id: string) => void;
  onShare?: (id: string) => void;
  onReadMore?: (id: string) => void;
}

export default function FeedbackCard({
  post,
  onBookmark,
  onUpvote,
  onDownvote,
  onShare,
  onReadMore,
}: FeedbackCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked ?? false);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(
    post.userVote ?? null,
  );
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [downvotes, setDownvotes] = useState(post.downvotes);

  const categoryConfig = CATEGORY_CONFIG[post.category];

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(post.id);
  };

  const handleUpvote = () => {
    if (userVote === "up") {
      setUserVote(null);
      setUpvotes((prev) => prev - 1);
    } else {
      if (userVote === "down") {
        setDownvotes((prev) => prev - 1);
      }
      setUserVote("up");
      setUpvotes((prev) => prev + 1);
    }
    onUpvote?.(post.id);
  };

  const handleDownvote = () => {
    if (userVote === "down") {
      setUserVote(null);
      setDownvotes((prev) => prev - 1);
    } else {
      if (userVote === "up") {
        setUpvotes((prev) => prev - 1);
      }
      setUserVote("down");
      setDownvotes((prev) => prev + 1);
    }
    onDownvote?.(post.id);
  };

  // Truncate description
  const MAX_DESC_LENGTH = 120;
  const isLongDescription = post.description.length > MAX_DESC_LENGTH;
  const truncatedDescription = isLongDescription
    ? post.description.slice(0, MAX_DESC_LENGTH) + "..."
    : post.description;

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
      {/* Content Section */}
      <View style={{ padding: 16, gap: 12 }}>
        {/* Author Row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 12,
              flex: 1,
            }}
          >
            {/* Avatar */}
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {/* Gradient background using a linear gradient approximation */}
              <View
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#00A996",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "50%",
                  bottom: 0,
                  backgroundColor: "#008F7F",
                }}
              />
              {post.isAnonymous ? (
                <Ionicons
                  name="person"
                  size={20}
                  color="#FFFFFF"
                  style={{ zIndex: 1 }}
                />
              ) : (
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "400",
                    color: "#FFFFFF",
                    lineHeight: 20,
                    zIndex: 1,
                  }}
                >
                  {post.authorInitials ||
                    post.authorName.slice(0, 2).toUpperCase()}
                </Text>
              )}
            </View>

            {/* Name and Location */}
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#101828",
                    lineHeight: 20,
                  }}
                >
                  {post.authorName}
                </Text>
                {post.isAnonymous && <Text style={{ fontSize: 14 }}>🎭</Text>}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "400",
                    color: "#6A7282",
                    lineHeight: 16,
                  }}
                >
                  {post.authorLocation}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "400",
                    color: "#6A7282",
                    lineHeight: 16,
                  }}
                >
                  •
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "400",
                    color: "#6A7282",
                    lineHeight: 16,
                  }}
                >
                  {post.timeAgo}
                </Text>
              </View>
            </View>
          </View>

          {/* Bookmark Button */}
          <TouchableOpacity
            onPress={handleBookmark}
            style={{
              width: 20,
              height: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
            activeOpacity={0.6}
          >
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={18}
              color={isBookmarked ? "#00A996" : "#6A7282"}
            />
          </TouchableOpacity>
        </View>

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
        <View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "400",
              color: "#4A5565",
              lineHeight: 22.75,
            }}
          >
            {truncatedDescription}
            {"  "}
            {isLongDescription && (
              <Text
                onPress={() => onReadMore?.(post.id)}
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#00A996",
                  lineHeight: 20,
                }}
              >
                Read more
              </Text>
            )}
          </Text>
        </View>
      </View>

      {/* Image */}
      {post.image && (
        <Image
          source={post.image}
          style={{
            width: "100%",
            height: 192,
            backgroundColor: "#F3F4F6",
          }}
          resizeMode="cover"
        />
      )}

      {/* Votes count */}
      <View
        style={{
          borderTopWidth: 1.71,
          borderTopColor: "#F3F4F6",
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 8,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "400",
            color: "#6A7282",
            lineHeight: 16,
          }}
        >
          {post.votes} votes
        </Text>
      </View>

      {/* Action Buttons */}
      <View
        style={{
          borderTopWidth: 1.71,
          borderTopColor: "#F3F4F6",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
      >
        {/* Upvote */}
        <TouchableOpacity
          onPress={handleUpvote}
          style={{
            flex: 1,
            alignItems: "center",
            paddingVertical: 8,
            borderRadius: 16,
            backgroundColor: userVote === "up" ? "#F0FDF4" : "transparent",
          }}
          activeOpacity={0.6}
        >
          <Ionicons
            name="thumbs-up-outline"
            size={20}
            color={userVote === "up" ? "#00A63E" : "#4A5565"}
          />
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color: userVote === "up" ? "#00A63E" : "#4A5565",
              marginTop: 4,
              lineHeight: 16,
              textAlign: "center",
            }}
          >
            {upvotes}
          </Text>
        </TouchableOpacity>

        {/* Downvote */}
        <TouchableOpacity
          onPress={handleDownvote}
          style={{
            flex: 1,
            alignItems: "center",
            paddingVertical: 8,
            borderRadius: 16,
          }}
          activeOpacity={0.6}
        >
          <Ionicons
            name="thumbs-down-outline"
            size={20}
            color={userVote === "down" ? "#DC2626" : "#4A5565"}
          />
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color: userVote === "down" ? "#DC2626" : "#4A5565",
              marginTop: 4,
              lineHeight: 16,
              textAlign: "center",
            }}
          >
            {downvotes}
          </Text>
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity
          onPress={() => onShare?.(post.id)}
          style={{
            flex: 1,
            alignItems: "center",
            paddingVertical: 8,
            borderRadius: 16,
          }}
          activeOpacity={0.6}
        >
          <Ionicons name="share-social-outline" size={20} color="#4A5565" />
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color: "#4A5565",
              marginTop: 4,
              lineHeight: 16,
              textAlign: "center",
            }}
          >
            Share
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
