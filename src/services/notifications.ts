import { api } from "./api";
import type { NotificationItem, NotificationCategory } from "../screens/notifications/types";

// ─── Types matching backend ──────────────────────────────────────────────────

export type NotificationType   = "MAINTENANCE_UPDATE" | "PAYMENT_DUE" | "EVENT_REMINDER" | "ANNOUNCEMENT" | "ALERT" | "GENERAL";
export type NotificationStatus = "SENT" | "DELIVERED" | "READ" | "FAILED";
export type NotificationChannel= "IN_APP" | "PUSH" | "EMAIL";

export interface BackendNotification {
  id: string;
  recipientId: string;
  title: string;
  body: string;
  type: NotificationType;
  referenceId: string | null;
  channel: NotificationChannel;
  status: NotificationStatus;
  sentAt: string;
  readAt: string | null;
  failureReason: string | null;
  isUrgent: boolean;
}

// ─── API Functions ───────────────────────────────────────────────────────────

/** GET /v1/notifications — all notifications for current user */
export async function getNotifications(): Promise<BackendNotification[]> {
  const { data } = await api.get<BackendNotification[]>("/notifications");
  return data;
}

/** PATCH /v1/notifications/{id}/read — mark single as read */
export async function markNotificationRead(id: string): Promise<void> {
  await api.patch(`/notifications/${id}/read`);
}

/** PATCH /v1/notifications/read-all — mark all as read */
export async function markAllNotificationsRead(): Promise<void> {
  await api.patch("/notifications/read-all");
}

// ─── Mapping helpers ─────────────────────────────────────────────────────────

/** Map backend NotificationType → frontend NotificationCategory */
function mapCategory(type: NotificationType): NotificationCategory {
  switch (type) {
    case "MAINTENANCE_UPDATE": return "maintenance";
    case "PAYMENT_DUE":        return "payment";
    case "ANNOUNCEMENT":       return "announcement";
    case "ALERT":              return "announcement";
    case "EVENT_REMINDER":     return "general";
    case "GENERAL":            return "general";
    default:                   return "general";
  }
}

/** Format ISO date → grouping key ("today" | "yesterday" | ISO date) */
function getDateKey(iso: string): string {
  const date  = new Date(iso);
  const now   = new Date();

  const startOfToday     = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 86400000);

  if (date >= startOfToday)     return "today";
  if (date >= startOfYesterday) return "yesterday";

  // Return ISO date string for older dates
  return date.toISOString().split("T")[0];
}

/** Format ISO date → relative time (e.g. "2h ago") */
function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)    return "Just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800)return `${Math.floor(diff / 86400)} days ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Map backend notification → frontend NotificationItem */
export function mapToNotificationItem(n: BackendNotification): NotificationItem {
  return {
    id:          n.id,
    title:       n.title,
    description: n.body,
    timeAgo:     timeAgo(n.sentAt),
    category:    mapCategory(n.type),
    isRead:      n.status === "READ",
    isUrgent:    n.isUrgent,
    isPersonal:  n.channel === "IN_APP" && !n.isUrgent,
    date:        getDateKey(n.sentAt),
  };
}
