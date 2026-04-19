import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation";
import { useAuthStore } from "../../store/authStore";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PhoneLogin"
>;

function normalizeDigits(value: string) {
  const arabicIndic = "٠١٢٣٤٥٦٧٨٩";
  const easternArabicIndic = "۰۱۲۳۴۵۶۷۸۹";

  return value
    .split("")
    .map((char) => {
      const indexArabic = arabicIndic.indexOf(char);
      if (indexArabic >= 0) {
        return String(indexArabic);
      }

      const indexEastern = easternArabicIndic.indexOf(char);
      if (indexEastern >= 0) {
        return String(indexEastern);
      }

      return char;
    })
    .join("");
}

function sanitizePhone(value: string) {
  return normalizeDigits(value).replace(/\D/g, "");
}

function toEgyptInternationalPhone(phoneDigits: string) {
  const digits = sanitizePhone(phoneDigits);

  if (!digits) {
    return "";
  }

  // Already international without plus (e.g. 201555100100)
  if (digits.startsWith("20")) {
    return `+${digits}`;
  }

  // Local Egyptian mobile format (e.g. 01555100100)
  if (digits.startsWith("0")) {
    return `+2${digits}`;
  }

  // Fallback to requested behavior: auto-prepend +2
  return `+2${digits}`;
}

function sanitizeOtp(value: string) {
  return normalizeDigits(value).replace(/\D/g, "");
}

export default function PhoneLoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const sendOtpToPhone = useAuthStore((state) => state.sendOtpToPhone);
  const loginWithPhoneOtp = useAuthStore((state) => state.loginWithPhoneOtp);

  const sanitizedPhone = useMemo(
    () => sanitizePhone(phoneNumber),
    [phoneNumber],
  );
  const apiPhone = useMemo(
    () => toEgyptInternationalPhone(sanitizedPhone),
    [sanitizedPhone],
  );
  const sanitizedOtp = useMemo(() => sanitizeOtp(otp), [otp]);

  const canSendOtp = useMemo(
    () => sanitizedPhone.length >= 8 && resendCountdown === 0,
    [sanitizedPhone, resendCountdown],
  );
  const canLogin = useMemo(
    () => sanitizedPhone.length >= 8 && sanitizedOtp.length >= 4,
    [sanitizedPhone, sanitizedOtp],
  );

  useEffect(() => {
    if (resendCountdown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCountdown]);

  const onSendOtp = async () => {
    if (!canSendOtp || isLoading) {
      return;
    }

    clearError();

    try {
      await sendOtpToPhone(apiPhone);
      setOtpSent(true);
      setResendCountdown(60);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        // If OTP already exists for this phone, allow user to continue entering it.
        setOtpSent(true);
        setResendCountdown(30);
      }
      // Error is already handled in auth store.
    }
  };

  const onLoginWithPhone = async () => {
    if (!canLogin || isLoading) {
      return;
    }

    clearError();

    try {
      await loginWithPhoneOtp(apiPhone, sanitizedOtp);
    } catch {
      // Error is already handled in auth store.
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 16,
            paddingTop: 36,
            paddingBottom: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center">
            <View className="w-[220px] items-center">
              <Text className="text-[24px] font-bold text-[#00A996] text-center">
                Phone Login
              </Text>
              <Text className="mt-5 text-[16px] leading-6 font-semibold text-[#212121] text-center">
                Sign in with OTP
              </Text>
            </View>

            <View className="w-full mt-14 gap-6">
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                autoCorrect={false}
                placeholder="Phone Number"
                placeholderTextColor="#626262"
                className="w-full bg-[#F1F4FF] rounded-[10px] px-5 py-5 text-[16px] text-[#212121]"
              />

              <TouchableOpacity
                onPress={onSendOtp}
                disabled={!canSendOtp || isLoading}
                activeOpacity={0.85}
                className="w-full h-12 rounded-[10px] items-center justify-center"
                style={{
                  backgroundColor:
                    !canSendOtp || isLoading ? "#93CFC8" : "#00A996",
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white text-[16px] font-semibold">
                    {resendCountdown > 0
                      ? `Resend in ${resendCountdown}s`
                      : "Send OTP"}
                  </Text>
                )}
              </TouchableOpacity>

              {otpSent ? (
                <Text className="text-[#0F766E] text-[13px]">
                  OTP sent successfully. Enter the code below.
                </Text>
              ) : null}

              <TextInput
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                autoCorrect={false}
                placeholder="OTP"
                placeholderTextColor="#626262"
                className="w-full bg-[#F1F4FF] rounded-[10px] px-5 py-5 text-[16px] text-[#212121]"
              />

              {error ? (
                <Text className="text-[#DC2626] text-[13px]">{error}</Text>
              ) : null}

              <TouchableOpacity
                onPress={onLoginWithPhone}
                disabled={!canLogin || isLoading}
                activeOpacity={0.85}
                className="w-full h-12 rounded-[10px] items-center justify-center"
                style={{
                  backgroundColor:
                    !canLogin || isLoading ? "#93CFC8" : "#00A996",
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white text-[16px] font-semibold">
                    Login with Phone
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate("Login")}
              className="w-full h-12 rounded-[10px] items-center justify-center mt-8"
            >
              <Text className="text-[#9E9E9E] text-[14px]">
                Back to email login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
