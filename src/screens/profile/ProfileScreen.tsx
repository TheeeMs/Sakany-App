import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// User profile data (in a real app this would come from API/store)
const userProfile = {
  name: "Ahmed Ali",
  building: "Building A",
  unit: "Unit 205",
  phone: "+20 123 456 7890",
  email: "ahmed.ali@email.com",
};

// Personal info row item
interface InfoRowProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

function InfoRow({ iconName, label, value }: InfoRowProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Ionicons name={iconName} size={20} color="#6A7282" />
      <View>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "400",
            color: "#6A7282",
            lineHeight: 16,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "400",
            color: "#101828",
            lineHeight: 20,
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

// Settings row item
interface SettingsRowProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  showBorder?: boolean;
}

function SettingsRow({
  iconName,
  title,
  subtitle,
  onPress,
  showBorder = true,
}: SettingsRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        ...(showBorder
          ? {
              borderBottomWidth: 1.71,
              borderBottomColor: "#E5E7EB",
            }
          : {}),
      }}
    >
      {/* Icon Container */}
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 16,
          backgroundColor: "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={iconName} size={20} color="#6A7282" />
      </View>

      {/* Text */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: "#101828",
            lineHeight: 20,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "500",
            color: "#6A7282",
            lineHeight: 16,
          }}
        >
          {subtitle}
        </Text>
      </View>

      {/* Chevron */}
      <Ionicons name="chevron-forward" size={20} color="#6A7282" />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => {} },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar barStyle="light-content" backgroundColor="#00A996" />

      {/* Teal Header Area */}
      <View
        style={{
          backgroundColor: "#00A996",
          paddingTop: insets.top,
          paddingHorizontal: 15,
          paddingBottom: 24,
          gap: 32,
        }}
      >
        {/* Top Row: Back + Title */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingTop: 8,
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
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "600",
              color: "#FFFFFF",
              lineHeight: 31,
            }}
          >
            Profile
          </Text>
        </View>

        {/* User Card */}
        <View
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: 16,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* Avatar */}
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="person-outline" size={32} color="#00A996" />
          </View>

          {/* User Info */}
          <View style={{ flex: 1, gap: 4 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#FFFFFF",
                lineHeight: 22,
              }}
            >
              {userProfile.name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: "rgba(255, 255, 255, 0.8)",
                lineHeight: 20,
              }}
            >
              {userProfile.building} - {userProfile.unit}
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: 40,
          gap: 24,
        }}
      >
        {/* Personal Information Section */}
        <View style={{ gap: 12 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#101828",
              lineHeight: 20,
            }}
          >
            Personal Information
          </Text>

          <View
            style={{
              backgroundColor: "#F8F8F8",
              borderRadius: 16,
              padding: 16,
              gap: 16,
            }}
          >
            <InfoRow
              iconName="call-outline"
              label="Phone Number"
              value={userProfile.phone}
            />
            <InfoRow
              iconName="mail-outline"
              label="Email"
              value={userProfile.email}
            />
            <InfoRow
              iconName="business-outline"
              label="Unit"
              value={`${userProfile.building} - ${userProfile.unit}`}
            />
          </View>
        </View>

        {/* Settings Section */}
        <View style={{ gap: 12 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#101828",
              lineHeight: 20,
            }}
          >
            Settings
          </Text>

          <View
            style={{
              backgroundColor: "#F8F8F8",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <SettingsRow
              iconName="notifications-outline"
              title="Notifications"
              subtitle="Manage notification preferences"
              onPress={() => {}}
              showBorder={true}
            />
            <SettingsRow
              iconName="shield-outline"
              title="Security"
              subtitle="Password and security settings"
              onPress={() => {}}
              showBorder={true}
            />
            <SettingsRow
              iconName="help-circle-outline"
              title="Help & Support"
              subtitle="Get help and contact support"
              onPress={() => {}}
              showBorder={false}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.7}
          style={{
            backgroundColor: "#FEF2F2",
            borderRadius: 16,
            height: 53,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#E7000B" />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "#E7000B",
              lineHeight: 21,
              textAlign: "center",
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
