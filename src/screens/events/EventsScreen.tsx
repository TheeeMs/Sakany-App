import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { Ionicons } from "@expo/vector-icons";
import EventCard from "./components/EventCard";
import type { Event, EventTabType } from "./types";

type EventsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Events"
>;

const EVENT_IMAGE = require("../../../assets/build.png");

const UPCOMING_EVENTS: Event[] = [
  {
    id: "1",
    title: "Community BBQ Party",
    host: "Sakane Community Management",
    description:
      "Join your neighbors for an evening of grilled food, music, and fun. Vegetarian options available!",
    image: EVENT_IMAGE,
    date: "Mon, Dec 10, 2025",
    time: "6:00 PM - 9:00 PM",
    location: "Rooftop Garden, Gate 3",
    attendeesCount: 45,
    maxAttendees: 60,
    price: 0,
    isJoined: true,
    isPast: false,
  },
  {
    id: "2",
    title: "Paid Workshop (Art/Kids)",
    host: "The Creative Corner",
    description:
      "A fun hands-on clay modeling session for kids aged 6-12. All materials are included, and they ge...",
    image: EVENT_IMAGE,
    date: "Sun, Dec 22, 2025",
    time: "4:00 PM - 6:00 PM",
    location: "Community Center, Hall B",
    attendeesCount: 10,
    maxAttendees: 15,
    price: 15,
    isJoined: false,
    isPast: false,
  },
  {
    id: "3",
    title: "Annual Residents' Meeting",
    host: "Sakane Management Board",
    description:
      "Join us to discuss the 2026 maintenance budget, upcoming security upgrades, and new pool rules....",
    image: EVENT_IMAGE,
    date: "Fri, Jan 10, 2026",
    time: "7:30 PM - 9:00 PM",
    location: "Main Conference Room, Building A",
    attendeesCount: 85,
    maxAttendees: 120,
    price: 0,
    isJoined: false,
    isPast: false,
  },
];

const PAST_EVENTS: Event[] = [
  {
    id: "4",
    title: "Annual Charity 5K Run",
    host: "Sakane Fitness Club",
    description:
      "A fantastic turnout! Thanks to everyone who participated. Together we ran for a cause and rais...",
    image: EVENT_IMAGE,
    date: "Sat, Nov 05, 2025",
    time: "8:00 AM - 11:00 AM",
    location: "Main Compound Track",
    attendeesCount: 110,
    maxAttendees: 110,
    price: 0,
    isJoined: true,
    isPast: true,
  },
  {
    id: "5",
    title: "Sakane Winter Bazaar",
    host: "Sakane Residents' Committee",
    description:
      "Our biggest market yet! Residents showcased amazing handmade crafts, baked goods, and art....",
    image: EVENT_IMAGE,
    date: "Fri, Dec 15, 2025",
    time: "2:00 PM - 9:00 PM",
    location: "Central Park Promenade",
    attendeesCount: 200,
    maxAttendees: 250,
    price: 0,
    isJoined: true,
    isPast: true,
  },
];

export default function EventsScreen() {
  const navigation = useNavigation<EventsScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<EventTabType>("upcoming");

  const currentEvents =
    activeTab === "upcoming" ? UPCOMING_EVENTS : PAST_EVENTS;

  const handleEventPress = (id: string) => {
    navigation.navigate("EventDetails", { eventId: id });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleCreateEvent = () => {
    navigation.navigate("CreateEvent");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white">
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center"
          onPress={handleGoBack}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">
          Community Events
        </Text>
        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <Ionicons name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="px-4 py-3 bg-white">
        <View className="flex-row bg-gray-50 p-1 rounded-full border border-gray-100">
          <TouchableOpacity
            onPress={() => setActiveTab("upcoming")}
            className={`flex-1 py-3 px-6 rounded-full ${
              activeTab === "upcoming" ? "bg-[#e0f2f1]" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                activeTab === "upcoming" ? "text-[#00a693]" : "text-gray-500"
              }`}
            >
              Upcoming
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("past")}
            className={`flex-1 py-3 px-6 rounded-full ${
              activeTab === "past" ? "bg-[#e0f2f1]" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                activeTab === "past" ? "text-[#00a693]" : "text-gray-500"
              }`}
            >
              Past Events
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Explore Section */}
      <View className="px-4 py-4 flex-row items-center justify-between bg-white">
        <Text className="text-base font-bold text-gray-900">
          Explore Events
        </Text>
        <TouchableOpacity className="flex-row items-center px-3 py-1.5 rounded-lg border border-gray-200">
          <Ionicons name="funnel-outline" size={16} color="#6B7280" />
          <Text className="text-sm font-medium text-gray-600 ml-1.5">
            Filter
          </Text>
        </TouchableOpacity>
      </View>

      {/* Events List */}
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
      >
        {currentEvents.length > 0 ? (
          currentEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={handleEventPress}
            />
          ))
        ) : (
          <View className="px-4 py-12 items-center">
            <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 text-center mt-4">
              No {activeTab} events
            </Text>
          </View>
        )}
        <View className="h-24" />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={handleCreateEvent}
        activeOpacity={0.9}
        className="absolute bottom-6 right-6 w-14 h-14 bg-[#00a693] rounded-full items-center justify-center"
        style={{
          shadowColor: "#00a693",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
