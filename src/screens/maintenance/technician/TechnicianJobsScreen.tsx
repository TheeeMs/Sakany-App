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

type ActiveStatus = "ASSIGNED" | "IN_PROGRESS";

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

export default function TechnicianJobsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const userId = useAuthStore((state) => state.user?.id);

  const [rawRequests, setRawRequests] = useState<MaintenanceRequestApiItem[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadRequests = useCallback(
    async (refresh = false) => {
      if (!userId) {
        return;
      }

      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const statuses: ActiveStatus[] = ["ASSIGNED", "IN_PROGRESS"];
        const responses = await Promise.all(
          statuses.map((status) => getMaintenanceRequestsByStatus(status)),
        );
        const merged = responses.flat();
        const mine = merged.filter((item) => item.technicianId === userId);
        setRawRequests(mine);
      } catch {
        Alert.alert("Error", "Failed to load technician requests.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const requests = useMemo(() => rawRequests.map(toUiRequest), [rawRequests]);

  const assignedCount = rawRequests.filter(
    (request) => request.status === "ASSIGNED",
  ).length;
  const inProgressCount = rawRequests.filter(
    (request) => request.status === "IN_PROGRESS",
  ).length;

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <View
        className="bg-white px-4 pb-4 border-b border-gray-100"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center justify-between">
          <View className="w-10" />
          <Text className="text-xl font-bold text-gray-800">
            Technician Jobs
          </Text>
          <TouchableOpacity
            onPress={() => void loadRequests(true)}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="refresh" size={20} color="#0D9488" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void loadRequests(true)}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="px-4 pt-5">
          <View className="bg-white rounded-[20px] border border-[#E2E8F0] p-4">
            <Text className="text-[16px] font-semibold text-[#0F172A]">
              Today Overview
            </Text>
            <View className="flex-row gap-3 mt-4">
              <View className="flex-1 bg-[#E0F2FE] rounded-[16px] px-4 py-3">
                <Text className="text-[12px] font-medium text-[#0369A1]">
                  Assigned
                </Text>
                <Text className="text-[22px] font-bold text-[#0F172A] mt-1">
                  {assignedCount}
                </Text>
              </View>
              <View className="flex-1 bg-[#DCFCE7] rounded-[16px] px-4 py-3">
                <Text className="text-[12px] font-medium text-[#15803D]">
                  In Progress
                </Text>
                <Text className="text-[22px] font-bold text-[#0F172A] mt-1">
                  {inProgressCount}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-4 mt-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[20px] font-bold text-[#111827]">
              Active Jobs
            </Text>
          </View>

          {isLoading ? (
            <Text className="text-center text-gray-500 py-8">Loading...</Text>
          ) : requests.length === 0 ? (
            <Text className="text-center text-gray-500 py-8">
              No assigned jobs yet.
            </Text>
          ) : (
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
          )}
        </View>
      </ScrollView>
    </View>
  );
}
