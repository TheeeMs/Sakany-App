import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

type DurationUnit = "Hour" | "Day";

export default function CreateEventScreen() {
  const navigation = useNavigation();
  const [durationUnit, setDurationUnit] = useState<DurationUnit>("Hour");
  const [formData, setFormData] = useState({
    title: "AI & Future of Work Summit 2026",
    category: "",
    description: "",
    date: "",
    time: "",
    durationValue: "",
    location: "AI & Future of Work Summit 2026",
    contact: "",
  });

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
  };

  const handleAddLocation = () => {
    console.log("Add location");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="relative flex-row items-center justify-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity
          onPress={handleGoBack}
          className="absolute left-4 w-10 h-10 items-center justify-center z-10"
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">
          Create New Event
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Event Title */}
        <View className="px-6 mb-6 mt-4">
          <Text className="text-[17px] font-semibold text-[#1A1A1A] mb-2">
            Event Title
          </Text>
          <TextInput
            className="w-full h-14 px-4 bg-white border border-gray-200 rounded-xl text-base text-gray-900"
            placeholder="AI & Future of Work Summit 2026"
            placeholderTextColor="#9CA3AF"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />
        </View>

        {/* Event Category */}
        <View className="px-6 mb-6">
          <Text className="text-[17px] font-semibold text-[#1A1A1A] mb-2">
            Event Category
          </Text>
          <View className="w-full h-14 px-4 bg-white border border-gray-200 rounded-xl flex-row items-center justify-between">
            <Text className="text-base text-gray-400">Select category</Text>
            <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
          </View>
        </View>

        {/* Event Description */}
        <View className="px-6 mb-6">
          <Text className="text-[17px] font-semibold text-[#1A1A1A] mb-2">
            Event Description
          </Text>
          <TextInput
            className="w-full h-32 px-4 py-3 bg-white border border-gray-200 rounded-xl text-base text-gray-900"
            placeholder="Write a few lines about your event..."
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
          />
        </View>

        {/* Date & Time */}
        <View className="flex-row px-6 mb-6">
          <View className="flex-1 mr-2">
            <Text className="text-[17px] font-semibold text-[#1A1A1A] mb-2">
              Date
            </Text>
            <View className="w-full h-14 px-4 bg-white border border-gray-200 rounded-xl flex-row items-center">
              <TextInput
                className="flex-1 text-base text-gray-900"
                placeholder="DD-MM-YYYY"
                placeholderTextColor="#9CA3AF"
                value={formData.date}
                onChangeText={(text) =>
                  setFormData({ ...formData, date: text })
                }
              />
              <Ionicons name="calendar-outline" size={24} color="#9CA3AF" />
            </View>
          </View>

          <View className="flex-1 ml-2">
            <Text className="text-[17px] font-semibold text-[#1A1A1A] mb-2">
              Time
            </Text>
            <View className="w-full h-14 px-4 bg-white border border-gray-200 rounded-xl flex-row items-center">
              <TextInput
                className="flex-1 text-base text-gray-900"
                placeholder="00:00"
                placeholderTextColor="#9CA3AF"
                value={formData.time}
                onChangeText={(text) =>
                  setFormData({ ...formData, time: text })
                }
              />
              <Ionicons name="time-outline" size={24} color="#9CA3AF" />
            </View>
          </View>
        </View>

        {/* Duration */}
        <View className="px-6 mb-6">
          <Text className="text-[17px] font-semibold text-[#1A1A1A] mb-2">
            Duration
          </Text>
          <View className="w-full h-14 border border-gray-200 rounded-xl flex-row items-center overflow-hidden">
            {/* Number Selector */}
            <View className="flex-1 px-4 flex-row items-center justify-between">
              <Text className="text-base text-gray-400">Choose Number</Text>
              <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
            </View>

            {/* Divider */}
            <View className="w-[1px] h-9 bg-gray-200" />

            {/* Hour/Day Toggle */}
            <View className="p-1.5 bg-gray-50 m-1 rounded-[10px] flex-row">
              <TouchableOpacity
                onPress={() => setDurationUnit("Hour")}
                className={`px-4 py-2 rounded-lg ${
                  durationUnit === "Hour" ? "bg-[#00a693]" : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-[15px] font-medium ${
                    durationUnit === "Hour" ? "text-white" : "text-gray-500"
                  }`}
                >
                  Hour
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setDurationUnit("Day")}
                className={`px-4 py-2 rounded-lg ${
                  durationUnit === "Day" ? "bg-[#00a693]" : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-[15px] font-medium ${
                    durationUnit === "Day" ? "text-white" : "text-gray-500"
                  }`}
                >
                  Day
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Location */}
        <View className="px-6 mb-6">
          <Text className="text-[17px] font-semibold text-[#1A1A1A] mb-2">
            Location
          </Text>
          <View className="w-full h-14 px-4 bg-white border border-gray-200 rounded-xl flex-row items-center">
            <TextInput
              className="flex-1 text-base text-gray-400"
              value={formData.location}
              onChangeText={(text) =>
                setFormData({ ...formData, location: text })
              }
            />
            <TouchableOpacity onPress={handleAddLocation}>
              <Text className="text-[#00a693] font-semibold text-[15px]">
                Add Location
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Number */}
        <View className="px-6 mb-6">
          <Text className="text-[17px] font-semibold text-[#1A1A1A] mb-2">
            Contact Number
          </Text>
          <View className="w-full h-14 px-4 bg-white border border-gray-200 rounded-xl flex-row items-center">
            {/* Country Flag & Code */}
            <View className="flex-row items-center mr-3">
              <View className="w-8 h-5 rounded-sm overflow-hidden mr-2">
                <View className="flex-1 bg-red-600" />
                <View className="flex-1 bg-white items-center justify-center">
                  <View className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
                </View>
                <View className="flex-1 bg-black" />
              </View>
              <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
            </View>

            <Text className="text-base text-gray-900 font-medium mr-2">
              +20
            </Text>

            <TextInput
              className="flex-1 text-base text-gray-900"
              placeholder="123 456 7890"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={formData.contact}
              onChangeText={(text) =>
                setFormData({ ...formData, contact: text })
              }
            />
          </View>
        </View>

        {/* Event Cover Image */}
        <View className="px-6 mb-6">
          <Text className="text-[17px] font-semibold text-[#1A1A1A] mb-2">
            Event Cover Image{" "}
            <Text className="text-gray-400 font-normal">(Optional)</Text>
          </Text>
          <TouchableOpacity className="w-full h-32 bg-white border-2 border-dashed border-gray-200 rounded-xl items-center justify-center">
            <Ionicons name="cloud-upload-outline" size={32} color="#00a693" />
            <Text className="text-[#00a693] font-semibold text-[15px] mt-2">
              Click to upload
            </Text>
            <Text className="text-gray-400 text-xs mt-1">
              SVG, PNG, JPG or GIF (max. 800×400px)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing for Fixed Button */}
        <View className="h-32" />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 pt-4 pb-8"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 8,
        }}
      >
        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.9}
          className="w-full h-14 bg-[#00a693] rounded-2xl items-center justify-center"
        >
          <Text className="text-white font-bold text-lg">Submit Report</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
