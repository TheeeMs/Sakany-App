import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
import type { MyPost } from "./types";

// Components
import { StatsBar, MyPostCard } from "./components";

// API
import {
  getMyFeedback,
  mapCategoryToLabel,
  mapStatus,
  formatDate,
  type FeedbackItem,
} from "../../services/feedback";

// ─── Map backend item → MyPost ────────────────────────────────────────────────

function mapToMyPost(item: FeedbackItem): MyPost {
  return {
    id: item.id,
    title: item.title,
    category: (mapCategoryToLabel(item.category)
      .toLowerCase()
      .replace(/ & /g, "_")
      .replace(/ /g, "_")) as MyPost["category"],
    description: item.content,
    image: undefined,
    status: mapStatus(item.status),
    adminResponse: item.adminResponse ? { message: item.adminResponse } : undefined,
    upvotes: item.upvotes,
    downvotes: item.downvotes,
    views: item.viewCount,
    date: formatDate(item.createdAt),
  };
}

export default function MyPostsScreen() {
  const navigation = useNavigation();
  const insets     = useSafeAreaInsets();

  const [myPosts,     setMyPosts]     = useState<MyPost[]>([]);
  const [stats,       setStats]       = useState({ totalPosts: 0, approvedPosts: 0, totalVotes: 0 });
  const [isLoading,   setIsLoading]   = useState(true);
  const [isRefreshing,setIsRefreshing]= useState(false);

  const fetchMyPosts = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const summary = await getMyFeedback();
      setMyPosts(summary.posts.map(mapToMyPost));
      setStats({
        totalPosts:    summary.totalPosts,
        approvedPosts: summary.approvedPosts,
        totalVotes:    summary.totalVotes,
      });
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchMyPosts(); }, [fetchMyPosts]);

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFC" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
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
          style={{ width: 24, height: 24, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 20, fontWeight: "600", color: "#000000", textAlign: "center", lineHeight: 30 }}>
          My Posts
        </Text>
        {/* Refresh button */}
        <TouchableOpacity
          onPress={() => fetchMyPosts(true)}
          style={{ width: 24, height: 24, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="refresh-outline" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#00A996" />
          <Text style={{ color: "#9CA3AF", marginTop: 12 }}>Loading your posts...</Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40, gap: 12 }}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => fetchMyPosts(true)} tintColor="#00A996" />}
        >
          {/* Stats */}
          <StatsBar
            totalPosts={stats.totalPosts}
            approved={stats.approvedPosts}
            totalVotes={stats.totalVotes}
          />

          {/* Posts */}
          {myPosts.map((post) => (
            <MyPostCard key={post.id} post={post} />
          ))}

          {myPosts.length === 0 && (
            <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 60 }}>
              <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
              <Text style={{ fontSize: 16, fontWeight: "500", color: "#9CA3AF", marginTop: 16 }}>
                You haven't posted anything yet
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
