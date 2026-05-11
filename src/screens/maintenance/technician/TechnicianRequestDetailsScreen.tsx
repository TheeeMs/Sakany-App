import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getMaintenanceRequestById,
  type MaintenanceRequestApiItem,
} from "../../../services/maintenance";
import type { RootStackParamList } from "../../../navigation";
import type {
  CategoryType,
  MaintenanceRequest,
  RequestLocation,
  RequestStatus,
} from "../types";
import RequestStatusBadge from "../components/RequestStatusBadge";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface RouteParams {
  requestId: string;
}

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

function formatDateTime(value?: string | null) {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TechnicianRequestDetailsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const params = route.params as RouteParams;

  const [request, setRequest] = useState<MaintenanceRequest | null>(null);
  const [rawRequest, setRawRequest] =
    useState<MaintenanceRequestApiItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadRequest = useCallback(async () => {
    if (!params?.requestId) {
      return;
    }

    setIsLoading(true);

    try {
      const data = await getMaintenanceRequestById(params.requestId);
      setRawRequest(data);
      setRequest(toUiRequest(data));
    } catch {
      Alert.alert("Error", "Failed to load request details.");
    } finally {
      setIsLoading(false);
    }
  }, [params?.requestId]);

  useEffect(() => {
    void loadRequest();
  }, [loadRequest]);

  const resolutionSummary = useMemo(() => {
    if (!rawRequest?.resolutionNotes && !rawRequest?.resolutionCost) {
      return null;
    }

    const parts = [];
    if (rawRequest?.resolutionNotes) {
      parts.push(rawRequest.resolutionNotes);
    }
    if (rawRequest?.resolutionCost != null) {
      parts.push(`Cost: ${rawRequest.resolutionCost} EGP`);
    }
    return parts.join(" | ");
  }, [rawRequest]);

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
          <Text className="text-xl font-bold text-gray-800">Job Details</Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && !request ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator color="#0D9488" />
          </View>
        ) : !request ? (
          <View className="items-center justify-center py-20">
            <Text className="text-gray-500">No details available.</Text>
          </View>
        ) : (
          <>
            <View className="bg-white rounded-[20px] border border-[#E2E8F0] p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-[18px] font-bold text-[#0F172A] flex-1">
                  {request.title}
                </Text>
                <RequestStatusBadge status={request.status} />
              </View>

              <View className="flex-row flex-wrap gap-2 mt-3">
                <View className="bg-[#E0F2FE] px-3 py-1.5 rounded-full">
                  <Text className="text-[12px] text-[#0369A1] font-semibold">
                    {request.category}
                  </Text>
                </View>
                <View className="bg-[#F3F4F6] px-3 py-1.5 rounded-full">
                  <Text className="text-[12px] text-[#6B7280] font-medium">
                    {request.location}
                  </Text>
                </View>
              </View>

              <Text className="text-[14px] text-[#475569] mt-4">
                {request.description}
              </Text>

              <View className="border-t border-[#E2E8F0] mt-4 pt-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[12px] text-[#94A3B8]">Created</Text>
                  <Text className="text-[12px] text-[#0F172A] font-medium">
                    {formatDateTime(rawRequest?.createdAt)}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between mt-2">
                  <Text className="text-[12px] text-[#94A3B8]">Resolved</Text>
                  <Text className="text-[12px] text-[#0F172A] font-medium">
                    {formatDateTime(rawRequest?.resolvedAt)}
                  </Text>
                </View>
              </View>
            </View>

            {resolutionSummary ? (
              <View className="bg-white rounded-[20px] border border-[#E2E8F0] p-4 mt-4">
                <Text className="text-[14px] font-semibold text-[#0F172A]">
                  Resolution
                </Text>
                <Text className="text-[13px] text-[#475569] mt-2">
                  {resolutionSummary}
                </Text>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}
