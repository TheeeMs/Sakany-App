import React from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PaymentSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  amount: number;
  transactionId: string;
  date: string;
}

export default function PaymentSuccessModal({
  visible,
  onClose,
  amount,
  transactionId,
  date,
}: PaymentSuccessModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 justify-center items-center bg-black/50 px-6">
        <Pressable
          className="bg-white rounded-3xl p-8 w-full max-w-md"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Success Icon */}
          <View className="items-center mb-6">
            <View className="w-24 h-24 bg-teal-100 rounded-full items-center justify-center">
              <Ionicons name="checkmark" size={48} color="#14B8A6" />
            </View>
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
            Payment Successful!
          </Text>

          {/* Description */}
          <Text className="text-base text-gray-600 text-center mb-8">
            Your payment of ${amount.toFixed(2)} has been processed
            successfully.
          </Text>

          {/* Transaction Details */}
          <View className="bg-gray-50 rounded-2xl p-5 mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-sm text-gray-600">Transaction ID</Text>
              <Text className="text-sm font-bold text-gray-900">
                {transactionId}
              </Text>
            </View>

            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-sm text-gray-600">Date</Text>
              <Text className="text-sm font-bold text-gray-900">{date}</Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600">Amount</Text>
              <Text className="text-base font-bold text-teal-600">
                ${amount.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Done Button */}
          <TouchableOpacity
            onPress={onClose}
            className="bg-teal-500 py-4 rounded-2xl items-center mb-4"
          >
            <Text className="text-white text-lg font-bold">Done</Text>
          </TouchableOpacity>

          {/* Download Receipt */}
          <TouchableOpacity
            onPress={() => {
              console.log("Download receipt");
            }}
            className="items-center py-2"
          >
            <Text className="text-teal-500 text-base font-semibold">
              Download Receipt
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
