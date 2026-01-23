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
        borderRadius: 12,
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
          paddingVertical: 12,
          borderRadius: 10,
          backgroundColor: activeTab === "missing" ? "#FFFFFF" : "transparent",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: activeTab === "missing" ? "#000" : "transparent",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: activeTab === "missing" ? 0.1 : 0,
          shadowRadius: 2,
          elevation: activeTab === "missing" ? 2 : 0,
        }}
        activeOpacity={0.7}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: activeTab === "missing" ? "#F87171" : "#6B7280",
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
          paddingVertical: 12,
          borderRadius: 10,
          backgroundColor: activeTab === "found" ? "#FFFFFF" : "transparent",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: activeTab === "found" ? "#000" : "transparent",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: activeTab === "found" ? 0.1 : 0,
          shadowRadius: 2,
          elevation: activeTab === "found" ? 2 : 0,
        }}
        activeOpacity={0.7}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: activeTab === "found" ? "#6B7280" : "#6B7280",
          }}
        >
          Found
        </Text>
      </TouchableOpacity>
    </View>
  );
}
