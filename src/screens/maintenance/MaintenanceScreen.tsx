import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  type AlertButton,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import {
  cancelMaintenanceRequest,
  getMaintenanceRequestById,
  getMaintenanceRequestsByResident,
  rejectMaintenanceRequest,
  resolveMaintenanceRequest,
  startMaintenanceRequest,
  type MaintenanceRequestApiItem,
} from "../../services/maintenance";
import { useAuthStore } from "../../store/authStore";
import type { RootStackParamList } from "../../navigation";
import type {
  CategoryType,
  MaintenanceRequest,
  RequestLocation,
  RequestStatus,
} from "./types";
import { ActiveRequestCard } from "./components";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Main">;

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

export default function MaintenanceScreen() {
  const navigation = useNavigation<NavigationProp>();
  const userId = useAuthStore((state) => state.user?.id);

  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
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
        const data = await getMaintenanceRequestsByResident(userId);
        setRequests(data.map(toUiRequest));
      } catch {
        Alert.alert("Error", "Failed to load maintenance requests.");
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

  const activeRequests = useMemo(
    () =>
      requests.filter(
        (request) =>
          request.status === "Pending" || request.status === "In Progress",
      ),
    [requests],
  );

  const executeActionAndReload = async (
    action: () => Promise<unknown>,
    successMessage: string,
  ) => {
    try {
      await action();
      Alert.alert("Done", successMessage);
      await loadRequests();
    } catch {
      Alert.alert("Error", "Action failed. Please try again.");
    }
  };

  const handleRequestPress = async (request: MaintenanceRequest) => {
    try {
      const details = await getMaintenanceRequestById(request.id);
      const normalizedStatus = toUiStatus(details.status);

      const actions: AlertButton[] = [
        { text: "Close", style: "cancel" as const },
      ];

      if (normalizedStatus === "Pending") {
        actions.push({
          text: "Start",
          onPress: () =>
            void executeActionAndReload(
              () => startMaintenanceRequest(request.id),
              "Request moved to in progress.",
            ),
        });
        actions.push({
          text: "Reject",
          onPress: () =>
            void executeActionAndReload(
              () => rejectMaintenanceRequest(request.id),
              "Request rejected.",
            ),
        });
      }

      if (normalizedStatus === "In Progress") {
        actions.push({
          text: "Resolve",
          onPress: () =>
            void executeActionAndReload(
              () => resolveMaintenanceRequest(request.id),
              "Request resolved.",
            ),
        });
      }

      if (
        normalizedStatus === "Pending" ||
        normalizedStatus === "In Progress"
      ) {
        actions.push({
          text: "Cancel",
          onPress: () =>
            void executeActionAndReload(
              () => cancelMaintenanceRequest(request.id),
              "Request cancelled.",
            ),
        });
      }

      Alert.alert(
        request.title,
        `Status: ${normalizedStatus}\nCategory: ${request.category}`,
        actions,
      );
    } catch {
      Alert.alert("Error", "Failed to load request details.");
    }
  };

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Maintenance</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("MaintenanceHistory")}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="time-outline" size={24} color="#0D9488" />
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
        <TouchableOpacity
          onPress={() => navigation.navigate("RequestDetails")}
          activeOpacity={0.85}
          className="mx-4 mt-[15px] h-[127px] bg-[#DFF5F3] rounded-[20px] px-5 py-[16px] border border-[#BCE9E5] overflow-hidden"
        >
          <View className="absolute -right-8 -top-6 w-[130px] h-[130px] rounded-full bg-[#CFF1EC]" />
          <View className="absolute -right-16 top-12 w-[140px] h-[140px] rounded-full bg-[#C6EBE5]" />
          <View className="flex-row items-center justify-between h-full">
            <View className="w-[90px] h-[95px] rounded-[14px] bg-[#00A996] items-center justify-center shadow-sm">
              <Ionicons name="add" size={42} color="#FFFFFF" />
            </View>
            <View className="w-[203px]">
              <Text className="text-[#0F172A] text-[20px] font-bold leading-6">
                Create a new request
              </Text>
              <Text className="text-[#64748B] text-[14px] leading-5 mt-2">
                Tap here to start a new maintenance request.
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View className="px-4 mt-[22px]">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[20px] font-bold text-[#111827]">
              Active Maintenance
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("MaintenanceHistory")}
              className="flex-row items-center"
              activeOpacity={0.8}
            >
              <Text className="text-[14px] font-semibold text-[#0D9488] mr-1">
                View all
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#0D9488" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <Text className="text-center text-gray-500 py-8">Loading...</Text>
          ) : activeRequests.length === 0 ? (
            <Text className="text-center text-gray-500 py-8">
              No active maintenance requests.
            </Text>
          ) : (
            activeRequests.map((request) => (
              <ActiveRequestCard
                key={request.id}
                request={request}
                onPress={() => void handleRequestPress(request)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
