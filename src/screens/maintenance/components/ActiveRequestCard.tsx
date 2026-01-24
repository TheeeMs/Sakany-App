import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { MaintenanceRequest } from "../types";
import RequestStatusBadge from "./RequestStatusBadge";

interface ActiveRequestCardProps {
  request: MaintenanceRequest;
  onPress: () => void;
}

export default function ActiveRequestCard({
  request,
  onPress,
}: ActiveRequestCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-5 mb-3 shadow-sm"
      activeOpacity={0.7}
    >
      {/* Top Row: Location Badge, Category Badge, and Clock Icon */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <View className="bg-purple-100 px-3 py-1.5 rounded-full">
            <Text className="text-xs text-purple-600 font-semibold">
              {request.location}
            </Text>
          </View>
          <View className="bg-gray-100 px-3 py-1.5 rounded-full">
            <Text className="text-xs text-gray-600 font-medium">
              {request.category}
            </Text>
          </View>
        </View>
        <Ionicons name="time-outline" size={24} color="#3B82F6" />
      </View>

      {/* Title */}
      <Text className="text-lg font-bold text-gray-900 mb-2">
        {request.title}
      </Text>

      {/* Date */}
      <Text className="text-sm text-gray-500 mb-4">{request.date}</Text>

      {/* Bottom Row: Status and Technician */}
      <View className="flex-row items-center justify-between">
        <RequestStatusBadge status={request.status} />
        {request.technician && (
          <Text className="text-sm text-gray-600">
            Tech: {request.technician}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
