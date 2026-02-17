import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Event } from "../types";

interface EventCardProps {
  event: Event;
  onPress: (id: string) => void;
}

export default function EventCard({ event, onPress }: EventCardProps) {
  const isPast = event.isPast;
  const isFree = event.price === 0;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(event.id)}
      className="mx-4 mb-6 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
    >
      {/* Image */}
      <View className="relative h-48 w-full">
        {event.image ? (
          <Image
            source={event.image}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-gray-200 items-center justify-center">
            <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
          </View>
        )}

        {/* Price Badge */}
        <View className="absolute top-3 right-3 px-3 py-1 bg-[#e0f2f1] rounded-lg">
          <Text className="text-[#00a693] text-sm font-bold">
            {isFree ? "Free" : `$${event.price}`}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="p-5">
        <Text className="text-xl font-bold text-gray-900 leading-tight mb-1">
          {event.title}
        </Text>
        <Text className="text-[#00a693] text-sm font-medium mb-4">
          Hosted by {event.host}
        </Text>

        <Text
          className="text-gray-600 text-sm leading-relaxed mb-4"
          numberOfLines={2}
        >
          {event.description}
        </Text>

        {/* Event Details Grid */}
        <View className="mb-6">
          {/* Row 1 */}
          <View className="flex-row mb-3">
            <View className="flex-1 flex-row items-start">
              <Ionicons name="calendar-outline" size={16} color="#6B7280" />
              <Text className="text-xs text-gray-600 font-medium ml-2 flex-1">
                {event.date}
              </Text>
            </View>
            <View className="flex-1 flex-row items-start">
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text className="text-xs text-gray-600 font-medium ml-2 flex-1">
                {event.time}
              </Text>
            </View>
          </View>

          {/* Row 2 */}
          <View className="flex-row">
            <View className="flex-1 flex-row items-start">
              <Ionicons name="location-outline" size={16} color="#6B7280" />
              <Text
                className="text-xs text-gray-600 font-medium ml-2 flex-1"
                numberOfLines={1}
              >
                {event.location}
              </Text>
            </View>
            <View className="flex-1 flex-row items-start">
              <Ionicons name="people-outline" size={16} color="#6B7280" />
              <Text className="text-xs text-gray-600 font-medium ml-2 flex-1">
                {event.attendeesCount} / {event.maxAttendees} joined
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row items-center">
          <TouchableOpacity
            disabled={isPast}
            activeOpacity={0.8}
            className={`flex-1 py-3.5 rounded-xl items-center justify-center ${
              isPast ? "bg-gray-400" : "bg-[#00a693]"
            }`}
          >
            <Text className="text-white font-bold text-base">
              {isPast ? "Event Ended" : event.isJoined ? "Joined" : "Join"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            className="p-3.5 rounded-xl border border-gray-200 items-center justify-center ml-3"
          >
            <Ionicons name="share-social-outline" size={20} color="#00a693" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
