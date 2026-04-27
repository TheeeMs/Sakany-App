import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
import type { TabType, MissingFoundItem } from "./types";

// Components
import { TabSwitch, MissingItemCard } from "./components";

// API
import {
  getActiveAlerts,
  type Alert as BackendAlert,
  type AlertCategory,
} from "../../services/missingFound";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/** Map backend Alert → frontend MissingFoundItem */
function mapAlertToItem(alert: BackendAlert): MissingFoundItem {
  const categoryMap: Record<AlertCategory, MissingFoundItem["category"]> = {
    PET: "pet",
    ITEM: "item",
    PERSON: "person",
    VEHICLE: "vehicle",
    OTHER: "other",
  };

  return {
    id: alert.id,
    type: alert.type === "MISSING" ? "missing" : "found",
    category: categoryMap[alert.category] ?? "other",
    title: alert.title,
    description: alert.description,
    location: alert.location,
    timeAgo: alert.eventTime
      ? new Date(alert.eventTime).toLocaleDateString("en-EG")
      : "—",
    image: require("../../../assets/build.png"),
    ownerName: "Reporter",
    ownerPhone: alert.contactNumber,
    isResolved: alert.isResolved,
  };
}

export default function MissingFoundScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<TabType>("missing");
  const [allItems, setAllItems] = useState<MissingFoundItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const alerts = await getActiveAlerts();
      setAllItems(alerts.map(mapAlertToItem));
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load reports";
      setError(msg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const displayItems = allItems.filter((item) => item.type === activeTab);

  const handleDetailsPress = (item: MissingFoundItem) => {
    navigation.navigate("ReportDetails", { item });
  };

  const handleFilterPress = () => {
    Alert.alert("Filter", "Filter options coming soon!");
  };

  const handleAddNew = () => {
    navigation.navigate("CreateReport" as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFC" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
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
          style={{ width: 24, height: 24, alignItems: "center", justifyContent: "center" }}
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
          Missing &amp; Found
        </Text>
        <TouchableOpacity
          onPress={() => fetchAlerts()}
          style={{ width: 24, height: 24, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="refresh-outline" size={22} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Tab Switch */}
      <View style={{ paddingTop: 8, paddingBottom: 4 }}>
        <TabSwitch activeTab={activeTab} onTabChange={setActiveTab} />
      </View>

      {/* Count + Filter */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#000000", lineHeight: 24 }}>
          {isLoading ? "..." : displayItems.length}{" "}
          {activeTab === "missing" ? "Missing" : "Found"} Reports
        </Text>
        <TouchableOpacity
          onPress={handleFilterPress}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            gap: 8,
            height: 37,
            width: 82,
          }}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="filter-variant" size={16} color="#666666" />
          <Text style={{ fontSize: 14, fontWeight: "500", color: "#666666" }}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {isLoading && (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#00A996" />
          <Text style={{ marginTop: 12, color: "#9CA3AF", fontSize: 14 }}>
            Loading reports...
          </Text>
        </View>
      )}

      {/* Error */}
      {!isLoading && error && (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
          <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#F87171" />
          <Text style={{ fontSize: 16, fontWeight: "500", color: "#374151", marginTop: 16, textAlign: "center" }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => fetchAlerts()}
            style={{ marginTop: 16, paddingHorizontal: 24, paddingVertical: 10, backgroundColor: "#00A996", borderRadius: 12 }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* List */}
      {!isLoading && !error && (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchAlerts(true)}
              tintColor="#00A996"
            />
          }
        >
          {displayItems.map((item) => (
            <MissingItemCard key={item.id} item={item} onDetailsPress={handleDetailsPress} />
          ))}

          {displayItems.length === 0 && (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 60 }}>
              <MaterialCommunityIcons
                name={activeTab === "missing" ? "alert-circle-outline" : "check-circle-outline"}
                size={64}
                color="#D1D5DB"
              />
              <Text style={{ fontSize: 16, fontWeight: "500", color: "#9CA3AF", marginTop: 16 }}>
                No {activeTab} reports yet
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* FAB */}
      <TouchableOpacity
        onPress={handleAddNew}
        style={{
          position: "absolute",
          bottom: 30,
          right: 16,
          width: 56,
          height: 56,
          borderRadius: 50,
          backgroundColor: "#00A996",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#00A996",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
