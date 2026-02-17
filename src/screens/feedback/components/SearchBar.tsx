import React from "react";
import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search Suggestions",
}: SearchBarProps) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        height: 45,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        overflow: "hidden",
      }}
    >
      <Ionicons name="search" size={24} color="#999999" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999999"
        style={{
          flex: 1,
          fontSize: 14,
          fontWeight: "400",
          color: "#000000",
          marginLeft: 16,
          padding: 0,
        }}
      />
    </View>
  );
}
