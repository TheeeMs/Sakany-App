import React, { useState } from "react";
import axios from "axios";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  createMaintenanceRequest,
  resolveResidentUnitId,
} from "../../services/maintenance";
import type { RootStackParamList } from "../../navigation";
import { useAuthStore } from "../../store/authStore";
import type { CategoryType, RequestLocation } from "./types";
import { MAINTENANCE_CATEGORIES, mapCategoryToBackend } from "./categoryMap";
import { CategoryButton, LocationTab } from "./components";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "OtherRequest"
>;

export default function OtherRequestScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const residentId = useAuthStore((state) => state.user?.id);
  const unitId = useAuthStore((state) => state.unitId);

  const [location, setLocation] = useState<RequestLocation>("At Home");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onPickCategory = (category: CategoryType) => {
    if (category === "Other") {
      return;
    }
    navigation.navigate("RequestDetails", { category });
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please provide a description");
      return;
    }

    if (!residentId) {
      Alert.alert("Error", "Resident profile is not loaded yet.");
      return;
    }

    setIsSubmitting(true);

    try {
      const resolvedUnitId =
        unitId || (await resolveResidentUnitId(residentId));

      if (!resolvedUnitId) {
        Alert.alert(
          "Error",
          "Unit information is missing for your account. Please contact support.",
        );
        return;
      }

      if (!unitId) {
        useAuthStore.setState({ unitId: resolvedUnitId });
      }

      await createMaintenanceRequest({
        residentId,
        unitId: resolvedUnitId,
        title: title.trim(),
        description: description.trim(),
        category: mapCategoryToBackend("Other"),
        locationLabel: location,
        priority: "NORMAL",
        isPublic: false,
        photoUrls: [],
      });

      Alert.alert("Success", "Your maintenance request has been submitted!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      const message =
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object" &&
        error.response?.data !== null &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : "Failed to submit request. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View
        className="px-4 pb-4 border-b border-gray-100"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-800">
            Other request
          </Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Request Location
          </Text>
          <View className="flex-row gap-3">
            <LocationTab
              location="At Home"
              isSelected={location === "At Home"}
              onPress={() => setLocation("At Home")}
            />
            <LocationTab
              location="Neighborhood"
              isSelected={location === "Neighborhood"}
              onPress={() => setLocation("Neighborhood")}
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-3">
            Select Category
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {MAINTENANCE_CATEGORIES.map((category) => (
              <CategoryButton
                key={category.id}
                category={category}
                isSelected={category.name === "Other"}
                onPress={() => onPickCategory(category.name)}
              />
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Brief description of the issue"
            placeholderTextColor="#9CA3AF"
            className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800 text-base"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Provide detailed information about the issue"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800 text-base min-h-[120px]"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Add Photos (Optional)
          </Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Coming soon", "Photo upload will be available soon.")
            }
            className="bg-gray-50 rounded-xl px-4 py-6 border-2 border-dashed border-gray-300 items-center"
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={32} color="#9CA3AF" />
            <Text className="text-gray-500 text-sm mt-2">Upload Photos</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => void handleSubmit()}
          disabled={isSubmitting}
          className="bg-teal-500 rounded-2xl py-4 items-center"
          activeOpacity={0.8}
          style={{ opacity: isSubmitting ? 0.75 : 1 }}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white text-base font-semibold">
              Submit Request
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
