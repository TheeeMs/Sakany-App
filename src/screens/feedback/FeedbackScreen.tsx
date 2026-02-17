import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function FeedbackScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  // State
  const [activeFilter, setActiveFilter] = useState<FeedbackFilterType>("all");
  const [searchText, setSearchText] = useState("");

  // Sample Data
  const feedbackPosts: FeedbackPost[] = [
    {
      id: "1",
      authorName: "Anonymous",
      isAnonymous: true,
      authorLocation: "Building D",
      timeAgo: "2h ago",
      title: "Install More Street Lights",
      category: "security_safety",
      description:
        "The area near Building D is too dark at night. More lighting would improve safety and make residents feel more secure when walking around the compound after dark.",
      image: require("../../../assets/build.png"),
      votes: 27,
      upvotes: 24,
      downvotes: 3,
      isBookmarked: false,
      userVote: null,
    },
    {
      id: "2",
      authorName: "Sarah Miller",
      authorInitials: "SM",
      authorLocation: "Building A - Unit 205",
      timeAgo: "5h ago",
      title: "Add More Recycling Bins",
      category: "amenities",
      description:
        "We need more recycling bins throughout the compound to promote sustainability and make it easier for residents to recycle their waste properly.",
      image: require("../../../assets/build.png"),
      votes: 23,
      upvotes: 18,
      downvotes: 5,
      isBookmarked: true,
      userVote: "up",
    },
    {
      id: "3",
      authorName: "Ahmed Hassan",
      authorInitials: "AH",
      authorLocation: "Building C - Unit 301",
      timeAgo: "1d ago",
      title: "Extend Pool Hours on Weekends",
      category: "amenities",
      description:
        "The pool closes too early on weekends. Many residents would appreciate extended hours, especially during summer months.",
      image: null,
      votes: 39,
      upvotes: 31,
      downvotes: 8,
      isBookmarked: false,
      userVote: null,
    },
    {
      id: "4",
      authorName: "John Davis",
      authorInitials: "JD",
      authorLocation: "Building B - Unit 102",
      timeAgo: "2d ago",
      title: "Improve Playground Equipment",
      category: "maintenance",
      description:
        "Some playground equipment needs repair or replacement. Would be great to have more modern, safe equipment for our children to play with.",
      image: require("../../../assets/build.png"),
      votes: 17,
      upvotes: 15,
      downvotes: 2,
      isBookmarked: false,
      userVote: null,
    },
  ];

  // Filter posts based on search
  const filteredPosts = feedbackPosts.filter((post) => {
    if (!searchText.trim()) return true;
    const query = searchText.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.authorName.toLowerCase().includes(query)
    );
  });

  // Handle New Post
  const handleNewPost = () => {
    Alert.alert("New Post", "Create new feedback post coming soon!");
  };

  // Handle Read More
  const handleReadMore = (id: string) => {
    const post = feedbackPosts.find((p) => p.id === id);
    if (post) {
      Alert.alert(post.title, post.description);
    }
  };

  // Handle Share
  const handleShare = (id: string) => {
    Alert.alert("Share", "Share functionality coming soon!");
  };

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
          Feedback
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("MyPosts")}
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
          paddingTop: 12,
          paddingBottom: 40,
          gap: 12,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar */}
        <SearchBar value={searchText} onChangeText={setSearchText} />

        {/* Idea Banner */}
        <IdeaBanner onNewPost={handleNewPost} />

        {/* Filter Tabs */}
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Feedback Posts */}
        <View style={{ gap: 16 }}>
          {filteredPosts.map((post) => (
            <FeedbackCard
              key={post.id}
              post={post}
              onReadMore={handleReadMore}
              onShare={handleShare}
            />
          ))}
        </View>

        {filteredPosts.length === 0 && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 60,
            }}
          >
            <Ionicons name="chatbox-outline" size={64} color="#D1D5DB" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#9CA3AF",
                marginTop: 16,
              }}
            >
              No feedback posts found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
