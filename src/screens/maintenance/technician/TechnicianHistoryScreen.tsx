import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getMaintenanceRequestsByStatus,
  type MaintenanceRequestApiItem,
} from "../../../services/maintenance";
import { useAuthStore } from "../../../store/authStore";
import type { RootStackParamList } from "../../../navigation";
import type {
  CategoryType,
  MaintenanceRequest,
  RequestLocation,
  RequestStatus,
} from "../types";
import { ActiveRequestCard } from "../components";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type FilterType = "All" | RequestStatus;

type HistoryStatus = "RESOLVED" | "REJECTED" | "CANCELLED";

function toUiLocation(value: string | null | undefined): RequestLocation {
  const normalized = (value || "").toUpperCase();
  if (normalized.includes("NEIGHBOR")) {
    return "Neighborhood";
  }
  return "At Home";
}

function toUiStatus(value: string | null | undefined): RequestStatus {
  switch ((value || "").toUpperCase()) {
    case "IN_PROGRESS":
    case "ASSIGNED":
    case "STARTED":
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

function toUiRequest(item: MaintenanceRequestApiItem): MaintenanceRequest {
  const created = item.createdAt ? new Date(item.createdAt) : null;

  return {
    id: item.id,
    title: item.title?.trim() || "Maintenance Request",
    category: toUiCategory(item.category),
    description: item.description?.trim() || "No description provided",
    location: toUiLocation(item.locationLabel ?? item.location),
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

export default function TechnicianHistoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const userId = useAuthStore((state) => state.user?.id);

  const [selectedFilter, setSelectedFilter] = useState<FilterType>("All");
  const [rawRequests, setRawRequests] = useState<MaintenanceRequestApiItem[]>(
    [],
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filters: FilterType[] = ["All", "Completed", "Rejected", "Cancelled"];

  const loadRequests = useCallback(async () => {
    if (!userId) {
      return;
    }

    setIsRefreshing(true);

    try {
      if (selectedFilter === "All") {
        const statuses: HistoryStatus[] = ["RESOLVED", "REJECTED", "CANCELLED"];
        const responses = await Promise.all(
          statuses.map((status) => getMaintenanceRequestsByStatus(status)),
        );
        const merged = responses.flat();
        const mine = merged.filter((item) => item.technicianId === userId);
        setRawRequests(mine);
      } else {
        const apiStatus =
          selectedFilter === "Completed"
            ? "RESOLVED"
            : selectedFilter === "Rejected"
              ? "REJECTED"
              : "CANCELLED";
        const data = await getMaintenanceRequestsByStatus(apiStatus);
        const mine = data.filter((item) => item.technicianId === userId);
        setRawRequests(mine);
      }
    } catch {
      Alert.alert("Error", "Failed to load technician history.");
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedFilter, userId]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const requests = useMemo(() => rawRequests.map(toUiRequest), [rawRequests]);

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <View
        className="bg-white px-4 pb-4 border-b border-gray-100"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center justify-between">
          <View className="w-10" />
          <Text className="text-xl font-bold text-gray-800">Job History</Text>
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
        {requests.length > 0 ? (
          requests.map((request) => (
            <ActiveRequestCard
              key={request.id}
              request={request}
              onPress={() =>
                navigation.navigate("TechnicianRequestDetails", {
                  requestId: request.id,
                })
              }
            />
          ))
        ) : (
          <View className="items-center justify-center py-20">
            <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 text-base mt-4">
              No {selectedFilter.toLowerCase()} jobs found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
