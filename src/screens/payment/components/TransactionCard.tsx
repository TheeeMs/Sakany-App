import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Transaction } from "../types";

interface TransactionCardProps {
  transaction: Transaction;
  onPress: () => void;
}

export default function TransactionCard({
  transaction,
  onPress,
}: TransactionCardProps) {
  const isPositive = transaction.amount > 0;
  const iconBg = isPositive ? "bg-green-100" : "bg-orange-100";
  const iconColor = isPositive ? "#10B981" : "#F97316";
  const amountColor = isPositive ? "text-green-600" : "text-gray-900";

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-3 flex-row items-center"
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View
        className={`w-12 h-12 ${iconBg} rounded-xl items-center justify-center mr-3`}
      >
        <Ionicons
          name={isPositive ? "checkmark-circle" : "calendar-outline"}
          size={24}
          color={iconColor}
        />
      </View>

      {/* Content */}
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-800 mb-1">
          {transaction.title}
        </Text>
        <Text className="text-sm text-gray-500 mb-1">
          {transaction.description}
        </Text>
        <Text className="text-xs text-gray-400">📅 {transaction.date}</Text>
      </View>

      {/* Amount and Status */}
      <View className="items-end">
        <Text className={`text-lg font-bold ${amountColor}`}>
          {isPositive ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
        </Text>
        {transaction.status === "Paid" && (
          <View className="bg-green-100 px-2 py-1 rounded-full mt-1">
            <Text className="text-xs text-green-600 font-semibold">Paid</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
