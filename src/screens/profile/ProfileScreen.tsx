import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/authStore";
import { useCustomAlert } from "../../components/CustomAlert";
import { api } from "../../services/api";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ResidentProfile {
  unitNumber: string;
  buildingName: string;
  floor: number;
  residentType: string;
  moveInDate: string | null;
  monthlyFee: number | null;
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

interface InfoRowProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

function InfoRow({ iconName, label, value }: InfoRowProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <Ionicons name={iconName} size={20} color="#6A7282" />
      <View>
        <Text style={{ fontSize: 12, fontWeight: "400", color: "#6A7282", lineHeight: 16 }}>
          {label}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: "400", color: "#101828", lineHeight: 20 }}>
          {value}
        </Text>
      </View>
    </View>
  );
}

interface SettingsRowProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  showBorder?: boolean;
}

function SettingsRow({ iconName, title, subtitle, onPress, showBorder = true }: SettingsRowProps) {
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
        ...(showBorder ? { borderBottomWidth: 1.71, borderBottomColor: "#E5E7EB" } : {}),
      }}
    >
      <View style={{ width: 40, height: 40, borderRadius: 16, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" }}>
        <Ionicons name={iconName} size={20} color="#6A7282" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: "500", color: "#101828", lineHeight: 20 }}>{title}</Text>
        <Text style={{ fontSize: 12, fontWeight: "500", color: "#6A7282", lineHeight: 16 }}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6A7282" />
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets     = useAuthStore((state) => state);
  const user       = useAuthStore((state) => state.user);
  const logout     = useAuthStore((state) => state.logout);
  const safeInsets = useSafeAreaInsets();
  const alert      = useCustomAlert();

  const [profile,    setProfile]    = useState<ResidentProfile | null>(null);
  const [isLoading,  setIsLoading]  = useState(true);

  // ── Fetch resident profile ─────────────────────────────────────────────────

  useEffect(() => {
    if (!user?.id) { setIsLoading(false); return; }

    const fetchProfile = async () => {
      try {
        // GET /v1/admin/residents/{id}/card — returns unit + building info
        const { data } = await api.get(`/admin/residents/${user.id}/card`);
        setProfile({
          unitNumber:   data.unitNumber   ?? data.unit      ?? "-",
          buildingName: data.buildingName ?? data.building  ?? "-",
          floor:        data.floor        ?? 0,
          residentType: data.residentType ?? data.type      ?? "RESIDENT",
          moveInDate:   data.moveInDate   ?? null,
          monthlyFee:   data.monthlyFee   ?? null,
        });
      } catch {
        // silently fail — unit info will show "-"
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  // ── Derived values ─────────────────────────────────────────────────────────

  const fullName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : "Resident";

  const phone = user?.phoneNumber ?? "-";
  const email = user?.email       ?? "-";

  const unitDisplay = profile
    ? `${profile.buildingName} - Unit ${profile.unitNumber}`
    : "Loading...";

  const initials = (user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "");

  // ── Logout confirm ─────────────────────────────────────────────────────────

  const handleLogout = () => {
    alert.show(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => logout() },
      ],
      "danger"
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar barStyle="light-content" backgroundColor="#00A996" />

      {/* Teal Header */}
      <View style={{ backgroundColor: "#00A996", paddingTop: safeInsets.top, paddingHorizontal: 15, paddingBottom: 24, gap: 32 }}>
        {/* Top Row */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 8 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ width: 24, height: 24, alignItems: "center", justifyContent: "center" }}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: "600", color: "#FFFFFF", lineHeight: 31 }}>
            Profile
          </Text>
        </View>

        {/* User Card */}
        <View style={{ backgroundColor: "rgba(255, 255, 255, 0.2)", borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 16 }}>
          {/* Avatar */}
          <View style={{ width: 64, height: 64, borderRadius: 999, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" }}>
            {initials ? (
              <Text style={{ fontSize: 22, fontWeight: "700", color: "#00A996" }}>{initials}</Text>
            ) : (
              <Ionicons name="person-outline" size={32} color="#00A996" />
            )}
          </View>

          {/* Info */}
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#FFFFFF", lineHeight: 22 }}>
              {fullName}
            </Text>
            {isLoading ? (
              <ActivityIndicator size="small" color="rgba(255,255,255,0.7)" />
            ) : (
              <Text style={{ fontSize: 14, fontWeight: "400", color: "rgba(255, 255, 255, 0.8)", lineHeight: 20 }}>
                {profile
                  ? `${profile.buildingName} · Unit ${profile.unitNumber}`
                  : "Unit info unavailable"}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40, gap: 24 }}
      >
        {/* Personal Information */}
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#101828", lineHeight: 20 }}>
            Personal Information
          </Text>

          <View style={{ backgroundColor: "#F8F8F8", borderRadius: 16, padding: 16, gap: 16 }}>
            <InfoRow iconName="call-outline"     label="Phone Number" value={phone} />
            <InfoRow iconName="mail-outline"     label="Email"        value={email || "-"} />
            <InfoRow iconName="business-outline" label="Unit"         value={isLoading ? "Loading..." : unitDisplay} />
            {profile?.residentType && (
              <InfoRow iconName="person-circle-outline" label="Resident Type" value={profile.residentType} />
            )}
            {profile?.moveInDate && (
              <InfoRow
                iconName="calendar-outline"
                label="Move-in Date"
                value={new Date(profile.moveInDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              />
            )}
            {profile?.monthlyFee != null && (
              <InfoRow iconName="cash-outline" label="Monthly Fee" value={`${profile.monthlyFee.toLocaleString()} EGP`} />
            )}
          </View>
        </View>

        {/* Settings */}
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#101828", lineHeight: 20 }}>Settings</Text>

          <View style={{ backgroundColor: "#F8F8F8", borderRadius: 16, overflow: "hidden" }}>
            <SettingsRow
              iconName="notifications-outline"
              title="Notifications"
              subtitle="Manage notification preferences"
              onPress={() => navigation.navigate("Notifications")}
              showBorder
            />
            <SettingsRow
              iconName="shield-outline"
              title="Security"
              subtitle="Password and security settings"
              onPress={() =>
                alert.show(
                  "Security",
                  "Your account is secured with OTP-based phone verification.\n\nTo change your phone number or request account deactivation, please contact the building admin.",
                  [{ text: "Got it" }],
                  "info"
                )
              }
              showBorder
            />
            <SettingsRow
              iconName="help-circle-outline"
              title="Help & Support"
              subtitle="Get help and contact support"
              onPress={() =>
                alert.show(
                  "Help & Support",
                  "Need assistance? Contact your building management team directly, or reach us at:\n\nsupport@sakany.app",
                  [
                    { text: "Send Email", onPress: () => Linking.openURL("mailto:support@sakany.app") },
                    { text: "Close", style: "cancel" },
                  ],
                  "info"
                )
              }
              showBorder={false}
            />
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.7}
          style={{ backgroundColor: "#FEF2F2", borderRadius: 16, height: 53, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <Ionicons name="log-out-outline" size={20} color="#E7000B" />
          <Text style={{ fontSize: 16, fontWeight: "500", color: "#E7000B", lineHeight: 21, textAlign: "center" }}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <alert.Component />
    </View>
  );
}
