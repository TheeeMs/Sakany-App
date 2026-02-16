import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Types
import type { Payment, Transaction } from "./types";

// Components
import {
  BalanceCard,
  ActionButton,
  PendingPaymentCard,
  TransactionCard,
} from "./components";

export default function PaymentScreen() {
  const navigation = useNavigation();

  // Pending Payments Data
  const pendingPayments: Payment[] = [
    {
      id: "1",
      title: "Monthly Fee",
      type: "Monthly Fee",
      description: "Compound management fee",
      amount: 450.0,
      dueDate: "Nov 30, 2024",
      status: "Pending",
    },
    {
      id: "2",
      title: "Maintenance Charge",
      type: "Maintenance Charge",
      description: "AC repair - Unit 205",
      amount: 120.0,
      dueDate: "Dec 15, 2024",
      status: "Overdue",
    },
  ];

  // Recent Transactions
  const recentTransactions: Transaction[] = [
    {
      id: "1",
      title: "Monthly Fee",
      type: "Monthly Fee",
      description: "Compound management fee",
      amount: -450.0,
      date: "Nov 01, 2024",
      status: "Paid",
    },
    {
      id: "2",
      title: "Maintenance",
      type: "Maintenance Charge",
      description: "AC repair - Unit 205",
      amount: -120.0,
      date: "Dec 10, 2024",
      status: "Paid",
    },
    {
      id: "3",
      title: "Monthly Fee",
      type: "Monthly Fee",
      description: "Compound management fee",
      amount: -450.0,
      date: "Oct 01, 2024",
      status: "Paid",
    },
    {
      id: "4",
      title: "Security Deposit",
      type: "Security Deposit",
      description: "Initial deposit refund",
      amount: 200.0,
      date: "Nov 10, 2024",
      status: "Paid",
    },
  ];

  const totalBalance = pendingPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  const handlePayAllBills = () => {
    console.log("Pay All Bills");
  };

  const handlePaySpecific = () => {
    console.log("Pay Specific");
  };

  const handleViewStatistics = () => {
    // @ts-ignore - navigation typing complex with nested navigators
    navigation.navigate("PaymentStatistics");
  };

  const handleViewAllTransactions = () => {
    console.log("View All Transactions");
  };

  const handlePaymentPress = (payment: Payment) => {
    // @ts-ignore - navigation typing complex with nested navigators
    navigation.navigate("PaymentDetails", { payment });
  };

  const handleTransactionPress = (transaction: Transaction) => {
    console.log("Transaction pressed:", transaction.id);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with Gradient */}
      <LinearGradient
        colors={["#14B8A6", "#0D9488"]}
        className="pt-12 pb-6 px-4"
      >
        {/* Top Bar */}
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Payments</Text>
          <View className="w-10" />
        </View>

        {/* Balance Card */}
        <BalanceCard totalBalance={totalBalance} />

        {/* Action Buttons */}
        <View className="flex-row gap-2 mt-4">
          <View className="flex-1">
            <ActionButton
              icon="card-outline"
              label="Pay All Bills"
              onPress={handlePayAllBills}
              variant="primary"
            />
          </View>
          <View className="flex-1">
            <ActionButton
              icon="checkmark-circle-outline"
              label="Pay Specific"
              onPress={handlePaySpecific}
              variant="secondary"
            />
          </View>
        </View>

        {/* Statistics Button */}
        <View className="mt-2">
          <ActionButton
            icon="stats-chart-outline"
            label="View Payment Statistics"
            onPress={handleViewStatistics}
            variant="secondary"
          />
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Pending Payments */}
        <View className="mt-5">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-gray-900">
              Pending Payments
            </Text>
            <Text className="text-sm text-gray-500">
              {pendingPayments.length} Bills
            </Text>
          </View>
          {pendingPayments.map((payment) => (
            <PendingPaymentCard
              key={payment.id}
              payment={payment}
              onPress={() => handlePaymentPress(payment)}
            />
          ))}
        </View>

        {/* Recent Transactions */}
        <View className="mt-3">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-gray-900">
              Recent Transactions
            </Text>
            <TouchableOpacity onPress={handleViewAllTransactions}>
              <Text className="text-sm font-semibold text-teal-500">
                View All
              </Text>
            </TouchableOpacity>
          </View>
          {recentTransactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onPress={() => handleTransactionPress(transaction)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
