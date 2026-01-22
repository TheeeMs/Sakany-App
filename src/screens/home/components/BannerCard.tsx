import React from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { Banner } from "../types";

interface BannerCardProps {
  banner: Banner;
}

export default function BannerCard({ banner }: BannerCardProps) {
  return (
    <TouchableOpacity
      onPress={banner.onPress}
      className="mr-4 rounded-2xl overflow-hidden"
      style={{
        width: 300,
        height: 160,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      }}
      activeOpacity={0.9}
    >
      {banner.image ? (
        <ImageBackground
          source={
            typeof banner.image === "string"
              ? { uri: banner.image }
              : banner.image
          }
          className="flex-1 justify-end"
          resizeMode="cover"
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            className="p-4"
          >
            <Text className="text-white text-lg font-bold mb-1">
              {banner.title}
            </Text>
            <Text className="text-white/90 text-sm mb-3" numberOfLines={2}>
              {banner.description}
            </Text>
            {banner.buttonText && (
              <View className="self-end bg-white px-4 py-2 rounded-lg">
                <Text className="text-gray-900 text-xs font-semibold">
                  {banner.buttonText}
                </Text>
              </View>
            )}
          </LinearGradient>
        </ImageBackground>
      ) : (
        <LinearGradient
          colors={["#0D9488", "#14B8A6"]}
          className="flex-1 p-4 justify-end"
        >
          <Text className="text-white text-lg font-bold mb-1">
            {banner.title}
          </Text>
          <Text className="text-white/90 text-sm mb-3" numberOfLines={2}>
            {banner.description}
          </Text>
          {banner.buttonText && (
            <View className="self-end bg-white px-4 py-2 rounded-lg">
              <Text className="text-gray-900 text-xs font-semibold">
                {banner.buttonText}
              </Text>
            </View>
          )}
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
}
