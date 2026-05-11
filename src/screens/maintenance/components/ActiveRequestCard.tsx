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
      className="bg-white rounded-[16px] px-4 py-4 mb-3 border border-[#EEF2F7]"
      activeOpacity={0.7}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-center gap-2 flex-1 pr-3">
          <View className="bg-[#EDE9FE] px-3 py-1.5 rounded-full">
            <Text className="text-[12px] text-[#7C3AED] font-semibold">
              {request.location}
            </Text>
          </View>
          <View className="bg-[#F3F4F6] px-3 py-1.5 rounded-full">
            <Text className="text-[12px] text-[#6B7280] font-medium">
              {request.category}
            </Text>
          </View>
        </View>
        <Ionicons name="time-outline" size={20} color="#3B82F6" />
      </View>

      <Text className="text-[18px] font-bold text-[#111827] leading-5 mb-2">
        {request.title}
      </Text>

      <Text className="text-[13px] text-[#6B7280] mb-3">{request.date}</Text>

      <View className="flex-row items-center justify-between">
        <RequestStatusBadge status={request.status} />
      </View>
    </TouchableOpacity>
  );
}
