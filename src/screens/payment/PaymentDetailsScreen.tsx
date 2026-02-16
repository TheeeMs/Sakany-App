import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import type { Payment } from "./types";
import { PaymentMethodModal, PaymentSuccessModal } from "./components";

type PaymentDetailsRouteProp = RouteProp<
  { PaymentDetails: { payment: Payment } },
  "PaymentDetails"
>;

export default function PaymentDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<PaymentDetailsRouteProp>();
  const insets = useSafeAreaInsets();
  const { payment } = route.params;

  const [selectedMethod, setSelectedMethod] = useState("visa-4265");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  // Saved payment methods
  const savedCards = [
    {
      id: "visa-4265",
      name: "Visa Debit",
      last4: "4265",
      icon: "card",
      bgColor: "#2D3748",
      isDefault: true,
    },
    {
      id: "mastercard-8352",
      name: "Mastercard Debit",
      last4: "8352",
      icon: "card",
      bgColor: "#14B8A6",
      isDefault: false,
    },
    {
      id: "visa-9124",
      name: "Visa Debit",
      last4: "9124",
      icon: "card",
      bgColor: "#D1D5DB",
      isDefault: false,
    },
  ];

  const otherMethods = [
    {
      id: "bank-transfer",
      name: "Bank Transfer",
      description: "Direct bank payment",
      icon: "business",
      bgColor: "#E9D5FF",
      iconColor: "#9333EA",
    },
  ];

  // Example: Multiple payments to confirm together
  const paymentsToConfirm = [
    {
      id: "1",
      title: "Monthly Fee",
      description: "Compound management fee for January 2026",
      amount: 450.0,
      dueDate: "Jan 31, 2026",
    },
    {
      id: "2",
      title: "Maintenance Charge",
      description: "AC repair - Unit 205",
      amount: 120.0,
      dueDate: "Jan 28, 2026",
    },
  ];

  const subtotal = paymentsToConfirm.reduce((sum, p) => sum + p.amount, 0);
  const processingFee = 0.0;
  const total = subtotal + processingFee;

  const handleConfirmPayment = () => {
    // Generate transaction ID and date
    const txnId = `#TXN${Math.floor(Math.random() * 1000000)}`;
    const now = new Date();
    const txnDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    setTransactionId(txnId);
    setTransactionDate(txnDate);
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  const selectedCard = savedCards.find((card) => card.id === selectedMethod);
  const selectedOtherMethod = otherMethods.find(
    (method) => method.id === selectedMethod,
  );
  const displayMethod = selectedCard || selectedOtherMethod;

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        className="bg-teal-500 pb-6 px-4"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Confirm Payment</Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Total Amount Card */}
        <View className="px-4 mb-6 mt-6 ">
          <LinearGradient
            colors={["#14B8A6", "#0D9488"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 24 }}
            className="py-6 px-8 items-center"
          >
            <Text className="text-white text-sm font-medium mb-1 opacity-90">
              Total Amount
            </Text>
            <View className="flex-row items-baseline gap-0.5">
              <Text className="text-white text-6xl font-bold tracking-tight">
                {total.toFixed(2)}
              </Text>
              <Text className="text-white text-4xl font-bold">$</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Payment Method */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Payment Method
          </Text>
          <View className="bg-gray-50 rounded-2xl p-4 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View
                className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                style={{ backgroundColor: displayMethod?.bgColor }}
              >
                <Ionicons
                  name={(displayMethod?.icon || "card") as any}
                  size={24}
                  color={
                    selectedOtherMethod
                      ? selectedOtherMethod.iconColor
                      : "#FFFFFF"
                  }
                />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-gray-900">
                  {displayMethod?.name}
                </Text>
                <Text className="text-sm text-gray-500">
                  {selectedCard
                    ? `•••• ${selectedCard.last4}`
                    : selectedOtherMethod?.description}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setShowPaymentModal(true)}>
              <Text className="text-base font-semibold text-teal-500">
                Change
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Details */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Payment Details
          </Text>
          <View className="gap-4">
            {paymentsToConfirm.map((item) => (
              <View
                key={item.id}
                className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
              >
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-base font-bold text-gray-900 flex-1">
                    {item.title}
                  </Text>
                  <Text className="text-lg font-bold text-gray-900">
                    ${item.amount.toFixed(2)}
                  </Text>
                </View>
                <Text className="text-sm text-gray-500 mb-2">
                  {item.description}
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={14} color="#6B7280" />
                  <Text className="text-xs text-gray-500 ml-1">
                    Due {item.dueDate}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Summary Totals */}
        <View className="px-4 mb-6">
          <View className="bg-teal-50 rounded-3xl p-5 border border-teal-100">
            <View className="flex-row justify-between mb-3">
              <Text className="text-base text-gray-700">Subtotal</Text>
              <Text className="text-base font-semibold text-gray-900">
                ${subtotal.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between mb-4 pb-4 border-b border-teal-200">
              <Text className="text-base text-gray-700">Processing Fee</Text>
              <Text className="text-base font-semibold text-gray-900">
                ${processingFee.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-lg font-bold text-gray-900">Total</Text>
              <Text className="text-2xl font-bold text-teal-600">
                ${total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Confirm Button */}
        <View className="px-4 mb-6">
          <TouchableOpacity
            onPress={handleConfirmPayment}
            className="bg-teal-500 py-4 rounded-2xl items-center shadow-lg active:bg-teal-600"
          >
            <Text className="text-white text-lg font-bold">
              Confirm Payment
            </Text>
          </TouchableOpacity>
        </View>

        {/* Security Notice */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center justify-center bg-gray-50 py-4 px-6 rounded-2xl">
            <Ionicons name="lock-closed" size={20} color="#6B7280" />
            <Text className="text-xs text-gray-600 ml-2 text-center">
              Your payment is secured with 256-bit{"\n"}SSL encryption
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Payment Method Selection Modal */}
      <PaymentMethodModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSelect={setSelectedMethod}
        selectedMethod={selectedMethod}
        amount={total}
        savedCards={savedCards}
        otherMethods={otherMethods}
      />

      {/* Payment Success Modal */}
      <PaymentSuccessModal
        visible={showSuccessModal}
        onClose={handleSuccessClose}
        amount={total}
        transactionId={transactionId}
        date={transactionDate}
      />
    </View>
  );
}
