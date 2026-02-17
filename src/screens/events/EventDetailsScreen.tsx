import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { RootStackParamList } from "../../navigation/AppNavigator";

type EventDetailsRouteProp = RouteProp<RootStackParamList, "EventDetails">;

const EVENT_IMAGE = require("../../../assets/build.png");

export default function EventDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<EventDetailsRouteProp>();
  const { eventId } = route.params;

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleShare = () => {
    console.log("Share event:", eventId);
  };

  const handleCall = () => {
    console.log("Call organizer");
  };

  const handleMessage = () => {
    console.log("Message organizer");
  };

  const handleViewLocation = () => {
    console.log("View location");
  };

  const handleJoinNow = () => {
    console.log("Join event:", eventId);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />

      {/* Hero Image Section */}
      <View className="relative h-[340px] w-full">
        <Image
          source={EVENT_IMAGE}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Action Buttons */}
        <View className="absolute top-12 left-0 right-0 px-4 flex-row justify-between items-center">
          <TouchableOpacity
            onPress={handleGoBack}
            className="w-10 h-10 rounded-full bg-white items-center justify-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleShare}
            className="w-10 h-10 rounded-full bg-white items-center justify-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Ionicons name="share-social-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Card with Rounded Top */}
      <ScrollView
        className="flex-1 -mt-10 bg-white rounded-t-[40px] px-6 pt-3"
        showsVerticalScrollIndicator={false}
      >
        {/* Handle Bar */}
        <View className="items-center mb-6">
          <View className="w-20 h-1.5 bg-gray-200 rounded-full" />
        </View>

        {/* Event Header */}
        <View className="mb-6">
          <Text className="text-[#00a693] font-medium text-sm mb-2">
            Community
          </Text>
          <Text className="text-[28px] font-bold text-[#050B1B] leading-tight mb-2">
            Summer Pool Party
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="information-circle" size={16} color="#00a693" />
            <Text className="text-gray-500 text-sm ml-2">Jul 15 - 4:00 PM</Text>
          </View>
        </View>

        {/* About Event */}
        <View className="mb-8">
          <Text className="text-lg font-bold mb-2 text-[#111827]">
            About Event
          </Text>
          <Text className="text-gray-600 leading-relaxed text-[15px]">
            Join us for an exciting summer pool party! Bring your family and
            friends for an afternoon of fun, games, and refreshments. We'll have
            music, water activities, and BBQ food available.
          </Text>
        </View>

        {/* Organizer */}
        <View className="mb-8">
          <Text className="text-lg font-bold mb-4 text-[#111827]">
            Organizer
          </Text>

          {/* Organizer Card */}
          <View className="bg-gray-50 rounded-2xl p-4 mb-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 rounded-full bg-[#00a693] items-center justify-center">
                  <Text className="text-white font-semibold text-lg">SC</Text>
                </View>
                <View className="ml-3 flex-1">
                  <Text className="font-semibold text-[#111827] text-base">
                    Social Committee
                  </Text>
                  <Text className="text-gray-500 text-sm">Events Team</Text>
                </View>
              </View>

              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={handleCall}
                  className="w-10 h-10 rounded-full bg-[#e0f2f1] items-center justify-center"
                >
                  <Ionicons name="call" size={20} color="#00a693" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleMessage}
                  className="w-10 h-10 rounded-full bg-[#e0f2f1] items-center justify-center"
                >
                  <Ionicons
                    name="chatbubble-ellipses"
                    size={20}
                    color="#00a693"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Location Card */}
          <TouchableOpacity
            onPress={handleViewLocation}
            className="border border-gray-100 rounded-2xl p-4"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 rounded-xl bg-[#e0f2f1] items-center justify-center">
                  <Ionicons name="location" size={20} color="#00a693" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="font-semibold text-[#111827] text-base">
                    Main Compound Track
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    Tap to view location
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View className="h-32" />
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex-row items-center justify-between"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.02,
          shadowRadius: 20,
          elevation: 8,
        }}
      >
        <View>
          <Text className="text-gray-400 text-sm">Registration</Text>
          <Text className="text-[#00a693] text-xl font-bold">Free</Text>
        </View>
        <TouchableOpacity
          onPress={handleJoinNow}
          activeOpacity={0.9}
          className="bg-[#00a693] px-12 py-4 rounded-3xl"
        >
          <Text className="text-white font-bold text-lg">Join Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
