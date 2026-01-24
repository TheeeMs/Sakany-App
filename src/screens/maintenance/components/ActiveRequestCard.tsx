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
      className="bg-white rounded-2xl p-4 mb-3 border border-gray-100"
      activeOpacity={0.7}
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-800 mb-1">
            {request.title}
          </Text>
          <View className="flex-row items-center gap-2 mb-2">
            <View className="bg-blue-50 px-2 py-1 rounded-md">
              <Text className="text-xs text-blue-600 font-medium">
                {request.category}
              </Text>
            </View>
            <View className="bg-purple-50 px-2 py-1 rounded-md">
              <Text className="text-xs text-purple-600 font-medium">
                {request.location}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity className="ml-2">
          <Ionicons name="ellipsis-vertical" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <Text className="text-sm text-gray-600 mb-3">{request.description}</Text>

      <View className="flex-row items-center justify-between">
        <View>
          <RequestStatusBadge status={request.status} />
        </View>
        {request.technician && (
          <Text className="text-xs text-gray-500">
            Tech: {request.technician}
          </Text>
        )}
      </View>

      <Text className="text-xs text-gray-400 mt-2">{request.date}</Text>
    </TouchableOpacity>
  );
}
