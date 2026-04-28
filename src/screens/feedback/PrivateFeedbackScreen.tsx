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
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
import type { PrivateFeedbackMessage } from "./types";

// Components
import { PrivateMessageCard } from "./components";

// API
import {
  getMyFeedback,
  mapCategoryToLabel,
  timeAgo,
  type FeedbackItem,
} from "../../services/feedback";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ─── Map backend item → PrivateFeedbackMessage ────────────────────────────────

function mapToPrivateMessage(item: FeedbackItem): PrivateFeedbackMessage {
  const catLabel = mapCategoryToLabel(item.category);

  // Map category label → PrivateFeedbackCategory
  type PrivateCat = PrivateFeedbackMessage["category"];
  const catMap: Record<string, PrivateCat> = {
    "Security & Safety": "security_safety",
    "Maintenance":       "maintenance",
  };
  const category: PrivateCat = catMap[catLabel] ?? "other";

  const hasAdminResponse = !!item.adminResponse;

  return {
    id:            item.id,
    title:         item.title,
    category,
    categoryLabel: catLabel,
    status:        hasAdminResponse ? "responded" : "pending",
    timeAgo:       timeAgo(item.createdAt),
    userMessage:   item.content,
    adminResponse: hasAdminResponse
      ? { teamName: "Admin Team", date: "", message: item.adminResponse! }
      : undefined,
    pendingResponse: !hasAdminResponse
      ? { message: "We're reviewing your feedback and will respond soon" }
      : undefined,
  };
}

export default function PrivateFeedbackScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets     = useSafeAreaInsets();

  const [messages,     setMessages]     = useState<PrivateFeedbackMessage[]>([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchMessages = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const summary = await getMyFeedback();
      // Filter private-only posts
      const privateItems = summary.posts.filter(
        (item: FeedbackItem) => !item.isPublic
      );
      setMessages(privateItems.map(mapToPrivateMessage));
    } catch {
      // silently fail — list stays empty
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalMessages    = messages.length;
  const awaitingResponse = messages.filter((m) => m.status === "pending").length;

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
          Private Feedback
        </Text>

        {/* New Message — navigate to CreatePost with private pre-selected */}
        <TouchableOpacity
          onPress={() => navigation.navigate("CreatePost")}
          style={{ width: 24, height: 24, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="add" size={26} color="#00A996" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#00A996" />
          <Text style={{ color: "#9CA3AF", marginTop: 12 }}>Loading messages...</Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40, gap: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchMessages(true)}
              tintColor="#00A996"
            />
          }
        >
          {/* Stats Bar */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            {/* Total Messages */}
            <View style={{ backgroundColor: "#E7F7F7", borderRadius: 16, width: "48%", height: 72, paddingTop: 12, paddingHorizontal: 12, alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 20, fontWeight: "400", color: "#00A996", lineHeight: 28, textAlign: "center" }}>
                {totalMessages}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: "400", color: "#00A996", lineHeight: 16, textAlign: "center" }}>
                Total Messages
              </Text>
            </View>

            {/* Awaiting Response */}
            <View style={{ backgroundColor: "#E7F7F7", borderRadius: 16, width: "48%", height: 72, paddingTop: 12, paddingHorizontal: 12, alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 20, fontWeight: "400", color: "#00A996", lineHeight: 28, textAlign: "center" }}>
                {awaitingResponse}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: "400", color: "#00A996", lineHeight: 16, textAlign: "center" }}>
                Awaiting Response
              </Text>
            </View>
          </View>

          {/* Message Cards */}
          {messages.map((message) => (
            <PrivateMessageCard key={message.id} message={message} />
          ))}

          {/* Empty State */}
          {messages.length === 0 && (
            <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 60 }}>
              <Ionicons name="chatbubbles-outline" size={64} color="#D1D5DB" />
              <Text style={{ fontSize: 16, fontWeight: "500", color: "#9CA3AF", marginTop: 16 }}>
                No private messages yet
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("CreatePost")}
                style={{ marginTop: 16, backgroundColor: "#00A996", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 14 }}>
                  Send Private Message
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
