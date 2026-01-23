import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Pressable,
  Share,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import QRCode from "react-native-qrcode-svg";

interface QRData {
  visitorType: string;
  visitorName: string;
  usageCount: number;
  date: Date | null;
  time: Date | null;
  accessCode: string;
}

interface QRSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  qrData: QRData;
}

export function QRSuccessModal({
  visible,
  onClose,
  qrData,
}: QRSuccessModalProps) {
  const fadeAnim = React.useState(new Animated.Value(0))[0];
  const scaleAnim = React.useState(new Animated.Value(0.8))[0];

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [visible]);

  // Generate QR code value with all relevant data
  const generateQRValue = () => {
    const data = {
      code: qrData.accessCode,
      type: qrData.visitorType,
      name: qrData.visitorName,
      usageLimit: qrData.usageCount,
      validDate: qrData.date?.toISOString(),
      validTime: qrData.time?.toISOString(),
      createdAt: new Date().toISOString(),
    };
    return JSON.stringify(data);
  };

  // Share QR Code
  const handleShare = async () => {
    try {
      const message = `
🎉 Access Pass Created!

👤 Visitor: ${qrData.visitorName}
📌 Type: ${qrData.visitorType}
🔢 Access Code: ${qrData.accessCode}
🔄 Usage: ${qrData.usageCount === 1 ? "Single use" : `${qrData.usageCount} times`}
📅 Valid: ${qrData.date ? formatDate(qrData.date) : "N/A"}
⏰ Time: ${qrData.time ? formatTime(qrData.time) : "N/A"}

Share this code with your visitor for access.
      `.trim();

      await Share.share({
        message,
        title: "Access Pass",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const formatDate = (date: Date): string => {
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
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const formatTime = (time: Date): string => {
    let hours = time.getHours();
    const minutes = String(time.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View
        style={{ opacity: fadeAnim, flex: 1 }}
        className="justify-center items-center bg-black/50 px-6"
      >
        <Pressable className="absolute inset-0" onPress={onClose} />

        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 30,
            elevation: 15,
          }}
          className="bg-white rounded-3xl w-full max-w-sm overflow-hidden"
        >
          {/* Success Header */}
          <View className="items-center pt-8 pb-4">
            {/* Success Icon */}
            <View
              className="w-20 h-20 rounded-full bg-[#10B981]/10 items-center justify-center mb-4"
              style={{
                shadowColor: "#10B981",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View className="w-14 h-14 rounded-full bg-[#10B981]/20 items-center justify-center">
                <Ionicons name="checkmark" size={32} color="#10B981" />
              </View>
            </View>

            <Text className="text-2xl font-bold text-gray-900 mb-1">
              Pass Created!
            </Text>
            <Text className="text-gray-500 text-sm">
              Visitor QR code is ready to share
            </Text>
          </View>

          {/* QR Code Container */}
          <View className="items-center px-6 pb-4">
            <View
              className="bg-white p-5 rounded-2xl"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 4,
              }}
            >
              <QRCode
                value={generateQRValue()}
                size={180}
                color="#0D9488"
                backgroundColor="white"
              />
            </View>

            {/* Access Code */}
            <View className="items-center mt-4">
              <Text className="text-xs text-gray-400 mb-1">Access Code</Text>
              <Text className="text-xl font-bold text-gray-800 tracking-wider">
                {qrData.accessCode}
              </Text>
            </View>
          </View>

          {/* Details Section */}
          <View className="px-6 pb-4">
            <View className="bg-gray-50 rounded-xl p-4">
              <View className="flex-row justify-between mb-2">
                <View className="flex-row items-center">
                  <Ionicons name="person-outline" size={16} color="#6B7280" />
                  <Text className="text-gray-500 text-sm ml-2">Visitor</Text>
                </View>
                <Text className="text-gray-800 font-medium text-sm">
                  {qrData.visitorName}
                </Text>
              </View>

              <View className="flex-row justify-between mb-2">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="account-group-outline"
                    size={16}
                    color="#6B7280"
                  />
                  <Text className="text-gray-500 text-sm ml-2">Type</Text>
                </View>
                <Text className="text-gray-800 font-medium text-sm capitalize">
                  {qrData.visitorType}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="refresh-outline" size={16} color="#6B7280" />
                  <Text className="text-gray-500 text-sm ml-2">Usage</Text>
                </View>
                <Text className="text-gray-800 font-medium text-sm">
                  {qrData.usageCount === 1
                    ? "Single use"
                    : `${qrData.usageCount} times`}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row px-6 pb-8 pt-2 gap-3">
            {/* Share Button */}
            <TouchableOpacity
              onPress={handleShare}
              className="flex-1 overflow-hidden rounded-xl"
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#0D9488", "#14B8A6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="flex-row items-center justify-center py-4"
                style={{
                  shadowColor: "#0D9488",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <Ionicons name="share-social-outline" size={20} color="white" />
                <Text className="text-white font-semibold text-base ml-2">
                  Share QR Code
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Done Button */}
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-gray-100 py-4 rounded-xl items-center justify-center"
              activeOpacity={0.8}
            >
              <Text className="text-gray-700 font-semibold text-base">
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

export default QRSuccessModal;
