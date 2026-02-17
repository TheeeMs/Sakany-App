import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
import type { PrivateFeedbackMessage } from "./types";

// Components
import { PrivateMessageCard } from "./components";

export default function PrivateFeedbackScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Sample Data
  const messages: PrivateFeedbackMessage[] = [
    {
      id: "1",
      title: "Noise Complaint - Unit 301",
      category: "security_safety",
      categoryLabel: "Security & Safety",
      status: "responded",
      timeAgo: "2d ago",
      userMessage:
        "There is excessive noise coming from Unit 301 late at night. The noise levels are disturbing other residents on the floor. Please address this issue.",
      adminResponse: {
        teamName: "Security Team",
        date: "Dec 8, 2024",
        message:
          "We have contacted the resident in Unit 301 about the noise complaints. Our security team will conduct periodic evening checks to ensure compliance.",
      },
    },
    {
      id: "2",
      title: "AC Unit Maintenance Request",
      category: "maintenance",
      categoryLabel: "Maintenance & Repairs",
      status: "responded",
      timeAgo: "5d ago",
      userMessage:
        "The AC unit in my apartment is making unusual sounds and not cooling properly. I would appreciate if someone could check it.",
      adminResponse: {
        teamName: "Maintenance Team",
        date: "Dec 6, 2024",
        message:
          "We have scheduled a maintenance visit for December 12th between 10 AM - 2 PM. Our technician will contact you before arriving.",
      },
    },
    {
      id: "3",
      title: "Billing Question",
      category: "other",
      categoryLabel: "Other",
      status: "pending",
      timeAgo: "1w ago",
      userMessage:
        "I noticed an additional charge on my last invoice that I don't recognize. Could you please clarify what this charge is for?",
      pendingResponse: {
        message: "We're reviewing your feedback and will respond soon",
      },
    },
  ];

  // Calculate stats
  const totalMessages = messages.length;
  const awaitingResponse = messages.filter(
    (m) => m.status === "pending",
  ).length;

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFC" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header / Top Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
          paddingHorizontal: 16,
          paddingTop: insets.top + 8,
          paddingBottom: 12,
          backgroundColor: "#FFFFFF",
          height: insets.top + 56,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 24,
            height: 24,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            fontSize: 20,
            fontWeight: "600",
            color: "#000000",
            textAlign: "center",
            lineHeight: 30,
          }}
        >
          Private Feedback
        </Text>
        <TouchableOpacity
          style={{
            width: 24,
            height: 24,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="list" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 40,
          gap: 16,
        }}
      >
        {/* Stats Bar — 2 cards */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Total Messages */}
          <View
            style={{
              backgroundColor: "#E7F7F7",
              borderRadius: 16,
              width: "48%",
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
              {totalMessages}
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
              Total Messages
            </Text>
          </View>

          {/* Awaiting Response */}
          <View
            style={{
              backgroundColor: "#E7F7F7",
              borderRadius: 16,
              width: "48%",
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
              {awaitingResponse}
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
              Awaiting Response
            </Text>
          </View>
        </View>

        {/* Message Cards */}
        {messages.map((message) => (
          <PrivateMessageCard key={message.id} message={message} />
        ))}

        {messages.length === 0 && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 60,
            }}
          >
            <Ionicons name="chatbubbles-outline" size={64} color="#D1D5DB" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#9CA3AF",
                marginTop: 16,
              }}
            >
              No private messages yet
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
