import React from "react";
import { View, Text } from "react-native";

interface StatsBarProps {
  totalPosts: number;
  approved: number;
  totalVotes: number;
}

export default function StatsBar({
  totalPosts,
  approved,
  totalVotes,
}: StatsBarProps) {
  const stats = [
    { value: totalPosts, label: "Total Posts" },
    { value: approved, label: "Approved" },
    { value: totalVotes, label: "Total Votes" },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {stats.map((stat, index) => (
        <View
          key={index}
          style={{
            backgroundColor: "#E7F7F7",
            borderRadius: 16,
            width: "31%",
            height: 72,
            paddingTop: 12,
            paddingHorizontal: 12,
            alignItems: "center",
            gap: 4,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "400",
              color: "#00A996",
              lineHeight: 28,
              textAlign: "center",
            }}
          >
            {stat.value}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "400",
              color: "#00A996",
              lineHeight: 16,
              textAlign: "center",
            }}
          >
            {stat.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
