import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function PaymentStatisticsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("6M");

  const tabs = ["W", "M", "3M", "6M", "Y", "All"];

  const chartData = [
    { month: "Jul", value: 143, active: false },
    { month: "Aug", value: 177, active: false },
    { month: "Sep", value: 129, active: false },
    { month: "Oct", value: 153, active: false },
    { month: "Nov", value: 232, active: true },
    { month: "Dec", value: 194, active: false },
  ];

  const categories = [
    {
      id: 1,
      name: "Monthly Fee",
      payments: 6,
      amount: "$2700.00",
      percentage: "90%",
      color: "#00a996",
      iconName: "home-outline",
    },
    {
      id: 2,
      name: "Maintenance",
      payments: 2,
      amount: "$240.00",
      percentage: "8%",
      color: "#ff8b42",
      iconName: "settings-outline",
    },
    {
      id: 3,
      name: "Other Fees",
      payments: 2,
      amount: "$80.00",
      percentage: "2%",
      color: "#8b5cf6",
      iconName: "document-text-outline",
    },
  ];

  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <View className="flex-1 bg-[#f3fbf9]">
      {/* Header */}
      <View
        className="bg-[#e8f8f5] pb-4 px-4 border-b border-gray-200"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">
            Payment Statistics
          </Text>
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <Ionicons name="ellipsis-vertical" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Time Filter Tabs */}
        <View className="px-4 my-4">
          <View className="flex-row gap-2 bg-white/50 p-1 rounded-2xl">
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-xl items-center ${
                  activeTab === tab ? "bg-white shadow-sm" : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    activeTab === tab ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Balance Display */}
        <View className="px-6 mb-6">
          <Text className="text-sm text-gray-600 mb-1 font-medium">
            December
          </Text>
          <View className="flex-row items-baseline">
            <Text className="text-5xl font-bold text-gray-900">3,020</Text>
            <Text className="text-2xl font-semibold text-gray-900">.00$</Text>
          </View>
        </View>

        {/* Chart Section */}
        <View className="px-6 mb-8">
          <View className="h-64 relative">
            {/* Average Line */}
            <View
              className="absolute left-0 right-0 border-t border-dashed border-teal-400"
              style={{ top: "25%" }}
            >
              <View className="absolute -top-3 right-0 bg-[#e8f8f5] px-1">
                <Text className="text-xs font-semibold text-teal-600">
                  $503
                </Text>
              </View>
            </View>

            {/* Chart Bars */}
            <View className="flex-row items-end justify-between h-full pb-8">
              {chartData.map((item, index) => (
                <View key={item.month} className="items-center flex-1 h-full">
                  <View className="w-10 justify-end flex-1 mb-3">
                    <View
                      className={`w-full rounded-t-xl ${
                        item.active
                          ? "bg-teal-400 border-2 border-teal-600"
                          : "bg-white/60"
                      }`}
                      style={{
                        height: `${(item.value / maxValue) * 100}%`,
                      }}
                    >
                      {item.active && (
                        <View className="absolute -top-10 left-1/2 -ml-6 bg-teal-400 px-2 py-1 rounded-lg shadow-lg border border-teal-600/20">
                          <Text className="text-xs font-bold text-gray-900">
                            $680
                          </Text>
                          <View className="absolute -bottom-1 left-1/2 -ml-1 w-2 h-2 bg-teal-400 rotate-45 border-r border-b border-teal-600/20" />
                        </View>
                      )}
                    </View>
                  </View>
                  <Text
                    className={`text-xs font-medium ${
                      item.active ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {item.month}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Main White Card */}
        <View className="bg-white rounded-t-[32px] px-6 pt-8 pb-10 shadow-lg">
          {/* Summary Cards */}
          <View className="flex-row gap-4 mb-8">
            <View className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="w-8 h-8 rounded-xl bg-teal-100 items-center justify-center">
                  <Ionicons name="trending-up" size={16} color="#00a996" />
                </View>
                <Text className="text-xs font-medium text-gray-600">
                  Highest
                </Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900 mb-1">
                $680
              </Text>
              <Text className="text-xs font-medium text-gray-500">
                November
              </Text>
            </View>

            <View className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="w-8 h-8 rounded-xl bg-blue-100 items-center justify-center">
                  <Ionicons name="stats-chart" size={16} color="#155DFC" />
                </View>
                <Text className="text-xs font-medium text-gray-600">
                  Average
                </Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900 mb-1">
                $503
              </Text>
              <Text className="text-xs font-medium text-gray-500">
                Per month
              </Text>
            </View>
          </View>

          {/* Top Categories */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-base font-bold text-gray-900">
                Top Categories
              </Text>
              <TouchableOpacity className="flex-row items-center">
                <Text className="text-xs font-semibold text-teal-600">
                  View All
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#00a996" />
              </TouchableOpacity>
            </View>

            {/* Stacked Progress Bar */}
            <View className="h-2.5 w-full flex-row rounded-full overflow-hidden mb-4 bg-gray-100">
              <View className="bg-[#00a996]" style={{ width: "90%" }} />
              <View className="bg-[#ff8b42]" style={{ width: "8%" }} />
              <View className="bg-[#8b5cf6]" style={{ width: "2%" }} />
            </View>

            {/* Category List */}
            <View className="gap-1">
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  className="flex-row items-center gap-4 p-3 rounded-2xl border border-transparent active:bg-gray-50 active:border-gray-100"
                >
                  <View
                    className="w-11 h-11 rounded-2xl items-center justify-center"
                    style={{ backgroundColor: `${cat.color}15` }}
                  >
                    <Ionicons
                      name={cat.iconName as any}
                      size={20}
                      color={cat.color}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-gray-900">
                      {cat.name}
                    </Text>
                    <Text className="text-xs font-medium text-gray-500">
                      {cat.payments} payments
                    </Text>
                  </View>
                  <View className="items-end mr-1">
                    <Text className="text-sm font-bold text-gray-900">
                      {cat.amount}
                    </Text>
                    <Text className="text-xs font-medium text-gray-500">
                      {cat.percentage}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#99A1AF" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Payment Insight Card */}
          <LinearGradient
            colors={["rgba(0, 169, 150, 0.1)", "rgba(239, 246, 255, 0.5)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-5 rounded-3xl border border-teal-600/10"
          >
            <View className="flex-row gap-4">
              <View className="w-11 h-11 bg-white rounded-2xl items-center justify-center shadow-sm">
                <Ionicons name="information-circle" size={20} color="#00a996" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-gray-900 mb-1">
                  Payment Insight
                </Text>
                <Text className="text-xs text-gray-600 leading-5 font-medium">
                  Your payments have been consistent over the past 6 months with
                  an average of $503 per month. Consider setting up auto-pay to
                  avoid late fees.
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}
