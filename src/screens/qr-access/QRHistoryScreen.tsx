import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppBottomNav } from "../../components/navigation";
import { useCustomAlert } from "../../components/CustomAlert";

// API
import {
  getMyAccessCodes,
  revokeAccessCode,
  reactivateAccessCode,
  mapPurposeToType,
  mapStatusToDisplay,
  type AccessCode,
} from "../../services/qrAccess";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusType = "all" | "Active" | "Used" | "Expired";

interface HistoryItemData {
  id: string;
  name: string;
  type: string;
  date: string;
  status: "Active" | "Used" | "Expired";
  accessCode: string;
  usageCount?: number;
  _raw: AccessCode;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapAccessCodeToHistory(ac: AccessCode): HistoryItemData {
  const date = new Date(ac.validUntil);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const dateStr = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${hours}:${minutes} ${ampm}`;
  return {
    id: ac.id,
    name: ac.visitorName,
    type: mapPurposeToType(ac.purpose),
    date: dateStr,
    status: mapStatusToDisplay(ac.status),
    accessCode: ac.code,
    usageCount: ac.isSingleUse ? 1 : 2,
    _raw: ac,
  };
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "Expired": return { bg: "bg-red-50", text: "text-red-500", icon: "close-circle" as const, iconColor: "#EF4444" };
    case "Used":    return { bg: "bg-gray-100", text: "text-gray-500", icon: "checkmark-circle" as const, iconColor: "#6B7280" };
    case "Active":  return { bg: "bg-green-50", text: "text-green-500", icon: "checkmark-circle" as const, iconColor: "#10B981" };
    default:        return { bg: "bg-gray-100", text: "text-gray-500", icon: "ellipse" as const, iconColor: "#6B7280" };
  }
};

const getTypeConfig = (type: string) => {
  switch (type) {
    case "Visitor":  return { bg: "#E6F7F6", text: "#0D9488", icon: "person-outline" as const };
    case "Delivery": return { bg: "#FFF7ED", text: "#EA580C", icon: "cube-outline" as const };
    case "Service":  return { bg: "#EFF6FF", text: "#2563EB", icon: "construct-outline" as const };
    case "Family":   return { bg: "#F3E8FF", text: "#9333EA", icon: "people-outline" as const };
    default:         return { bg: "#F3F4F6", text: "#6B7280", icon: "person-outline" as const };
  }
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const FilterTab = ({ label, isSelected, onPress, count }: { label: string; isSelected: boolean; onPress: () => void; count: number }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-4 py-2 rounded-full mr-2 flex-row items-center ${isSelected ? "bg-[#0D9488]" : "bg-gray-100"}`}
    activeOpacity={0.7}
  >
    <Text className={`text-sm font-semibold ${isSelected ? "text-white" : "text-gray-600"}`}>{label}</Text>
    <View className={`ml-2 px-1.5 py-0.5 rounded-full ${isSelected ? "bg-white/20" : "bg-gray-200"}`}>
      <Text className={`text-xs font-bold ${isSelected ? "text-white" : "text-gray-500"}`}>{count}</Text>
    </View>
  </TouchableOpacity>
);

const HistoryItem = ({
  item,
  onReactivate,
  onDelete,
}: {
  item: HistoryItemData;
  onReactivate: (item: HistoryItemData) => void;
  onDelete: (item: HistoryItemData) => void;
}) => {
  const statusConfig = getStatusConfig(item.status);
  const typeConfig = getTypeConfig(item.type);

  return (
    <View
      className="bg-white rounded-3xl p-5 mb-4 border border-gray-100"
      style={{ shadowColor: "#0D9488", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 5 }}
    >
      <View className="flex-row">
        <View className="w-16 h-16 rounded-2xl items-center justify-center mr-4" style={{ overflow: "hidden" }}>
          <LinearGradient colors={["#0D9488", "#0F766E"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }} />
          <MaterialCommunityIcons name="qrcode" size={32} color="white" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900 mb-2" numberOfLines={1}>{item.name}</Text>
          <View className="flex-row flex-wrap gap-2 mb-2">
            <View className="flex-row items-center px-3 py-1 rounded-full" style={{ backgroundColor: typeConfig.bg }}>
              <Ionicons name={typeConfig.icon} size={12} color={typeConfig.text} />
              <Text className="text-xs font-semibold ml-1" style={{ color: typeConfig.text }}>{item.type}</Text>
            </View>
            <View className={`flex-row items-center px-3 py-1 rounded-full ${statusConfig.bg}`}>
              <Ionicons name={statusConfig.icon} size={12} color={statusConfig.iconColor} />
              <Text className={`text-xs font-semibold ml-1 ${statusConfig.text}`}>{item.status}</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={14} color="#9CA3AF" />
            <Text className="text-gray-400 text-xs ml-1 font-medium">{item.date}</Text>
          </View>
        </View>
      </View>

      <View className="bg-gray-50 rounded-2xl p-4 mt-4 mb-4">
        <Text className="text-xs text-gray-400 mb-1 font-medium">Access Code</Text>
        <Text className="text-base font-bold text-gray-800 tracking-wider">{item.accessCode}</Text>
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center py-3.5 rounded-xl"
          activeOpacity={0.8}
          onPress={() => onReactivate(item)}
          style={{ backgroundColor: "#0D9488" }}
        >
          <Ionicons name="refresh" size={18} color="white" />
          <Text className="text-white font-bold ml-2">Re-activate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-14 bg-red-50 items-center justify-center py-3.5 rounded-xl"
          activeOpacity={0.8}
          onPress={() => onDelete(item)}
        >
          <Feather name="trash-2" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const EmptyState = ({ filter }: { filter: StatusType }) => (
  <View className="items-center justify-center py-16">
    <View className="w-24 h-24 rounded-full items-center justify-center mb-6" style={{ backgroundColor: "#E6F7F6" }}>
      <MaterialCommunityIcons name="history" size={48} color="#0D9488" />
    </View>
    <Text className="text-xl font-bold text-gray-800 mb-2">No History Found</Text>
    <Text className="text-gray-500 text-center px-8 text-sm">
      {filter === "all"
        ? "Your QR code history will appear here once you create and use access passes."
        : `No ${filter.toLowerCase()} passes found in your history.`}
    </Text>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function QRHistoryScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const alert = useCustomAlert();

  const [selectedFilter, setSelectedFilter] = useState<StatusType>("all");
  const [historyData, setHistoryData] = useState<HistoryItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchHistory = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const codes = await getMyAccessCodes();
      setHistoryData(codes.map(mapAccessCodeToHistory));
    } catch {
      alert.show("Error", "Failed to load history. Pull down to retry.", [{ text: "OK" }], "warning");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const filteredData = selectedFilter === "all"
    ? historyData
    : historyData.filter((item) => item.status === selectedFilter);

  const counts = {
    all: historyData.length,
    Active: historyData.filter((i) => i.status === "Active").length,
    Used:   historyData.filter((i) => i.status === "Used").length,
    Expired: historyData.filter((i) => i.status === "Expired").length,
  };

  // ── Reactivate ──────────────────────────────────────────────────────────────
  const handleReactivate = (item: HistoryItemData) => {
    alert.show(
      "Re-activate Pass",
      `Re-activate the pass for ${item.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Re-activate",
          onPress: async () => {
            try {
              const validFrom  = new Date().toISOString();
              const validUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
              const newCode = await reactivateAccessCode(item.id, validFrom, validUntil);
              setHistoryData((prev) => [
                mapAccessCodeToHistory(newCode),
                ...prev.filter((i) => i.id !== item.id),
              ]);
              alert.show("Success", "Pass has been re-activated!", [{ text: "OK" }], "success");
            } catch {
              alert.show("Error", "Failed to re-activate pass.", [{ text: "OK" }], "warning");
            }
          },
        },
      ],
      "info"
    );
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = (item: HistoryItemData) => {
    alert.show(
      "Delete Pass",
      `Delete pass for ${item.name}? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await revokeAccessCode(item.id);
              setHistoryData((prev) => prev.filter((i) => i.id !== item.id));
            } catch {
              alert.show("Error", "Failed to delete pass.", [{ text: "OK" }], "warning");
            }
          },
        },
      ],
      "danger"
    );
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View className="px-4 pb-4" style={{ paddingTop: insets.top + 12 }}>
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center" activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => fetchHistory()} className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center" activeOpacity={0.7}>
            <Ionicons name="refresh-outline" size={22} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mb-4">
          <View className="w-14 h-14 rounded-2xl items-center justify-center mr-4" style={{ overflow: "hidden" }}>
            <LinearGradient colors={["#0D9488", "#0F766E"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }} />
            <MaterialCommunityIcons name="history" size={28} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">QR History</Text>
            <Text className="text-gray-500 text-sm mt-0.5">View and manage your past access passes</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          {(["all", "Active", "Used", "Expired"] as StatusType[]).map((f) => (
            <FilterTab key={f} label={f === "all" ? "All" : f} isSelected={selectedFilter === f} onPress={() => setSelectedFilter(f)} count={counts[f]} />
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#0D9488" />
          <Text style={{ color: "#9CA3AF", marginTop: 12 }}>Loading history...</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => fetchHistory(true)} tintColor="#0D9488" />}
        >
          {filteredData.length > 0
            ? filteredData.map((item) => (
                <HistoryItem key={item.id} item={item} onReactivate={handleReactivate} onDelete={handleDelete} />
              ))
            : <EmptyState filter={selectedFilter} />
          }
        </ScrollView>
      )}

      <AppBottomNav />

      {/* Custom Alert — must be last to render on top */}
      <alert.Component />
    </View>
  );
}
