import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Share,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppBottomNav } from "../../components/navigation";
import { useCustomAlert } from "../../components/CustomAlert";

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
  QRViewModal,
} from "./components";

// API
import {
  createAccessCode,
  getMyAccessCodes,
  revokeAccessCode,
  mapVisitorTypeToPurpose,
  mapPurposeToType,
  mapStatusToDisplay,
  type AccessCode,
} from "../../services/qrAccess";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapAccessCodeToPass(ac: AccessCode): ActivePass {
  const validUntilDate = new Date(ac.validUntil);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let hours = validUntilDate.getHours();
  const minutes = String(validUntilDate.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const validUntilStr = `${months[validUntilDate.getMonth()]} ${validUntilDate.getDate()}, ${validUntilDate.getFullYear()} ${hours}:${minutes} ${ampm}`;

  return {
    id: ac.id,
    name: ac.visitorName,
    type: mapPurposeToType(ac.purpose) as ActivePass["type"],
    usage: ac.isSingleUse ? "Single use" : "Multiple use",
    usageCount: ac.isSingleUse ? 1 : 2,
    accessCode: ac.code,
    validUntil: validUntilStr,
    validDate: new Date(ac.validUntil),
    validTime: new Date(ac.validUntil),
  };
}

export default function QRAccessScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const alert = useCustomAlert();

  // Form state
  const [selectedVisitorType, setSelectedVisitorType] = useState<VisitorType>("guest");
  const [selectedPassType, setSelectedPassType] = useState<PassType>("one-time");
  const [visitorName, setVisitorName] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [usageCount, setUsageCount] = useState(2);
  const [isGenerating, setIsGenerating] = useState(false);

  // Active passes state
  const [activePasses, setActivePasses] = useState<ActivePass[]>([]);
  const [isLoadingPasses, setIsLoadingPasses] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // View QR Modal State
  const [showViewQRModal, setShowViewQRModal] = useState(false);
  const [selectedPass, setSelectedPass] = useState<ActivePass | null>(null);

  // ─── Fetch active passes ───────────────────────────────────────────────────

  const fetchPasses = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoadingPasses(true);

    try {
      const codes = await getMyAccessCodes();
      // Show only ACTIVE passes on the main screen
      const active = codes
        .filter((c) => c.status === "ACTIVE")
        .map(mapAccessCodeToPass);
      setActivePasses(active);
    } catch {
      // silently fail – passes section will just be empty
    } finally {
      setIsLoadingPasses(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPasses();
  }, [fetchPasses]);

  // ─── Generate QR ──────────────────────────────────────────────────────────

  const handleGenerateQR = async () => {
    if (!visitorName.trim()) {
      alert.show("Missing Information", "Please enter the visitor name.", [{ text: "OK" }], "warning");
      return;
    }
    if (!date) {
      alert.show("Missing Information", "Please select a date.", [{ text: "OK" }], "warning");
      return;
    }
    if (!time) {
      alert.show("Missing Information", "Please select a time.", [{ text: "OK" }], "warning");
      return;
    }

    // Build validFrom = now, validUntil = selected date+time
    const validFrom = new Date().toISOString();
    const combined = new Date(date);
    combined.setHours(time.getHours(), time.getMinutes(), 0, 0);
    const validUntil = combined.toISOString();

    setIsGenerating(true);
    try {
      const ac = await createAccessCode({
        visitorName: visitorName.trim(),
        purpose: mapVisitorTypeToPurpose(selectedVisitorType),
        isSingleUse: selectedPassType === "one-time",
        validFrom,
        validUntil,
      });

      setGeneratedQRData({
        visitorType: selectedVisitorType,
        visitorName: visitorName.trim(),
        usageCount: selectedPassType === "one-time" ? 1 : usageCount,
        date,
        time,
        accessCode: ac.code,
      });

      setShowQRModal(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to generate QR code";
      alert.show("Error", msg, [{ text: "OK" }], "warning");
    } finally {
      setIsGenerating(false);
    }
  };

  // ─── Modal close → add to list & reset form ───────────────────────────────

  const handleQRModalClose = () => {
    if (generatedQRData) {
      const formatValidUntil = () => {
        if (!generatedQRData.date || !generatedQRData.time) return "";
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const d = generatedQRData.date;
        const t = generatedQRData.time;
        let hours = t.getHours();
        const minutes = String(t.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${hours}:${minutes} ${ampm}`;
      };

      const typeMap: Record<VisitorType, ActivePass["type"]> = {
        guest: "Visitor",
        delivery: "Delivery",
        service: "Service",
        family: "Family",
      };

      const newPass: ActivePass = {
        id: Date.now().toString(),
        name: generatedQRData.visitorName,
        type: typeMap[generatedQRData.visitorType as VisitorType],
        usage: generatedQRData.usageCount === 1 ? "Single use" : "Multiple use",
        usageCount: generatedQRData.usageCount,
        accessCode: generatedQRData.accessCode,
        validUntil: formatValidUntil(),
        validDate: generatedQRData.date || undefined,
        validTime: generatedQRData.time || undefined,
      };

      setActivePasses((prev) => [newPass, ...prev]);
      setVisitorName("");
      setDate(null);
      setTime(null);
      setUsageCount(2);
      setSelectedPassType("one-time");
    }

    setShowQRModal(false);
    setGeneratedQRData(null);
  };

  // ─── Visitor Type Icons ───────────────────────────────────────────────────

  const getVisitorIcon = (type: VisitorType, isSelected: boolean) => {
    const color = isSelected ? "#FFFFFF" : "#6B7280";
    switch (type) {
      case "guest":
        return <Ionicons name="person-outline" size={24} color={color} />;
      case "delivery":
        return <MaterialCommunityIcons name="truck-delivery-outline" size={24} color={color} />;
      case "service":
        return <MaterialCommunityIcons name="tools" size={24} color={color} />;
      case "family":
        return <Ionicons name="people-outline" size={24} color={color} />;
    }
  };

  // ─── Pass actions ─────────────────────────────────────────────────────────

  const handleViewQR = (pass: ActivePass) => {
    setSelectedPass(pass);
    setShowViewQRModal(true);
  };

  const handleSharePass = async (pass: ActivePass) => {
    try {
      const message = `
🎫 Access Pass

👤 Visitor: ${pass.name}
📌 Type: ${pass.type}
🔢 Access Code: ${pass.accessCode}
🔄 Usage: ${pass.usage}
📅 Valid Until: ${pass.validUntil}

Share this code with your visitor for access.
      `.trim();

      await Share.share({ message, title: "Access Pass" });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleDeletePass = (pass: ActivePass) => {
    alert.show(
      "Delete Pass",
      `Are you sure you want to delete the pass for ${pass.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await revokeAccessCode(pass.id);
              setActivePasses((prev) => prev.filter((p) => p.id !== pass.id));
            } catch {
              alert.show("Error", "Failed to delete pass. Please try again.", [{ text: "OK" }], "danger");
            }
          },
        },
      ],
      "danger"
    );
  };

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
      <View
        className="flex-row items-center justify-between px-4 pb-4"
        style={{ paddingTop: insets.top + 12 }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">QR Accesses</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("QRHistory" as never)}
          className="w-10 h-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: "#E6F7F6" }}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="history" size={22} color="#0D9488" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchPasses(true)}
            tintColor="#0D9488"
          />
        }
      >
        {/* Create New QR Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Create New QR</Text>

          <Text className="text-sm text-gray-500 mb-3">Visitor Type</Text>

          <View className="flex-row justify-around mb-5">
            {visitorTypes.map((item) => (
              <VisitorTypeButton
                key={item.type}
                type={item.type}
                label={item.label}
                icon={getVisitorIcon(item.type, selectedVisitorType === item.type)}
                isSelected={selectedVisitorType === item.type}
                onPress={() => setSelectedVisitorType(item.type)}
              />
            ))}
          </View>

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
            disabled={isGenerating}
            className="flex-row items-center justify-center py-4 rounded-xl"
            style={{
              backgroundColor: isGenerating ? "#5EC5BD" : "#0D9488",
              shadowColor: "#0D9488",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            {isGenerating ? (
              <>
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white text-base font-semibold ml-2">Generating...</Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons name="qrcode" size={22} color="white" />
                <Text className="text-white text-base font-semibold ml-2">Generate QR Code</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Active Passes Section */}
        <View>
          <Text className="text-lg font-bold text-gray-900 mb-4">Active Passes</Text>

          {isLoadingPasses ? (
            <View style={{ paddingVertical: 32, alignItems: "center" }}>
              <ActivityIndicator size="small" color="#0D9488" />
            </View>
          ) : activePasses.length === 0 ? (
            <View style={{ paddingVertical: 32, alignItems: "center" }}>
              <MaterialCommunityIcons name="qrcode-remove" size={48} color="#D1D5DB" />
              <Text style={{ color: "#9CA3AF", marginTop: 12, fontSize: 14 }}>
                No active passes yet
              </Text>
            </View>
          ) : (
            activePasses.map((pass) => (
              <ActivePassCard
                key={pass.id}
                pass={pass}
                onViewQR={handleViewQR}
                onShare={handleSharePass}
                onDelete={handleDeletePass}
              />
            ))
          )}
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

      {/* View QR Modal */}
      <QRViewModal
        visible={showViewQRModal}
        onClose={() => {
          setShowViewQRModal(false);
          setSelectedPass(null);
        }}
        pass={selectedPass}
      />

      <AppBottomNav />

      {/* Custom Alert — must be last */}
      <alert.Component />
    </View>
  );
}
