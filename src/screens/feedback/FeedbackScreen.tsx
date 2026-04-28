import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
import type { FeedbackFilterType, FeedbackPost } from "./types";

// Components
import { FeedbackCard, FilterTabs, IdeaBanner, SearchBar } from "./components";

// API
import {
  getPublicFeedback,
  voteFeedback,
  mapCategoryToLabel,
  timeAgo,
  type FeedbackItem,
} from "../../services/feedback";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ─── Map backend item → FeedbackPost ─────────────────────────────────────────

function mapToFeedbackPost(item: FeedbackItem): FeedbackPost {
  const votes = item.upvotes - item.downvotes;
  return {
    id: item.id,
    authorName: item.isAnonymous ? "Anonymous" : "Resident",
    authorInitials: item.isAnonymous ? undefined : "R",
    authorLocation: item.location ?? "Community",
    timeAgo: timeAgo(item.createdAt),
    isAnonymous: item.isAnonymous,
    title: item.title,
    category: (mapCategoryToLabel(item.category)
      .toLowerCase()
      .replace(/ & /g, "_")
      .replace(/ /g, "_")) as FeedbackPost["category"],
    description: item.content,
    image: undefined,
    votes,
    upvotes: item.upvotes,
    downvotes: item.downvotes,
    isBookmarked: false,
    userVote: null,
  };
}

export default function FeedbackScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const [activeFilter, setActiveFilter] = useState<FeedbackFilterType>("all");
  const [searchText, setSearchText]     = useState("");
  const [showMenu, setShowMenu]         = useState(false);

  const [posts, setPosts]           = useState<FeedbackPost[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchPosts = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const data = await getPublicFeedback();
      setPosts(data.map(mapToFeedbackPost));
    } catch {
      // silently fail — list stays empty
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // ── Vote ───────────────────────────────────────────────────────────────────

  const handleVote = useCallback(async (id: string, type: "up" | "down") => {
    const voteType = type === "up" ? "UPVOTE" : "DOWNVOTE";
    try {
      await voteFeedback(id, voteType);
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          const wasUp   = p.userVote === "up";
          const wasDown = p.userVote === "down";
          if (type === "up") {
            return {
              ...p,
              upvotes:   wasUp ? p.upvotes - 1 : p.upvotes + 1,
              downvotes: wasDown ? p.downvotes - 1 : p.downvotes,
              votes:     wasUp ? p.votes - 1 : p.votes + 1,
              userVote:  wasUp ? null : "up",
            };
          } else {
            return {
              ...p,
              downvotes: wasDown ? p.downvotes - 1 : p.downvotes + 1,
              upvotes:   wasUp ? p.upvotes - 1 : p.upvotes,
              votes:     wasDown ? p.votes + 1 : p.votes - 1,
              userVote:  wasDown ? null : "down",
            };
          }
        })
      );
    } catch {
      // silently fail
    }
  }, []);

  // ── Filter ─────────────────────────────────────────────────────────────────

  const filteredPosts = posts
    .filter((post) => {
      if (!searchText.trim()) return true;
      const q = searchText.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (activeFilter === "trending") return b.votes - a.votes;
      return 0; // "all" and "recent" — server already orders by date
    });

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
          zIndex: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ width: 24, height: 24, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 20, fontWeight: "600", color: "#000000", textAlign: "center", lineHeight: 30 }}>
          Feedback
        </Text>
        <TouchableOpacity
          onPress={() => setShowMenu(!showMenu)}
          style={{ width: 24, height: 24, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="list" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Dropdown Menu */}
      <Modal visible={showMenu} transparent animationType="fade" onRequestClose={() => setShowMenu(false)}>
        <Pressable style={{ flex: 1 }} onPress={() => setShowMenu(false)}>
          <View
            style={{
              position: "absolute",
              top: insets.top + 52,
              right: 16,
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.1,
              shadowRadius: 15,
              elevation: 8,
              overflow: "hidden",
            }}
          >
            <TouchableOpacity
              onPress={() => { setShowMenu(false); navigation.navigate("PrivateFeedback"); }}
              activeOpacity={0.6}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingLeft: 16, paddingRight: 24, height: 68 }}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#00A996" />
              <View>
                <Text style={{ fontSize: 14, fontWeight: "500", color: "#101828", lineHeight: 20 }}>Private Feedback</Text>
                <Text style={{ fontSize: 12, fontWeight: "500", color: "#6A7282", lineHeight: 16 }}>Messages to admin</Text>
              </View>
            </TouchableOpacity>

            <View style={{ height: 1.71, backgroundColor: "#F3F4F6" }} />

            <TouchableOpacity
              onPress={() => { setShowMenu(false); navigation.navigate("MyPosts"); }}
              activeOpacity={0.6}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingLeft: 16, paddingRight: 24, height: 68 }}
            >
              <Ionicons name="bulb-outline" size={20} color="#00A996" />
              <View>
                <Text style={{ fontSize: 14, fontWeight: "500", color: "#101828", lineHeight: 20 }}>My Posts</Text>
                <Text style={{ fontSize: 12, fontWeight: "500", color: "#6A7282", lineHeight: 16 }}>View your suggestions</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Content */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#00A996" />
          <Text style={{ color: "#9CA3AF", marginTop: 12 }}>Loading feedback...</Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40, gap: 12 }}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => fetchPosts(true)} tintColor="#00A996" />}
        >
          <SearchBar value={searchText} onChangeText={setSearchText} />
          <IdeaBanner onNewPost={() => navigation.navigate("CreatePost")} />
          <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

          <View style={{ gap: 16 }}>
            {filteredPosts.map((post) => (
              <FeedbackCard
                key={post.id}
                post={post}
                onReadMore={() => {}}
                onShare={() => {}}
              />
            ))}
          </View>

          {filteredPosts.length === 0 && (
            <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 60 }}>
              <Ionicons name="chatbox-outline" size={64} color="#D1D5DB" />
              <Text style={{ fontSize: 16, fontWeight: "500", color: "#9CA3AF", marginTop: 16 }}>
                No feedback posts found
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
