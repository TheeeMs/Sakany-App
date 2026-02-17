import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
import type { TabType, CategoryType } from "./types";

type ReportType = "missing" | "found";

const CATEGORIES: { label: string; value: CategoryType }[] = [
  { label: "Pet", value: "pet" },
  { label: "Item", value: "item" },
  { label: "Person", value: "person" },
  { label: "Vehicle", value: "vehicle" },
  { label: "Other", value: "other" },
];

export default function CreateReportScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Form state
  const [reportType, setReportType] = useState<ReportType>("missing");
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Handle submit
  const handleSubmit = () => {
    if (!category) {
      Alert.alert("Error", "Please select a category");
      return;
    }
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please provide a description");
      return;
    }
    if (!location.trim()) {
      Alert.alert("Error", "Please enter the last seen location");
      return;
    }

    Alert.alert("Success", "Report submitted successfully!", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  // Handle photo upload
  const handlePhotoUpload = () => {
    Alert.alert("Upload Photo", "Photo upload coming soon!");
  };

  // Get selected category label
  const selectedCategoryLabel = category
    ? CATEGORIES.find((c) => c.value === category)?.label
    : null;

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFC" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header / Top Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: insets.top + 8,
          paddingBottom: 12,
          backgroundColor: "#FFFFFF",
          height: insets.top + 54,
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
            marginRight: 24,
          }}
        >
          Create New Report
        </Text>
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
        keyboardShouldPersistTaps="handled"
      >
        {/* Type of Report */}
        <View style={{ gap: 8 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#000000",
              lineHeight: 24,
            }}
          >
            Type of Report
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              height: 42,
            }}
          >
            {/* Missing Button */}
            <TouchableOpacity
              onPress={() => setReportType("missing")}
              style={{
                width: 164,
                height: 42,
                borderRadius: 15,
                backgroundColor:
                  reportType === "missing" ? "#00A996" : "#FFFFFF",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: reportType === "missing" ? 0.05 : 0.05,
                shadowRadius: reportType === "missing" ? 2 : 4,
                elevation: reportType === "missing" ? 1 : 2,
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: reportType === "missing" ? "#FFFFFF" : "#64748B",
                  lineHeight: 16,
                }}
              >
                Missing
              </Text>
            </TouchableOpacity>

            {/* Found Button */}
            <TouchableOpacity
              onPress={() => setReportType("found")}
              style={{
                width: 143,
                height: 42,
                borderRadius: 15,
                backgroundColor: reportType === "found" ? "#00A996" : "#FFFFFF",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: reportType === "found" ? "#FFFFFF" : "#64748B",
                  lineHeight: 16,
                }}
              >
                Found
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Select Category */}
        <View style={{ gap: 0 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#000000",
              lineHeight: 24,
            }}
          >
            Select Category
          </Text>
        </View>

        {/* Category Dropdown */}
        <View>
          <TouchableOpacity
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
            style={{
              backgroundColor: "#FDFDFD",
              borderWidth: 1,
              borderColor: "#E4E4E7",
              borderRadius: 8,
              height: 46,
              paddingHorizontal: 16,
              paddingVertical: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 2,
              elevation: 1,
            }}
            activeOpacity={0.7}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: selectedCategoryLabel ? "#000000" : "#8B8B8B",
                lineHeight: 21,
              }}
            >
              {selectedCategoryLabel || "Choose one of the following"}
            </Text>
            <Ionicons
              name={showCategoryDropdown ? "chevron-up" : "chevron-down"}
              size={24}
              color="#000000"
            />
          </TouchableOpacity>

          {/* Dropdown Items */}
          {showCategoryDropdown && (
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderWidth: 1,
                borderColor: "#E4E4E7",
                borderRadius: 8,
                marginTop: 4,
                overflow: "hidden",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              {CATEGORIES.map((cat, index) => (
                <TouchableOpacity
                  key={cat.value}
                  onPress={() => {
                    setCategory(cat.value);
                    setShowCategoryDropdown(false);
                  }}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomWidth: index < CATEGORIES.length - 1 ? 1 : 0,
                    borderBottomColor: "#F3F4F6",
                    backgroundColor:
                      category === cat.value ? "#F0FDFA" : "#FFFFFF",
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: category === cat.value ? "600" : "400",
                      color: category === cat.value ? "#00A996" : "#000000",
                    }}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Title */}
        <View style={{ gap: 4 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#000000",
              lineHeight: 24,
            }}
          >
            Title
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Brief description"
            placeholderTextColor="rgba(26, 26, 26, 0.5)"
            style={{
              backgroundColor: "#FDFDFD",
              borderWidth: 1,
              borderColor: "#E4E4E7",
              borderRadius: 8,
              height: 45,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 14,
              fontWeight: "400",
              color: "#000000",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 2,
              elevation: 1,
            }}
          />
        </View>

        {/* Detailed Description */}
        <View style={{ gap: 4 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#000000",
              lineHeight: 24,
            }}
          >
            Detailed Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Provide detailed information (color, size, distinguishing features)"
            placeholderTextColor="rgba(26, 26, 26, 0.5)"
            multiline
            textAlignVertical="top"
            style={{
              backgroundColor: "#FDFDFD",
              borderWidth: 1,
              borderColor: "#E4E4E7",
              borderRadius: 8,
              height: 84,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 14,
              fontWeight: "400",
              color: "#000000",
              lineHeight: 21,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 2,
              elevation: 1,
            }}
          />
        </View>

        {/* Last Seen Location */}
        <View style={{ gap: 4 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#000000",
              lineHeight: 24,
            }}
          >
            Last Seen Location
          </Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Where was it last seen?"
            placeholderTextColor="rgba(26, 26, 26, 0.5)"
            style={{
              backgroundColor: "#FDFDFD",
              borderWidth: 1,
              borderColor: "#E4E4E7",
              borderRadius: 8,
              height: 45,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 14,
              fontWeight: "400",
              color: "#000000",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 2,
              elevation: 1,
            }}
          />
        </View>

        {/* Contact Number */}
        <View style={{ gap: 8 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#000000",
              lineHeight: 24,
            }}
          >
            Contact Number
          </Text>
          <View
            style={{
              backgroundColor: "#FDFDFD",
              borderWidth: 1,
              borderColor: "#E4E4E7",
              borderRadius: 8,
              height: 48,
              paddingHorizontal: 16,
              paddingVertical: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            {/* Country Code Section */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* Egypt Flag Emoji */}
              <Text style={{ fontSize: 18 }}>🇪🇬</Text>
              <Ionicons
                name="caret-down"
                size={16}
                color="#000000"
                style={{ marginLeft: 2 }}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "400",
                  color: "#101010",
                  marginLeft: 4,
                  letterSpacing: 0.15,
                  lineHeight: 22,
                }}
              >
                +20
              </Text>
            </View>

            {/* Phone Input */}
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="123 456 7890"
              placeholderTextColor="rgba(26, 26, 26, 0.5)"
              keyboardType="phone-pad"
              style={{
                flex: 1,
                fontSize: 16,
                fontWeight: "400",
                color: "#000000",
                padding: 0,
              }}
            />
          </View>
        </View>

        {/* Add Photos (optional) */}
        <View style={{ gap: 8 }}>
          <Text style={{ lineHeight: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#000000",
              }}
            >
              Add Photos{" "}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#000000",
              }}
            >
              (optional)
            </Text>
          </Text>

          {/* Upload Area */}
          <TouchableOpacity
            onPress={handlePhotoUpload}
            style={{
              borderWidth: 1.71,
              borderColor: "#D1D5DC",
              borderStyle: "dashed",
              borderRadius: 16,
              height: 135,
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              paddingHorizontal: 26,
              paddingTop: 26,
              paddingBottom: 2,
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="cloud-upload-outline" size={32} color="#00A996" />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: "#00A996",
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Click to upload
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "400",
                color: "#99A1AF",
                textAlign: "center",
                lineHeight: 16,
              }}
            >
              SVG, PNG, JPG or GIF (max. 800×400px)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            backgroundColor: "#00A996",
            height: 53,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
          }}
          activeOpacity={0.8}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 21,
            }}
          >
            Submit Report
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
