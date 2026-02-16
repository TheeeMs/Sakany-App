import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Payment } from "../types";

interface PendingPaymentCardProps {
  payment: Payment;
  onPress: () => void;
}

export default function PendingPaymentCard({
  payment,
  onPress,
}: PendingPaymentCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-3 flex-row items-center"
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View className="w-12 h-12 bg-orange-100 rounded-xl items-center justify-center mr-3">
        <Ionicons name="calendar-outline" size={24} color="#F97316" />
      </View>

      {/* Content */}
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-800 mb-1">
          {payment.title}
        </Text>
        <Text className="text-sm text-gray-500 mb-1">
          {payment.description}
        </Text>
        <Text className="text-xs text-red-500">⏰ Due: {payment.dueDate}</Text>
      </View>

      {/* Amount */}
      <Text className="text-lg font-bold text-gray-900">
        ${payment.amount.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
}
