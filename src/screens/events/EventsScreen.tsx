import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import EventCard from "./components/EventCard";
import type { Event, EventTabType } from "./types";
import { mapEventDtoToUi } from "./mappers";
import { getEvents, registerForEvent } from "../../services/events";
import { useAuthStore } from "../../store/authStore";

type EventsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Events"
>;

export default function EventsScreen() {
  const navigation = useNavigation<EventsScreenNavigationProp>();
  const userId = useAuthStore((state) => state.user?.id);

  const [activeTab, setActiveTab] = useState<EventTabType>("upcoming");
  const [events, setEvents] = useState<Event[]>([]);
  const [joinedIds, setJoinedIds] = useState<Record<string, boolean>>({});
  const [joiningEventId, setJoiningEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);

  const categoryOptions = useMemo(() => {
    const unique = new Set<string>();
    events.forEach((event) => {
      const normalized = (event.category || "").trim();
      if (normalized) {
        unique.add(normalized);
      }
    });

    return ["All", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [events]);

  const loadEvents = useCallback(
    async (refresh = false) => {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        // Backend creates new events with PROPOSED status; include user's own items.
        const data = await getEvents();
        const mapped = data.map(mapEventDtoToUi);
        const visibleEvents = mapped.filter((event) => {
          const normalizedStatus = (event.status || "").toUpperCase();
          if (
            normalizedStatus === "APPROVED" ||
            normalizedStatus === "COMPLETED"
          ) {
            return true;
          }

          return Boolean(userId) && event.organizerId === userId;
        });

        setEvents(visibleEvents);
      } catch {
        Alert.alert("Error", "Failed to load events.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  useFocusEffect(
    useCallback(() => {
      void loadEvents(true);
    }, [loadEvents]),
  );

  const currentEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filteredByTab =
      activeTab === "upcoming"
        ? events.filter((event) => !event.isPast)
        : events.filter((event) => event.isPast);

    const filteredByCategory =
      selectedCategory === "All"
        ? filteredByTab
        : filteredByTab.filter(
            (event) =>
              (event.category || "").toUpperCase() ===
              selectedCategory.toUpperCase(),
          );

    const filtered =
      query.length === 0
        ? filteredByCategory
        : filteredByCategory.filter((event) => {
            const searchable = [
              event.title,
              event.description,
              event.location,
              event.hostName,
              event.category || "",
            ]
              .join(" ")
              .toLowerCase();

            return searchable.includes(query);
          });

    return filtered.sort((a, b) => {
      const first = new Date(a.startDate).getTime();
      const second = new Date(b.startDate).getTime();

      if (Number.isNaN(first) || Number.isNaN(second)) {
        return 0;
      }

      return activeTab === "upcoming" ? first - second : second - first;
    });
  }, [activeTab, events, searchQuery, selectedCategory]);

  const handleEventPress = (id: string) => {
    navigation.navigate("EventDetails", {
      eventId: id,
      isJoined: Boolean(joinedIds[id]),
    });
  };

  const handleJoin = async (id: string) => {
    if (joiningEventId) {
      return;
    }

    const targetEvent = events.find((item) => item.id === id);
    if (targetEvent && userId && targetEvent.organizerId === userId) {
      Alert.alert("Not Allowed", "You cannot join an event you created.");
      return;
    }

    setJoiningEventId(id);

    try {
      await registerForEvent(id, userId || undefined);
      setJoinedIds((prev) => ({ ...prev, [id]: true }));
      Alert.alert("Success", "You are registered for this event.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          typeof error.response?.data === "object" &&
          error.response?.data !== null &&
          "message" in error.response.data &&
          typeof error.response.data.message === "string"
            ? error.response.data.message
            : "";

        if (message.toLowerCase().includes("already registered")) {
          setJoinedIds((prev) => ({ ...prev, [id]: true }));
          Alert.alert("Already Joined", "You are already registered.");
          return;
        }
      }

      Alert.alert("Error", "Failed to register for this event.");
    } finally {
      setJoiningEventId(null);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleCreateEvent = () => {
    navigation.navigate("CreateEvent");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFC]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white">
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center"
          onPress={handleGoBack}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        {isSearchOpen ? (
          <View className="flex-1 h-11 mx-2 px-3 bg-[#F8FAFC] border border-gray-200 rounded-xl flex-row items-center">
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-2 text-[14px] text-gray-900"
              placeholder="Search events..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.trim().length > 0 ? (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          <Text className="text-lg font-bold text-gray-900">
            Community Events
          </Text>
        )}

        <TouchableOpacity
          className="w-10 h-10 items-center justify-center"
          onPress={() => {
            if (isSearchOpen) {
              setSearchQuery("");
            }
            setIsSearchOpen((prev) => !prev);
          }}
        >
          <Ionicons
            name={isSearchOpen ? "close" : "search"}
            size={22}
            color="#000"
          />
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
      <View className="px-4 py-4 bg-white">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-bold text-gray-900">
            Explore Events
          </Text>
          <TouchableOpacity
            onPress={() => setIsCategoryFilterOpen((prev) => !prev)}
            className="flex-row items-center px-3 py-1.5 rounded-lg border border-gray-200"
          >
            <Ionicons name="funnel-outline" size={16} color="#6B7280" />
            <Text className="text-sm font-medium text-gray-600 ml-1.5">
              {selectedCategory === "All" ? "Category" : selectedCategory}
            </Text>
          </TouchableOpacity>
        </View>

        {isCategoryFilterOpen ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3"
            contentContainerStyle={{ paddingRight: 4 }}
          >
            {categoryOptions.map((category) => {
              const isSelected = selectedCategory === category;

              return (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  className={`mr-2 px-3 py-2 rounded-full border ${
                    isSelected
                      ? "bg-[#E7F7F7] border-[#00A693]"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Text
                    className={`text-xs ${
                      isSelected
                        ? "text-[#00A693] font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : null}
      </View>

      {/* Events List */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void loadEvents(true)}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View className="px-4 py-12 items-center">
            <Text className="text-gray-500">Loading events...</Text>
          </View>
        ) : currentEvents.length > 0 ? (
          currentEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isOwnEvent={Boolean(userId && event.organizerId === userId)}
              isJoined={Boolean(joinedIds[event.id])}
              isJoinLoading={joiningEventId === event.id}
              onPress={handleEventPress}
              onJoin={handleJoin}
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
