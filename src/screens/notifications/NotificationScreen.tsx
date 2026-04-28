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
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
import type { NotificationFilterType, NotificationItem } from "./types";

// Components
import { NotificationCard } from "./components";

// API
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  mapToNotificationItem,
} from "../../services/notifications";

export default function NotificationScreen() {
  const navigation = useNavigation();
  const insets     = useSafeAreaInsets();

  const [activeFilter,  setActiveFilter]  = useState<NotificationFilterType>("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading,     setIsLoading]     = useState(true);
  const [isRefreshing,  setIsRefreshing]  = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchNotifications = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data.map(mapToNotificationItem));
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  // ── Mark single as read ────────────────────────────────────────────────────

  const handleMarkRead = useCallback(async (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await markNotificationRead(id);
    } catch {
      // revert on failure
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
      );
    }
  }, []);

  // ── Mark all as read ───────────────────────────────────────────────────────

  const handleMarkAllRead = useCallback(async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await markAllNotificationsRead();
    } catch {
      // re-fetch to restore real state
      fetchNotifications();
    }
  }, [fetchNotifications]);

  // ── Filter ─────────────────────────────────────────────────────────────────

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "urgent")   return n.isUrgent;
    if (activeFilter === "personal") return n.isPersonal;
    return true;
  });

  // ── Group by date ──────────────────────────────────────────────────────────

  const groupedNotifications = (() => {
    const groupMap = new Map<string, NotificationItem[]>();
    filteredNotifications.forEach((item) => {
      if (!groupMap.has(item.date)) groupMap.set(item.date, []);
      groupMap.get(item.date)!.push(item);
    });

    return Array.from(groupMap.entries()).map(([key, items]) => {
      let label = key;
      if (key === "today")     label = "Today";
      else if (key === "yesterday") label = "Yesterday";
      else {
        const d = new Date(key);
        label = d.toLocaleDateString("en-US", {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
        });
      }
      return { label, items };
    });
  })();

  // ── Counts for filter tabs ─────────────────────────────────────────────────

  const allCount      = notifications.length;
  const urgentCount   = notifications.filter((n) => n.isUrgent).length;
  const personalCount = notifications.filter((n) => n.isPersonal).length;
  const unreadCount   = notifications.filter((n) => !n.isRead).length;

  const filterTabs: { key: NotificationFilterType; label: string; count: number; iconName?: keyof typeof Ionicons.glyphMap }[] = [
    { key: "all",      label: "All",      count: allCount },
    { key: "urgent",   label: "Urgent",   count: urgentCount,   iconName: "warning-outline" },
    { key: "personal", label: "Personal", count: personalCount, iconName: "person-outline" },
  ];

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

        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ fontSize: 20, fontWeight: "600", color: "#000000", lineHeight: 30 }}>
            Notifications
          </Text>
          {unreadCount > 0 && (
            <View style={{ backgroundColor: "#EF4444", borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2, minWidth: 20, alignItems: "center" }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: "#FFFFFF" }}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "#00A996", lineHeight: 20 }}>
              Mark all read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#00A996" />
          <Text style={{ color: "#9CA3AF", marginTop: 12 }}>Loading notifications...</Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40, gap: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchNotifications(true)}
              tintColor="#00A996"
            />
          }
        >
          {/* Filter Tabs */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveFilter(tab.key)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 7,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 15,
                    backgroundColor: isActive ? "#00A996" : "#FFFFFF",
                    borderWidth: isActive ? 0 : 1,
                    borderColor: "#999999",
                  }}
                >
                  {tab.iconName && (
                    <Ionicons name={tab.iconName} size={16} color={isActive ? "#FFFFFF" : "#999999"} />
                  )}
                  <Text style={{ fontSize: 16, fontWeight: "500", color: isActive ? "#FFFFFF" : "#999999", lineHeight: 21 }}>
                    {tab.label} {tab.count}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Grouped Notifications */}
          {groupedNotifications.map((group) => (
            <View key={group.label} style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#101828", lineHeight: 20, paddingHorizontal: 4 }}>
                {group.label}
              </Text>
              <View style={{ gap: 4 }}>
                {group.items.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onPress={() => handleMarkRead(notification.id)}
                  />
                ))}
              </View>
            </View>
          ))}

          {/* Empty State */}
          {filteredNotifications.length === 0 && (
            <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 60 }}>
              <Ionicons name="notifications-off-outline" size={64} color="#D1D5DB" />
              <Text style={{ fontSize: 16, fontWeight: "500", color: "#9CA3AF", marginTop: 16 }}>
                No notifications found
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
