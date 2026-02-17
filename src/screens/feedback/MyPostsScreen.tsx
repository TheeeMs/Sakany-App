import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
import type { MyPost } from "./types";

// Components
import { StatsBar, MyPostCard } from "./components";

export default function MyPostsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Sample Data
  const myPosts: MyPost[] = [
    {
      id: "1",
      title: "Add More Recycling Bins",
      category: "amenities",
      description:
        "We need more recycling bins throughout the compound to promote sustainability and make it easier for residents to recycle.",
      image: require("../../../assets/build.png"),
      status: "approved",
      adminResponse: {
        message:
          "Great suggestion! We will install 10 new recycling bins next month.",
      },
      upvotes: 18,
      downvotes: 5,
      views: 145,
      date: "Dec 10, 2024",
    },
    {
      id: "2",
      title: "Better Lighting in Parking Area",
      category: "security_safety",
      description:
        "The parking area near Building B needs better lighting for safety during nighttime.",
      status: "under_review",
      adminResponse: {
        message: "We are reviewing this request and evaluating the budget.",
      },
      upvotes: 12,
      downvotes: 1,
      views: 98,
      date: "Dec 7, 2024",
    },
    {
      id: "3",
      title: "Install WiFi in Garden Area",
      category: "amenities",
      description:
        "It would be great to have WiFi coverage in the garden area so residents can work or relax outdoors.",
      status: "not_approved",
      adminResponse: {
        message:
          "Unfortunately, this is not feasible due to technical limitations.",
      },
      upvotes: 8,
      downvotes: 12,
      views: 67,
      date: "Dec 3, 2024",
    },
  ];

  // Calculate stats
  const totalPosts = myPosts.length;
  const approvedCount = myPosts.filter((p) => p.status === "approved").length;
  const totalVotes = myPosts.reduce(
    (sum, p) => sum + p.upvotes + p.downvotes,
    0,
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFC" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header / Top Bar */}
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
          style={{
            width: 24,
            height: 24,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            fontSize: 20,
            fontWeight: "600",
            color: "#000000",
            textAlign: "center",
            lineHeight: 30,
          }}
        >
          My Posts
        </Text>
        <TouchableOpacity
          style={{
            width: 24,
            height: 24,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="list" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 40,
          gap: 12,
        }}
      >
        {/* Stats Bar */}
        <StatsBar
          totalPosts={totalPosts}
          approved={approvedCount}
          totalVotes={totalVotes}
        />

        {/* My Posts List */}
        {myPosts.map((post) => (
          <MyPostCard key={post.id} post={post} />
        ))}

        {myPosts.length === 0 && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 60,
            }}
          >
            <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#9CA3AF",
                marginTop: 16,
              }}
            >
              You haven't posted anything yet
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
