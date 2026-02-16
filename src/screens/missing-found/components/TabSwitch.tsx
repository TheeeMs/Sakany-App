import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { TabType } from "../types";

interface TabSwitchProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabSwitch({ activeTab, onTabChange }: TabSwitchProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#F3F4F6",
        borderRadius: 25,
        padding: 4,
        marginHorizontal: 16,
        marginBottom: 16,
      }}
    >
      {/* Missing Tab */}
      <TouchableOpacity
        onPress={() => onTabChange("missing")}
        style={{
          flex: 1,
          paddingVertical: 10,
          borderRadius: 22,
          backgroundColor: activeTab === "missing" ? "#FEE2E2" : "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
        activeOpacity={0.7}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: activeTab === "missing" ? "#EF4444" : "#6B7280",
          }}
        >
          Missing
        </Text>
      </TouchableOpacity>

      {/* Found Tab */}
      <TouchableOpacity
        onPress={() => onTabChange("found")}
        style={{
          flex: 1,
          paddingVertical: 10,
          borderRadius: 22,
          backgroundColor: activeTab === "found" ? "#0D9488" : "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
        activeOpacity={0.7}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: activeTab === "found" ? "#FFFFFF" : "#6B7280",
          }}
        >
          Found
        </Text>
      </TouchableOpacity>
    </View>
  );
}
