import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Share,
  ActivityIndicator,
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
import {
  cancelEventRegistration,
  getEventById,
  registerForEvent,
} from "../../services/events";
import { useAuthStore } from "../../store/authStore";
import { eventDateTimeSummary, mapEventDtoToUi } from "./mappers";
import type { Event } from "./types";

type EventDetailsRouteProp = RouteProp<RootStackParamList, "EventDetails">;

const EVENT_IMAGE = require("../../../assets/build.png");

export default function EventDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<EventDetailsRouteProp>();
  const userId = useAuthStore((state) => state.user?.id);
  const { eventId, isJoined: initialIsJoined = false } = route.params;

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(initialIsJoined);

  const loadEvent = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await getEventById(eventId);
      setEvent(mapEventDtoToUi(data));
    } catch {
      Alert.alert("Error", "Failed to load event details.");
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  }, [eventId, navigation]);

  useEffect(() => {
    void loadEvent();
  }, [loadEvent]);

  const registrationLabel = useMemo(() => {
    if (!event || event.price <= 0) {
      return "Free";
    }

    return `$${event.price}`;
  }, [event]);

  const isFull = useMemo(() => {
    if (!event || typeof event.maxAttendees !== "number") {
      return false;
    }

    return event.maxAttendees > 0 && event.attendeesCount >= event.maxAttendees;
  }, [event]);

  const organizerInitials = useMemo(() => {
    if (!event?.hostName?.trim()) {
      return "EV";
    }

    const parts = event.hostName.trim().split(/\s+/).filter(Boolean);
    return (
      parts
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("") || "EV"
    );
  }, [event]);

  const isOwnEvent = useMemo(() => {
    if (!event || !userId) {
      return false;
    }

    return event.organizerId === userId;
  }, [event, userId]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleShare = async () => {
    if (!event) {
      return;
    }

    try {
      await Share.share({
        title: event.title,
        message: `${event.title}\n${event.dateLabel} • ${event.timeLabel}\n${event.location}`,
      });
    } catch {
      Alert.alert("Error", "Unable to share this event right now.");
    }
  };

  const handleCall = async () => {
    if (!event?.contactPhone) {
      Alert.alert("Unavailable", "Contact phone is not available.");
      return;
    }

    const url = `tel:${event.contactPhone}`;
    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert("Error", "Call action is not supported on this device.");
      return;
    }

    await Linking.openURL(url);
  };

  const handleMessage = () => {
    if (!event?.contactPhone) {
      Alert.alert("Unavailable", "Contact phone is not available.");
      return;
    }

    Alert.alert("Organizer Contact", event.contactPhone);
  };

  const handleViewLocation = async () => {
    if (!event?.location) {
      Alert.alert("Unavailable", "Location details are not available.");
      return;
    }

    const query = encodeURIComponent(event.location);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert("Error", "Unable to open maps.");
      return;
    }

    await Linking.openURL(url);
  };

  const handleJoinNow = async () => {
    if (isSubmitting) {
      return;
    }

    if (isOwnEvent) {
      Alert.alert("Not Allowed", "You cannot join an event you created.");
      return;
    }

    if (event?.isPast) {
      Alert.alert("Unavailable", "This event has already ended.");
      return;
    }

    if (isFull) {
      Alert.alert("Full", "This event reached maximum attendees.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerForEvent(eventId, userId || undefined);
      setIsRegistered(true);
      Alert.alert("Success", "You are registered for this event.");
    } catch {
      Alert.alert("Error", "Failed to register for this event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await cancelEventRegistration(eventId, userId || undefined);
      setIsRegistered(false);
      Alert.alert("Updated", "Your registration was cancelled.");
    } catch {
      Alert.alert("Error", "Failed to cancel registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !event) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#00A693" />
        <Text className="text-gray-500 mt-3">Loading event details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />

      {/* Hero Image Section */}
      <View className="relative h-[340px] w-full">
        <Image
          source={event.imageUrl ? { uri: event.imageUrl } : EVENT_IMAGE}
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
            {event.category || "Community"}
          </Text>
          <Text className="text-[28px] font-bold text-[#050B1B] leading-tight mb-2">
            {event.title}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="information-circle" size={16} color="#00a693" />
            <Text className="text-gray-500 text-sm ml-2">
              {eventDateTimeSummary(event)}
            </Text>
          </View>
        </View>

        {/* About Event */}
        <View className="mb-8">
          <Text className="text-lg font-bold mb-2 text-[#111827]">
            About Event
          </Text>
          <Text className="text-gray-600 leading-relaxed text-[15px]">
            {event.description}
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
                  <Text className="text-white font-semibold text-lg">
                    {organizerInitials}
                  </Text>
                </View>
                <View className="ml-3 flex-1">
                  <Text className="font-semibold text-[#111827] text-base">
                    {event.hostName}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {event.hostRole || "Events Team"}
                  </Text>
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
                    {event.location}
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
          <Text className="text-[#00a693] text-xl font-bold">
            {registrationLabel}
          </Text>
        </View>
        {isOwnEvent ? (
          <TouchableOpacity
            disabled
            activeOpacity={1}
            className="bg-gray-400 px-8 py-4 rounded-3xl"
          >
            <Text className="text-white font-bold text-lg">Your Event</Text>
          </TouchableOpacity>
        ) : isRegistered ? (
          <TouchableOpacity
            onPress={handleCancelRegistration}
            disabled={isSubmitting}
            activeOpacity={0.9}
            className="bg-gray-200 px-8 py-4 rounded-3xl"
          >
            <Text className="text-gray-800 font-bold text-lg">
              {isSubmitting ? "Please wait..." : "Cancel"}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleJoinNow}
            disabled={isSubmitting || isOwnEvent || event.isPast || isFull}
            activeOpacity={0.9}
            className={`px-12 py-4 rounded-3xl ${
              isOwnEvent || event.isPast || isFull
                ? "bg-gray-400"
                : "bg-[#00a693]"
            }`}
          >
            <Text className="text-white font-bold text-lg">
              {isOwnEvent
                ? "Your Event"
                : event.isPast
                  ? "Event Ended"
                  : isFull
                    ? "Full"
                    : isSubmitting
                      ? "Please wait..."
                      : "Join Now"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
