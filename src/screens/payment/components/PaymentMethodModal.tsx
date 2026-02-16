import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PaymentCard {
  id: string;
  name: string;
  last4: string;
  icon: string;
  bgColor: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  bgColor: string;
  iconColor: string;
}

interface PaymentMethodModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (methodId: string) => void;
  selectedMethod: string;
  amount: number;
  savedCards: PaymentCard[];
  otherMethods: PaymentMethod[];
}

export default function PaymentMethodModal({
  visible,
  onClose,
  onSelect,
  selectedMethod,
  amount,
  savedCards,
  otherMethods,
}: PaymentMethodModalProps) {
  const insets = useSafeAreaInsets();

  const handleSelect = (methodId: string) => {
    onSelect(methodId);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
        <Pressable
          className="bg-white rounded-t-3xl"
          style={{ paddingBottom: insets.bottom + 20 }}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Handle Bar */}
          <View className="items-center py-3">
            <View className="w-10 h-1 bg-gray-300 rounded-full" />
          </View>

          <ScrollView
            className="max-h-[80vh]"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="px-6 pb-4">
              <Text className="text-xl font-bold text-gray-900">
                Select Payment Method
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                Amount: ${amount.toFixed(2)}
              </Text>
            </View>

            {/* Saved Cards */}
            <View className="px-6 mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                Saved Cards
              </Text>
              <View className="gap-2">
                {savedCards.map((card) => (
                  <TouchableOpacity
                    key={card.id}
                    onPress={() => handleSelect(card.id)}
                    className="bg-gray-50 rounded-2xl p-4 flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center flex-1">
                      <View
                        className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
                        style={{ backgroundColor: card.bgColor }}
                      >
                        <Ionicons name="card" size={20} color="#FFFFFF" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-bold text-gray-900">
                          {card.name}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          •••• {card.last4}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-2">
                      {card.isDefault && (
                        <View className="bg-teal-100 px-3 py-1 rounded-full">
                          <Text className="text-xs font-semibold text-teal-600">
                            Default
                          </Text>
                        </View>
                      )}
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#9CA3AF"
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Add New Card */}
            <View className="px-6 mb-4">
              <TouchableOpacity className="border-2 border-dashed border-gray-300 rounded-2xl p-4 flex-row items-center">
                <View className="w-12 h-12 bg-blue-100 rounded-2xl items-center justify-center mr-3">
                  <Ionicons name="add" size={24} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-gray-900">
                    Add New Card
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Visa, Mastercard, etc.
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Other Methods */}
            <View className="px-6 mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                Other Methods
              </Text>
              <View className="gap-2">
                {otherMethods.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    onPress={() => handleSelect(method.id)}
                    className="bg-gray-50 rounded-2xl p-4 flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center flex-1">
                      <View
                        className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
                        style={{ backgroundColor: method.bgColor }}
                      >
                        <Ionicons
                          name={method.icon as any}
                          size={20}
                          color={method.iconColor}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-bold text-gray-900">
                          {method.name}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          {method.description}
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Cancel Button */}
            <View className="px-6 pt-2">
              <TouchableOpacity
                onPress={onClose}
                className="bg-gray-200 py-4 rounded-2xl items-center"
              >
                <Text className="text-gray-900 text-base font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
