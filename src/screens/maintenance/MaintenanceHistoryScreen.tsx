import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getMaintenanceRequestsByResident,
  getMaintenanceRequestsByStatus,
  type MaintenanceRequestApiItem,
} from "../../services/maintenance";
import { useAuthStore } from "../../store/authStore";
import type { RootStackParamList } from "../../navigation";
import type { CategoryType, MaintenanceRequest, RequestStatus } from "./types";
import { ActiveRequestCard } from "./components";

type FilterType = "All" | RequestStatus;
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MaintenanceHistory"
>;

function toUiCategory(value: string | null | undefined): CategoryType {
  const normalized = (value || "").trim().toLowerCase();
  if (normalized.includes("plumb")) return "Plumbing";
  if (normalized.includes("elect")) return "Electrical";
  if (normalized.includes("ac") || normalized.includes("heat"))
    return "AC/Heating";
  if (normalized.includes("house")) return "Housekeeping";
  if (normalized.includes("paint")) return "Painting";
  if (normalized.includes("carpen")) return "Carpentry";
  if (normalized.includes("garden")) return "Garden";
  if (normalized.includes("alum")) return "Aluminum";
  return "Other";
}

function toUiStatus(value: string | null | undefined): RequestStatus {
  switch ((value || "").toUpperCase()) {
    case "IN_PROGRESS":
    case "ASSIGNED":
      return "In Progress";
    case "RESOLVED":
    case "COMPLETED":
      return "Completed";
    case "REJECTED":
      return "Rejected";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Pending";
  }
}

function toUiRequest(item: MaintenanceRequestApiItem): MaintenanceRequest {
  const created = item.createdAt ? new Date(item.createdAt) : null;
  return {
    id: item.id,
    title: item.title?.trim() || "Maintenance Request",
    category: toUiCategory(item.category),
    description: item.description?.trim() || "No description provided",
    location: (item.locationLabel ?? item.location ?? "")
      .toUpperCase()
      .includes("NEIGHBOR")
      ? "Neighborhood"
      : "At Home",
    date: created
      ? created.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "-",
    status: toUiStatus(item.status),
    apiStatus: item.status || undefined,
    technician: item.technicianName?.trim() || item.technicianId || undefined,
  };
}

export default function MaintenanceHistoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const userId = useAuthStore((state) => state.user?.id);

  const [selectedFilter, setSelectedFilter] = useState<FilterType>("All");
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filters: FilterType[] = ["All", "In Progress", "Completed"];

  const loadRequests = useCallback(async () => {
    if (!userId) {
      return;
    }

    setIsRefreshing(true);

    try {
      if (selectedFilter === "All") {
        const data = await getMaintenanceRequestsByResident(userId);
        setRequests(data.map(toUiRequest));
      } else {
        const apiStatus =
          selectedFilter === "Completed" ? "RESOLVED" : "IN_PROGRESS";
        const data = await getMaintenanceRequestsByStatus(apiStatus);
        const mine = data.filter((item) => item.residentId === userId);
        setRequests(mine.map(toUiRequest));
      }
    } catch {
      Alert.alert("Error", "Failed to load maintenance history.");
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedFilter, userId]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const filteredRequests = useMemo(() => {
    if (selectedFilter === "All") {
      return requests;
    }
    return requests.filter((req) => req.status === selectedFilter);
  }, [requests, selectedFilter]);

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <View
        className="bg-white px-4 pb-4 border-b border-gray-100"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">History</Text>
          <View className="w-10" />
        </View>
      </View>

      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full ${
                selectedFilter === filter ? "bg-teal-500" : "bg-gray-100"
              }`}
              activeOpacity={0.7}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedFilter === filter ? "text-white" : "text-gray-600"
                }`}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void loadRequests()}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <ActiveRequestCard
              key={request.id}
              request={request}
              onPress={() => Alert.alert(request.title, request.description)}
            />
          ))
        ) : (
          <View className="items-center justify-center py-20">
            <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 text-base mt-4">
              No {selectedFilter.toLowerCase()} requests found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
