import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { CategoryType } from "./types";

interface RouteParams {
  category: CategoryType;
}

export default function RequestDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for your request");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please provide a description");
      return;
    }

    // Submit the request
    Alert.alert("Success", "Your maintenance request has been submitted!", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const handleUploadPhotos = () => {
    console.log("Upload photos");
  };

  const categoryTitle = params?.category
    ? `${params.category} request`
    : "Other Request";

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-12 pb-4 border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center mr-3"
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-800">
            {categoryTitle}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Title Input */}
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

        {/* Description Input */}
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

        {/* Upload Photos */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Add Photos (Optional)
          </Text>
          <TouchableOpacity
            onPress={handleUploadPhotos}
            className="bg-gray-50 rounded-xl px-4 py-6 border-2 border-dashed border-gray-300 items-center"
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={32} color="#9CA3AF" />
            <Text className="text-gray-500 text-sm mt-2">Upload Photos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className="px-4 pb-6 pt-4 border-t border-gray-100">
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-teal-500 rounded-2xl py-4 items-center"
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-semibold">
            Submit Request
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
