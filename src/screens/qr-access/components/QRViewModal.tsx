import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Pressable,
  Share,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import QRCode from "react-native-qrcode-svg";
import type { ActivePass } from "../types";

interface QRViewModalProps {
  visible: boolean;
  onClose: () => void;
  pass: ActivePass | null;
}

export function QRViewModal({ visible, onClose, pass }: QRViewModalProps) {
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

  if (!pass) return null;

  // Generate QR code value with all relevant data
  const generateQRValue = () => {
    const data = {
      code: pass.accessCode,
      type: pass.type,
      name: pass.name,
      usageLimit: pass.usageCount,
      validUntil: pass.validUntil,
    };
    return JSON.stringify(data);
  };

  // Share QR Code
  const handleShare = async () => {
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

      await Share.share({
        message,
        title: "Access Pass",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Get pass type color
  const getTypeColor = () => {
    switch (pass.type) {
      case "Visitor":
        return "#0D9488";
      case "Delivery":
        return "#F59E0B";
      case "Service":
        return "#6366F1";
      case "Family":
        return "#EC4899";
      default:
        return "#0D9488";
    }
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
          {/* Header */}
          <LinearGradient
            colors={[getTypeColor(), getTypeColor() + "CC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="px-5 py-4"
          >
            <View className="flex-row justify-between items-center">
              <TouchableOpacity
                onPress={onClose}
                className="w-8 h-8 bg-white/20 rounded-full items-center justify-center"
              >
                <Ionicons name="close" size={18} color="white" />
              </TouchableOpacity>

              <View className="flex-row items-center">
                <MaterialCommunityIcons name="qrcode" size={20} color="white" />
                <Text className="text-white font-bold text-base ml-2">
                  Access Pass
                </Text>
              </View>

              <View className="w-8" />
            </View>
          </LinearGradient>

          {/* Visitor Info */}
          <View className="items-center pt-4 pb-2">
            <Text className="text-xl font-bold text-gray-900">{pass.name}</Text>
            <View className="flex-row items-center mt-2">
              <View
                className="px-3 py-1 rounded-full mr-2"
                style={{ backgroundColor: getTypeColor() + "15" }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{ color: getTypeColor() }}
                >
                  {pass.type}
                </Text>
              </View>
              <View className="bg-orange-50 px-3 py-1 rounded-full">
                <Text className="text-orange-500 text-xs font-semibold">
                  {pass.usage}
                </Text>
              </View>
            </View>
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
                color={getTypeColor()}
                backgroundColor="white"
              />
            </View>

            {/* Access Code */}
            <View className="items-center mt-4">
              <Text className="text-xs text-gray-400 mb-1">Access Code</Text>
              <Text className="text-xl font-bold text-gray-800 tracking-wider">
                {pass.accessCode}
              </Text>
            </View>
          </View>

          {/* Valid Until */}
          <View className="px-6 pb-4">
            <View className="bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center justify-center">
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text className="text-gray-500 text-sm ml-2">Valid Until:</Text>
                <Text className="text-gray-800 font-semibold text-sm ml-2">
                  {pass.validUntil}
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
                colors={[getTypeColor(), getTypeColor() + "CC"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="flex-row items-center justify-center py-4"
                style={{
                  shadowColor: getTypeColor(),
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <Ionicons name="share-social-outline" size={20} color="white" />
                <Text className="text-white font-semibold text-base ml-2">
                  Share
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-gray-100 py-4 rounded-xl items-center justify-center"
              activeOpacity={0.8}
            >
              <Text className="text-gray-700 font-semibold text-base">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

export default QRViewModal;
