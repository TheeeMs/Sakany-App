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
import { useAuthStore } from "../../store/authStore";
import type { RootStackParamList } from "../../navigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const loginWithEmailPassword = useAuthStore(
    (state) => state.loginWithEmailPassword,
  );

  const isFormValid = useMemo(
    () => email.trim().length > 3 && password.trim().length > 3,
    [email, password],
  );

  const onLogin = async () => {
    if (!isFormValid || isLoading) {
      return;
    }

    clearError();

    try {
      await loginWithEmailPassword(email.trim(), password);
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
            justifyContent: "center",
            paddingHorizontal: 16,
            paddingTop: 36,
            paddingBottom: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center">
            <View className="w-[161px] items-center">
              <Text className="text-[24px] font-bold text-[#00A996] text-center">
                Login here
              </Text>
              <Text className="mt-5 text-[16px] leading-6 font-semibold text-[#212121] text-center">
                Welcome back!
              </Text>
            </View>

            <View className="w-full mt-14">
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

              <View className="mt-6">
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
                <TouchableOpacity activeOpacity={0.8} className="self-end mt-2">
                  <Text className="text-[14px] text-[#9E9E9E]">
                    Forgot your password?
                  </Text>
                </TouchableOpacity>
              </View>

              {error ? (
                <Text className="text-[#DC2626] text-[13px] mt-3">{error}</Text>
              ) : null}

              <TouchableOpacity
                onPress={onLogin}
                disabled={!isFormValid || isLoading}
                activeOpacity={0.85}
                className="w-full h-12 rounded-[10px] items-center justify-center mt-5"
                style={{
                  backgroundColor:
                    !isFormValid || isLoading ? "#93CFC8" : "#00A996",
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white text-[16px] font-semibold">
                    Sign in
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate("Register")}
              className="w-full h-12 rounded-[10px] items-center justify-center mt-8"
            >
              <Text className="text-[#9E9E9E] text-[14px]">
                Create new account
              </Text>
            </TouchableOpacity>

         
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
