import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PostType = "private" | "public";

const CATEGORIES = [
  "Security & Safety",
  "Amenities",
  "Maintenance & Repairs",
  "Community",
  "Other",
];

export default function CreatePostScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Form state
  const [postType, setPostType] = useState<PostType>("public");
  const [category, setCategory] = useState("");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const isFormValid =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    category.length > 0;

  const handlePublish = () => {
    if (!isFormValid) return;
    Alert.alert(
      "Post Published!",
      `Your ${postType} feedback has been submitted.`,
      [{ text: "OK", onPress: () => navigation.goBack() }],
    );
  };

  const handlePickPhoto = () => {
    Alert.alert("Upload Photo", "Photo upload coming soon!");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <StatusBar barStyle="light-content" backgroundColor="#00A996" />

      {/* Teal Header */}
      <View
        style={{
          backgroundColor: "#00A996",
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingHorizontal: 16,
          paddingTop: insets.top + 8,
          paddingBottom: 16,
          height: insets.top + 60,
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
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "600",
            color: "#FFFFFF",
            lineHeight: 31.2,
          }}
        >
          Create Post
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 40,
            gap: 16,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Post Type */}
          <View style={{ gap: 8 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: "#364153",
                lineHeight: 21,
              }}
            >
              Post Type
            </Text>
            <View
              style={{
                flexDirection: "row",
                height: 45,
              }}
            >
              {/* Private button */}
              <TouchableOpacity
                onPress={() => setPostType("private")}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  backgroundColor:
                    postType === "private" ? "#00A996" : "#FFFFFF",
                  borderRadius: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginRight: 8,
                }}
              >
                <Ionicons
                  name="chatbubble-outline"
                  size={20}
                  color={postType === "private" ? "#FFFFFF" : "#364153"}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: postType === "private" ? "#FFFFFF" : "#364153",
                    lineHeight: 21,
                  }}
                >
                  Private
                </Text>
              </TouchableOpacity>

              {/* Public button */}
              <TouchableOpacity
                onPress={() => setPostType("public")}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  backgroundColor:
                    postType === "public" ? "#00A996" : "#FFFFFF",
                  borderRadius: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Ionicons
                  name="bulb-outline"
                  size={20}
                  color={postType === "public" ? "#FFFFFF" : "#364153"}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: postType === "public" ? "#FFFFFF" : "#364153",
                    lineHeight: 21,
                  }}
                >
                  Public
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "400",
                color: "#6A7282",
                lineHeight: 19.5,
              }}
            >
              {postType === "public"
                ? "Public posts can be voted on by all residents and may be implemented"
                : "Private feedback will only be seen by administrators"}
            </Text>
          </View>

          {/* Category */}
          <View style={{ gap: 8 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: "#364153",
                lineHeight: 21,
              }}
            >
              Category
            </Text>
            <TouchableOpacity
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              activeOpacity={0.7}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                height: 45,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: category ? "#101828" : "rgba(26,26,26,0.5)",
                  lineHeight: 21,
                }}
              >
                {category || "Select a category"}
              </Text>
              <Ionicons
                name={showCategoryPicker ? "chevron-up" : "chevron-down"}
                size={20}
                color="#6A7282"
              />
            </TouchableOpacity>

            {/* Category dropdown options */}
            {showCategoryPicker && (
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 16,
                  overflow: "hidden",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                {CATEGORIES.map((cat, index) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => {
                      setCategory(cat);
                      setShowCategoryPicker(false);
                    }}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderBottomWidth: index < CATEGORIES.length - 1 ? 1 : 0,
                      borderBottomColor: "#F3F4F6",
                      backgroundColor: category === cat ? "#F0FDF4" : "#FFFFFF",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "400",
                        color: "#364153",
                        lineHeight: 21,
                      }}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Title */}
          <View style={{ gap: 8 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: "#364153",
                lineHeight: 21,
              }}
            >
              Title
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Brief title of your suggestion"
              placeholderTextColor="rgba(26,26,26,0.5)"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                height: 45,
                paddingHorizontal: 16,
                fontSize: 14,
                fontWeight: "400",
                color: "#101828",
              }}
            />
          </View>

          {/* Description */}
          <View style={{ gap: 8 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: "#364153",
                lineHeight: 21,
              }}
            >
              Description
            </Text>
            <TextInput
              value={description}
              onChangeText={(text) => {
                if (text.length <= 500) {
                  setDescription(text);
                }
              }}
              placeholder="Provide detailed information about your suggestion. What problem does it solve? How will it benefit the community?"
              placeholderTextColor="rgba(26,26,26,0.5)"
              multiline
              textAlignVertical="top"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                height: 150,
                paddingHorizontal: 16,
                paddingTop: 12,
                paddingBottom: 12,
                fontSize: 14,
                fontWeight: "400",
                color: "#101828",
                lineHeight: 21,
              }}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: "400",
                color: "#6A7282",
                lineHeight: 16,
                textAlign: "right",
              }}
            >
              {description.length} / 500
            </Text>
          </View>

          {/* Add Photo (Optional) */}
          <View style={{ gap: 8 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: "#364153",
                lineHeight: 21,
              }}
            >
              Add Photo (Optional)
            </Text>
            <TouchableOpacity
              onPress={handlePickPhoto}
              activeOpacity={0.7}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                borderWidth: 1.71,
                borderColor: "#D1D5DC",
                height: 56,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Ionicons name="add-outline" size={20} color="#6A7282" />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: "#6A7282",
                  lineHeight: 21,
                }}
              >
                Upload Photo
              </Text>
            </TouchableOpacity>
          </View>

          {/* Post anonymously — only shown in public mode */}
          {postType === "public" && (
            <TouchableOpacity
              onPress={() => setIsAnonymous(!isAnonymous)}
              activeOpacity={0.8}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingHorizontal: 16,
                paddingVertical: 16,
              }}
            >
              {/* Checkbox */}
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  borderWidth: 1.71,
                  borderColor: isAnonymous ? "#00A996" : "#D1D5DC",
                  backgroundColor: isAnonymous ? "#00A996" : "#FFFFFF",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isAnonymous && (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                )}
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "400",
                    color: "#101828",
                    lineHeight: 20,
                  }}
                >
                  Post anonymously
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "400",
                    color: "#6A7282",
                    lineHeight: 16,
                  }}
                >
                  Your name will be hidden from other residents
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Tips box */}
          <View
            style={{
              backgroundColor: "#EFF6FF",
              borderWidth: 1.71,
              borderColor: "#BEDBFF",
              borderRadius: 16,
              paddingHorizontal: 18,
              paddingTop: 18,
              paddingBottom: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <Ionicons name="bulb-outline" size={20} color="#00A996" />
              <View style={{ flex: 1, gap: 8 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "400",
                    color: "#101828",
                    lineHeight: 20,
                  }}
                >
                  {postType === "public"
                    ? "Tips for a great post"
                    : "Your feedback matters"}
                </Text>
                <View style={{ gap: 4 }}>
                  {postType === "public" ? (
                    <>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "400",
                          color: "#4A5565",
                          lineHeight: 19.5,
                        }}
                      >
                        • Be clear and specific about your suggestion
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "400",
                          color: "#4A5565",
                          lineHeight: 19.5,
                        }}
                      >
                        • Explain how it benefits the community
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "400",
                          color: "#4A5565",
                          lineHeight: 19.5,
                        }}
                      >
                        • Add photos to make your post more engaging
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "400",
                          color: "#4A5565",
                          lineHeight: 19.5,
                        }}
                      >
                        • Provide detailed information about your concern
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "400",
                          color: "#4A5565",
                          lineHeight: 19.5,
                        }}
                      >
                        • Include relevant details (dates, locations, etc.)
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "400",
                          color: "#4A5565",
                          lineHeight: 19.5,
                        }}
                      >
                        • Admin will respond within 48 hours
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Publish Post Button */}
          <TouchableOpacity
            onPress={handlePublish}
            activeOpacity={isFormValid ? 0.7 : 1}
            style={{
              backgroundColor: isFormValid ? "#00A996" : "#D1D5DC",
              borderRadius: 16,
              height: 53,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Ionicons name="send-outline" size={20} color="#FFFFFF" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#FFFFFF",
                lineHeight: 21,
              }}
            >
              {postType === "public" ? "Publish Post" : "Send to Admin"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
