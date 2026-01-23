import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// Types
import type { VisitorType, PassType, ActivePass } from "./types";

// Components
import {
  VisitorTypeButton,
  PassTypeTab,
  ActivePassCard,
  DateTimeInput,
  QRSuccessModal,
  UsageCountInput,
} from "./components";

// Generate unique access code
const generateAccessCode = (visitorType: VisitorType): string => {
  const prefix =
    visitorType === "guest"
      ? "VIS"
      : visitorType === "delivery"
        ? "DEL"
        : visitorType === "service"
          ? "SRV"
          : "FAM";
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}-${year}-${random}`;
};

export default function QRAccessScreen() {
  const navigation = useNavigation();

  // State
  const [selectedVisitorType, setSelectedVisitorType] =
    useState<VisitorType>("guest");
  const [selectedPassType, setSelectedPassType] =
    useState<PassType>("one-time");
  const [visitorName, setVisitorName] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [usageCount, setUsageCount] = useState(2);

  // QR Modal State
  const [showQRModal, setShowQRModal] = useState(false);
  const [generatedQRData, setGeneratedQRData] = useState<{
    visitorType: string;
    visitorName: string;
    usageCount: number;
    date: Date | null;
    time: Date | null;
    accessCode: string;
  } | null>(null);

  // Sample Active Passes Data
  const [activePasses, setActivePasses] = useState<ActivePass[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      type: "Visitor",
      usage: "Single use",
      validUntil: "Dec 15, 2026 6:00 PM",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      type: "Visitor",
      usage: "Single use",
      validUntil: "Dec 15, 2026 6:00 PM",
    },
    {
      id: "3",
      name: "Mohamed Saeed",
      type: "Visitor",
      usage: "Single use",
      validUntil: "Dec 15, 2026 6:00 PM",
    },
  ]);

  // Generate QR Code Handler
  const handleGenerateQR = () => {
    // Validation
    if (!visitorName.trim()) {
      Alert.alert("Missing Information", "Please enter the visitor name.");
      return;
    }

    if (!date) {
      Alert.alert("Missing Information", "Please select a date.");
      return;
    }

    if (!time) {
      Alert.alert("Missing Information", "Please select a time.");
      return;
    }

    // Generate access code
    const accessCode = generateAccessCode(selectedVisitorType);

    // Set QR data
    setGeneratedQRData({
      visitorType: selectedVisitorType,
      visitorName: visitorName.trim(),
      usageCount: selectedPassType === "one-time" ? 1 : usageCount,
      date,
      time,
      accessCode,
    });

    // Show modal
    setShowQRModal(true);
  };

  // Handle modal close and add to active passes
  const handleQRModalClose = () => {
    if (generatedQRData) {
      // Format the valid until date
      const formatValidUntil = () => {
        if (!generatedQRData.date || !generatedQRData.time) return "";
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const d = generatedQRData.date;
        const t = generatedQRData.time;
        let hours = t.getHours();
        const minutes = String(t.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${hours}:${minutes} ${ampm}`;
      };

      // Map visitor type to display type
      const typeMap: Record<VisitorType, ActivePass["type"]> = {
        guest: "Visitor",
        delivery: "Delivery",
        service: "Service",
        family: "Family",
      };

      // Add new pass to active passes
      const newPass: ActivePass = {
        id: Date.now().toString(),
        name: generatedQRData.visitorName,
        type: typeMap[generatedQRData.visitorType as VisitorType],
        usage: generatedQRData.usageCount === 1 ? "Single use" : "Multiple use",
        validUntil: formatValidUntil(),
      };

      setActivePasses((prev) => [newPass, ...prev]);

      // Reset form
      setVisitorName("");
      setDate(null);
      setTime(null);
      setUsageCount(2);
      setSelectedPassType("one-time");
    }

    setShowQRModal(false);
    setGeneratedQRData(null);
  };

  // Visitor Type Icons
  const getVisitorIcon = (type: VisitorType, isSelected: boolean) => {
    const color = isSelected ? "#FFFFFF" : "#6B7280";
    switch (type) {
      case "guest":
        return <Ionicons name="person-outline" size={24} color={color} />;
      case "delivery":
        return (
          <MaterialCommunityIcons
            name="truck-delivery-outline"
            size={24}
            color={color}
          />
        );
      case "service":
        return <MaterialCommunityIcons name="tools" size={24} color={color} />;
      case "family":
        return <Ionicons name="people-outline" size={24} color={color} />;
    }
  };

  // Visitor Types Data
  const visitorTypes: { type: VisitorType; label: string }[] = [
    { type: "guest", label: "Guest" },
    { type: "delivery", label: "Delivery" },
    { type: "service", label: "Service" },
    { type: "family", label: "Family" },
  ];

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8F0" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-12 pb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">QR Accesses</Text>
        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <Ionicons name="time-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Create New QR Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Create New QR
          </Text>

          {/* Visitor Type Label */}
          <Text className="text-sm text-gray-500 mb-3">Visitor Type</Text>

          {/* Visitor Type Buttons */}
          <View className="flex-row justify-around mb-5">
            {visitorTypes.map((item) => (
              <VisitorTypeButton
                key={item.type}
                type={item.type}
                label={item.label}
                icon={getVisitorIcon(
                  item.type,
                  selectedVisitorType === item.type,
                )}
                isSelected={selectedVisitorType === item.type}
                onPress={() => setSelectedVisitorType(item.type)}
              />
            ))}
          </View>

          {/* Pass Type Buttons */}
          <View className="flex-row mb-5">
            <PassTypeTab
              label="One-time"
              isSelected={selectedPassType === "one-time"}
              onPress={() => setSelectedPassType("one-time")}
            />
            <PassTypeTab
              label="Multiple"
              isSelected={selectedPassType === "multiple"}
              onPress={() => setSelectedPassType("multiple")}
            />
          </View>

          {/* Input Fields */}
          <View
            className="bg-white rounded-2xl p-4 mb-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            {/* Visitor Name Input */}
            <View className="flex-row items-center border border-gray-200 rounded-xl px-4 py-3 mb-3">
              <Ionicons name="person-outline" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-base text-gray-700"
                placeholder="Visitor Name"
                placeholderTextColor="#9CA3AF"
                value={visitorName}
                onChangeText={setVisitorName}
              />
            </View>

            {/* Usage Count Input - Only show for Multiple pass type */}
            {selectedPassType === "multiple" && (
              <View className="mb-3">
                <UsageCountInput
                  value={usageCount}
                  onChange={setUsageCount}
                  minValue={2}
                  maxValue={10}
                />
              </View>
            )}

            {/* Date and Time Inputs */}
            <DateTimeInput
              date={date}
              time={time}
              onDateChange={setDate}
              onTimeChange={setTime}
            />
          </View>

          {/* Generate QR Button */}
          <TouchableOpacity
            onPress={handleGenerateQR}
            className="bg-[#0D9488] flex-row items-center justify-center py-4 rounded-xl"
            style={{
              shadowColor: "#0D9488",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <MaterialCommunityIcons name="qrcode" size={22} color="white" />
            <Text className="text-white text-base font-semibold ml-2">
              Generate QR Code
            </Text>
          </TouchableOpacity>
        </View>

        {/* Active Passes Section */}
        <View>
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Active Passes
          </Text>
          {activePasses.map((pass) => (
            <ActivePassCard key={pass.id} pass={pass} />
          ))}
        </View>
      </ScrollView>

      {/* QR Success Modal */}
      {generatedQRData && (
        <QRSuccessModal
          visible={showQRModal}
          onClose={handleQRModalClose}
          qrData={generatedQRData}
        />
      )}
    </View>
  );
}
