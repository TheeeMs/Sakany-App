import React, { useMemo, useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation";
import { useAuthStore } from "../../store/authStore";
import type { RegisterLoginMethod, ResidentType } from "../../services/auth";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Register">;

function isEmailValid(value: string) {
  return /^\S+@\S+\.\S+$/.test(value);
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [unitId, setUnitId] = useState("");
  const [residentType] = useState<ResidentType>("PROPERTY_OWNER");
  const [loginMethod] = useState<RegisterLoginMethod>("EMAIL_PASSWORD");

  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const registerWithEmailPassword = useAuthStore(
    (state) => state.registerWithEmailPassword,
  );

  const passwordMatches = useMemo(
    () => confirmPassword.length > 0 && password === confirmPassword,
    [password, confirmPassword],
  );

  const isFormValid = useMemo(
    () =>
      firstName.trim().length >= 2 &&
      lastName.trim().length >= 2 &&
      phoneNumber.trim().length >= 8 &&
      isEmailValid(email.trim()) &&
      password.length >= 8 &&
      isUuid(unitId.trim()) &&
      passwordMatches,
    [
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      unitId,
      passwordMatches,
    ],
  );

  const onRegister = async () => {
    if (!isFormValid || isLoading) {
      return;
    }

    clearError();

    try {
      await registerWithEmailPassword({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        password,
        type: residentType,
        unitId: unitId.trim(),
        loginMethod,
      });
    } catch {
      // Error is already handled and stored in auth store.
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
            justifyContent: "flex-start",
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center">
            <View className="w-[326px] items-center">
              <Text className="text-[24px] font-bold text-[#00A996] text-center">
                Create Account
              </Text>
              <Text className="mt-5 text-[16px] leading-6 font-semibold text-black text-center">
                Create an your account Now!
              </Text>
            </View>

            <View className="w-full mt-8">
              <View className="gap-6">
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  placeholder="First Name"
                  placeholderTextColor="#626262"
                  className="w-full bg-[#F1F4FF] rounded-[10px] px-5 py-5 text-[16px] text-[#212121]"
                />
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  placeholder="Last Name"
                  placeholderTextColor="#626262"
                  className="w-full bg-[#F1F4FF] rounded-[10px] px-5 py-5 text-[16px] text-[#212121]"
                />
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  autoCorrect={false}
                  placeholder="Phone Number"
                  placeholderTextColor="#626262"
                  className="w-full bg-[#F1F4FF] rounded-[10px] px-5 py-5 text-[16px] text-[#212121]"
                />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Email"
                  placeholderTextColor="#626262"
                  className="w-full bg-[#F1F4FF] rounded-[10px] px-5 py-5 text-[16px] text-[#212121]"
                />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Password"
                  placeholderTextColor="#626262"
                  className="w-full bg-[#F1F4FF] rounded-[10px] px-5 py-5 text-[16px] text-[#212121]"
                />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Confirm Password"
                  placeholderTextColor="#626262"
                  className="w-full bg-[#F1F4FF] rounded-[10px] px-5 py-5 text-[16px] text-[#212121]"
                />
                <TextInput
                  value={unitId}
                  onChangeText={setUnitId}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Unit ID"
                  placeholderTextColor="#626262"
                  className="w-full bg-[#F1F4FF] rounded-[10px] px-5 py-5 text-[16px] text-[#212121]"
                />
              </View>

              <View className="mt-3 gap-1">
                <Text className="text-[#9E9E9E] text-[12px]">
                  type: {residentType}
                </Text>
                <Text className="text-[#9E9E9E] text-[12px]">
                  loginMethod: {loginMethod}
                </Text>
              </View>

              {unitId.trim().length > 0 && !isUuid(unitId.trim()) ? (
                <Text className="text-[#DC2626] text-[13px] mt-3">
                  Unit ID must be a valid UUID.
                </Text>
              ) : null}

              {!passwordMatches && confirmPassword.length > 0 ? (
                <Text className="text-[#DC2626] text-[13px] mt-3">
                  Password and confirm password must match.
                </Text>
              ) : null}

              {error ? (
                <Text className="text-[#DC2626] text-[13px] mt-3">{error}</Text>
              ) : null}

              <TouchableOpacity
                onPress={onRegister}
                disabled={!isFormValid || isLoading}
                activeOpacity={0.85}
                className="w-full h-12 rounded-[10px] items-center justify-center mt-12"
                style={{
                  backgroundColor:
                    !isFormValid || isLoading ? "#93CFC8" : "#00A996",
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white text-[16px] font-semibold">
                    Sign up
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
                Already have an account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
