import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { FeedbackFilterType } from "../types";

interface FilterTabsProps {
  activeFilter: FeedbackFilterType;
  onFilterChange: (filter: FeedbackFilterType) => void;
}

const FILTERS: { label: string; value: FeedbackFilterType }[] = [
  { label: "All", value: "all" },
  { label: "Trending", value: "trending" },
  { label: "Recent", value: "recent" },
];

export default function FilterTabs({
  activeFilter,
  onFilterChange,
}: FilterTabsProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      }}
    >
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.value;
        return (
          <TouchableOpacity
            key={filter.value}
            onPress={() => onFilterChange(filter.value)}
            style={{
              backgroundColor: isActive ? "#00A996" : "#FFFFFF",
              borderRadius: 15,
              paddingHorizontal: 12,
              paddingVertical: 8,
              height: 37,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: isActive ? 0 : 1,
              borderColor: "#999999",
              minWidth: isActive ? 67 : undefined,
            }}
            activeOpacity={0.7}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: isActive ? "#FFFFFF" : "#999999",
                lineHeight: 21,
                textAlign: "center",
              }}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
