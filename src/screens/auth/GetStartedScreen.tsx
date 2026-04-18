import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "GetStarted"
>;

export default function GetStartedScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 pb-8 justify-between">
        <View className="items-center mt-14">
          <View className="w-[280px] h-[220px] rounded-[24px] bg-[#E8FAF6] items-center justify-center relative">
            <View className="absolute -top-6 -right-5 w-[82px] h-[82px] rounded-full bg-[#CFF3EC]" />
            <View className="absolute -bottom-6 -left-6 w-[72px] h-[72px] rounded-full bg-[#DDF6F1]" />
            <MaterialCommunityIcons
              name="home-city-outline"
              size={108}
              color="#00A996"
            />
          </View>

          <View className="mt-14 w-[300px] items-center">
            <Text className="text-[24px] leading-[32px] font-bold text-[#00A996] text-center">
              Discover Your Compound Now
            </Text>
            <Text className="mt-6 text-[16px] leading-6 font-semibold text-[#9E9E9E] text-center">
              Explore all the existing job roles based on your interest and
              study major
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between gap-4 w-full">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Login")}
            className="flex-1 h-12 bg-[#00A996] rounded-[10px] items-center justify-center"
            style={{
              shadowColor: "#CBD6FF",
              shadowOpacity: 1,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 10 },
              elevation: 3,
            }}
          >
            <Text className="text-white text-[16px] leading-6 font-semibold">
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Register")}
            className="flex-1 h-12 bg-[#DDDDDD] rounded-[10px] items-center justify-center"
          >
            <Text className="text-[#0A0A0A] text-[16px] leading-6 font-semibold">
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
