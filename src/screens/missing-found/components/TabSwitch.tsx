import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { TabType } from "../types";

interface TabSwitchProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabSwitch({ activeTab, onTabChange }: TabSwitchProps) {
  const isMissingActive = activeTab === "missing";
  const isFoundActive = activeTab === "found";

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        marginHorizontal: 16,
        marginBottom: 8,
      }}
    >
      {/* Missing Tab */}
      <TouchableOpacity
        onPress={() => onTabChange("missing")}
        style={{
          flex: 1,
          height: 46,
          borderRadius: 50,
          backgroundColor: isMissingActive ? "#FFE2E2" : "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isMissingActive ? 0 : 0.05,
          shadowRadius: isMissingActive ? 0 : 4,
          elevation: isMissingActive ? 0 : 2,
        }}
        activeOpacity={0.7}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            color: isMissingActive ? "#C10007" : "#666666",
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
          height: 46,
          borderRadius: 50,
          backgroundColor: isFoundActive ? "#E2F7ED" : "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isFoundActive ? 0 : 0.05,
          shadowRadius: isFoundActive ? 0 : 4,
          elevation: isFoundActive ? 0 : 2,
        }}
        activeOpacity={0.7}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            color: isFoundActive ? "#007A4D" : "#666666",
          }}
        >
          Found
        </Text>
      </TouchableOpacity>
    </View>
  );
}
