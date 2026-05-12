import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import axios from "axios";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useCustomAlert } from "../../components/CustomAlert";
import {
  scanAccessCode,
  type ScanAccessCodeResponse,
} from "../../services/qrAccess";
import { useAuthStore } from "../../store/authStore";

function extractAccessCode(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as { code?: string };
      if (typeof parsed.code === "string" && parsed.code.trim()) {
        return parsed.code.trim();
      }
    } catch {
      // Fall back to raw string if it's not valid JSON.
    }
  }

  return trimmed;
}

function readApiMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (
      typeof data === "object" &&
      data !== null &&
      "detail" in data &&
      typeof data.detail === "string"
    ) {
      return data.detail;
    }
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message;
    }
    if (typeof data === "string") {
      return data;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to scan access code.";
}

function mapPurposeToArabic(purpose: ScanAccessCodeResponse["purpose"]) {
  const map: Record<ScanAccessCodeResponse["purpose"], string> = {
    GUEST: "ضيف",
    DELIVERY: "توصيل",
    SERVICE: "خدمة",
    FAMILY: "عائلة",
    OTHER: "اخرى",
  };
  return map[purpose] ?? purpose;
}

function mapStatusToArabic(status: ScanAccessCodeResponse["status"]) {
  const map: Record<ScanAccessCodeResponse["status"], string> = {
    ACTIVE: "صالح",
    USED: "مستخدم",
    EXPIRED: "منتهي",
    REVOKED: "ملغي",
  };
  return map[status] ?? status;
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("ar-EG");
}

export default function QRScanScreen() {
  const insets = useSafeAreaInsets();
  const alert = useCustomAlert();
  const [permission, requestPermission] = useCameraPermissions();
  const logout = useAuthStore((state) => state.logout);

  const [isScanning, setIsScanning] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [scanDetails, setScanDetails] = useState<ScanAccessCodeResponse | null>(
    null,
  );
  const [manualCode, setManualCode] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showUsed, setShowUsed] = useState(false);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  const resetScanView = useCallback(() => {
    setShowSuccess(false);
    setShowError(false);
    setShowUsed(false);
    setScanDetails(null);
    setLastScanned(null);
    setManualCode("");
  }, []);

  const hasPermission = permission?.granted === true;

  useEffect(() => {
    if (!permission || permission.granted) {
      return;
    }

    if (permission.canAskAgain) {
      void requestPermission();
    }
  }, [permission, requestPermission]);

  const submitScan = useCallback(
    async (rawCode: string) => {
      const code = extractAccessCode(rawCode);
      if (!code) {
        alert.show(
          "Invalid QR",
          "No access code found.",
          [{ text: "OK" }],
          "warning",
        );
        return;
      }

      if (isSubmitting || (lastScanned && lastScanned === code)) {
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await scanAccessCode(code, {
          gateNumber: undefined,
        });
        setLastScanned(code);
        setScanDetails(response);
        setShowSuccess(true);
        setShowError(false);
        setShowUsed(false);
        setIsCameraOpen(false);
        alert.show(
          "Success",
          "Access granted and entry logged.",
          [{ text: "OK" }],
          "success",
        );
      } catch (error) {
        const message = readApiMessage(error);
        const usedPattern =
          /already been used|single-use|used access code|\bUSED\b/i;
        const isUsed = usedPattern.test(message);
        setShowUsed(isUsed);
        setShowError(!isUsed);
        setIsCameraOpen(false);
        alert.show("Scan Failed", message, [{ text: "OK" }], "danger");
      } finally {
        setIsSubmitting(false);
        setIsScanning(true);
      }
    },
    [alert, isSubmitting, lastScanned],
  );

  const handleBarcodeScanned = useCallback(
    ({ data, type }: { data: string; type?: string }) => {
      if (!isScanning || isSubmitting) {
        return;
      }
      if (type && type !== "qr") {
        return;
      }
      setIsScanning(false);
      void submitScan(data);
    },
    [isScanning, isSubmitting, submitScan],
  );

  const permissionContent = useMemo(() => {
    if (hasPermission) {
      return null;
    }

    return (
      <View className="flex-1 items-center justify-center px-6">
        <MaterialCommunityIcons name="camera-off" size={56} color="#EF4444" />
        <Text className="text-lg font-semibold text-gray-900 mt-4">
          Camera access needed
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          Enable camera permission to scan QR codes.
        </Text>
        <TouchableOpacity
          onPress={() => requestPermission()}
          className="mt-6 bg-[#0D9488] px-6 py-3 rounded-xl"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold">Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }, [hasPermission, requestPermission]);

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View
        style={{ paddingTop: insets.top + 8 }}
        className="px-4 pb-4 bg-white border-b border-gray-100"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-xl items-center justify-center bg-[#E6F7F6]">
              <Ionicons name="qr-code-outline" size={22} color="#0D9488" />
            </View>
            <View className="ml-3">
              <Text className="text-lg font-bold text-gray-900">QR Scan</Text>
              <Text className="text-sm text-gray-500">
                Security access gate
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setShowLogoutMenu(true)}
            className="w-10 h-10 rounded-full items-center justify-center bg-gray-100"
            activeOpacity={0.8}
          >
            <Ionicons name="ellipsis-vertical" size={18} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 px-4 pt-5">
        <TouchableOpacity
          onPress={() => {
            setShowSuccess(false);
            setIsCameraOpen(true);
          }}
          className="rounded-[20px] px-5 py-4 flex-row items-center justify-between border border-[#0B8379]"
          style={{ backgroundColor: "#0D9488" }}
          activeOpacity={0.8}
        >
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center">
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={26}
                color="#FFFFFF"
              />
            </View>
            <View className="ml-4">
              <Text className="text-white text-base font-semibold">
                افتح الكاميرا للمسح
              </Text>
              <Text className="text-white/80 text-xs mt-1">
                امسح QR لتأكيد الدخول
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {showSuccess ? (
          <View className="mt-4 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-4 flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-emerald-100 items-center justify-center">
              <Ionicons name="checkmark" size={20} color="#047857" />
            </View>
            <View className="ml-3">
              <Text className="text-emerald-800 font-semibold">اتفضل</Text>
              <Text className="text-emerald-700 text-xs mt-1">
                تم قبول الدخول بنجاح
              </Text>
            </View>
          </View>
        ) : null}

        {showError ? (
          <View className="mt-4 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-rose-100 items-center justify-center">
                <Ionicons name="alert" size={18} color="#B91C1C" />
              </View>
              <View className="ml-3">
                <Text className="text-rose-800 font-semibold">
                  في عطل في ال qr
                </Text>
                <Text className="text-rose-700 text-xs mt-1">
                  حاول تاني او ادخل الكود يدوي
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={resetScanView}
              className="mt-4 rounded-xl bg-rose-100 py-3 items-center"
              activeOpacity={0.8}
            >
              <Text className="text-rose-700 font-semibold">تم</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {showSuccess && scanDetails ? (
          <View className="mt-4 bg-white border border-gray-100 rounded-2xl px-4 py-4">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <View className="w-9 h-9 rounded-full bg-[#E6F7F6] items-center justify-center">
                  <MaterialCommunityIcons
                    name="card-account-details"
                    size={18}
                    color="#0D9488"
                  />
                </View>
                <Text className="ml-2 text-base font-semibold text-gray-900">
                  تفاصيل QR
                </Text>
              </View>
              <Text className="text-xs text-gray-400">
                {scanDetails.isSingleUse ? "One-time" : "Multiple"}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm font-semibold text-gray-900">
                {scanDetails.visitorName}
              </Text>
              <Text className="text-xs text-gray-500">الاسم</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm font-semibold text-gray-900">
                {mapPurposeToArabic(scanDetails.purpose)}
              </Text>
              <Text className="text-xs text-gray-500">النوع</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm font-semibold text-gray-900">
                {mapStatusToArabic(scanDetails.status)}
              </Text>
              <Text className="text-xs text-gray-500">الحالة</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm font-semibold text-gray-900">
                {formatDateTime(scanDetails.validUntil)}
              </Text>
              <Text className="text-xs text-gray-500">صالح حتى</Text>
            </View>
            <View className="flex-row justify-between mt-2">
              <Text className="text-sm font-semibold text-gray-900">
                {formatDateTime(scanDetails.usedAt)}
              </Text>
              <Text className="text-xs text-gray-500">وقت الدخول</Text>
            </View>
            <TouchableOpacity
              onPress={resetScanView}
              className="mt-4 rounded-xl bg-gray-100 py-3 items-center"
              activeOpacity={0.8}
            >
              <Text className="text-gray-700 font-semibold">تم</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {showUsed ? (
          <View className="mt-4 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-amber-100 items-center justify-center">
                <Ionicons name="alert-circle" size={18} color="#B45309" />
              </View>
              <View className="ml-3">
                <Text className="text-amber-800 font-semibold">
                  الـ QR مستخدم قبل كده
                </Text>
                <Text className="text-amber-700 text-xs mt-1">
                  اطلب كود جديد او تحقق من الزائر
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={resetScanView}
              className="mt-4 rounded-xl bg-amber-100 py-3 items-center"
              activeOpacity={0.8}
            >
              <Text className="text-amber-800 font-semibold">تم</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View className="mt-4 bg-white border border-gray-100 rounded-2xl px-4 py-4">
          <Text className="text-sm text-gray-500 mb-3">Manual code entry</Text>
          <View className="flex-row items-center">
            <TextInput
              value={manualCode}
              onChangeText={setManualCode}
              placeholder="Enter access code"
              placeholderTextColor="#9CA3AF"
              className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-base text-gray-800"
              autoCapitalize="characters"
            />
            <TouchableOpacity
              onPress={() => submitScan(manualCode)}
              disabled={!manualCode.trim() || isSubmitting}
              className="ml-3 px-4 py-3 rounded-xl"
              style={{
                backgroundColor: manualCode.trim() ? "#0D9488" : "#A7DAD4",
              }}
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {lastScanned ? (
          <View className="mt-4 bg-white border border-emerald-100 rounded-2xl px-4 py-3">
            <Text className="text-emerald-700 text-sm font-semibold">
              Last scan: {lastScanned}
            </Text>
          </View>
        ) : null}
      </View>

      <Modal visible={isCameraOpen} transparent animationType="fade">
        <View className="flex-1 bg-black/60 px-4 justify-center">
          <Pressable
            className="absolute inset-0"
            onPress={() => setIsCameraOpen(false)}
          />
          <View className="bg-white rounded-3xl overflow-hidden">
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="qrcode"
                  size={20}
                  color="#0D9488"
                />
                <Text className="ml-2 text-base font-semibold text-gray-900">
                  مسح QR
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsCameraOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
              >
                <Ionicons name="close" size={18} color="#111827" />
              </TouchableOpacity>
            </View>

            <View className="h-[360px] bg-gray-100">
              {hasPermission ? (
                <CameraView
                  style={{ flex: 1 }}
                  facing="back"
                  onBarcodeScanned={
                    isScanning ? handleBarcodeScanned : undefined
                  }
                />
              ) : (
                permissionContent
              )}
            </View>

            <View className="px-4 py-4">
              <TouchableOpacity
                onPress={() => {
                  setIsCameraOpen(false);
                  setIsScanning(true);
                }}
                className="rounded-xl bg-gray-100 py-3 items-center"
                activeOpacity={0.8}
              >
                <Text className="text-gray-700 font-semibold">إلغاء</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showLogoutMenu} transparent animationType="fade">
        <View className="flex-1 bg-black/30">
          <Pressable
            className="absolute inset-0"
            onPress={() => setShowLogoutMenu(false)}
          />
          <View className="absolute right-4" style={{ top: insets.top + 52 }}>
            <View className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <TouchableOpacity
                onPress={() => {
                  setShowLogoutMenu(false);
                  logout();
                }}
                className="px-4 py-3 flex-row items-center"
                activeOpacity={0.8}
              >
                <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                <Text className="ml-2 text-red-600 font-semibold">Log out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
