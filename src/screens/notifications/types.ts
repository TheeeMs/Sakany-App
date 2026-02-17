// Filter tab types
export type NotificationFilterType = "all" | "urgent" | "personal";

// Notification category types
export type NotificationCategory =
    | "maintenance"
    | "announcement"
    | "payment"
    | "achievement"
    | "missing"
    | "reading"
    | "general";

// Category display config (icon background + icon)
export interface NotificationCategoryConfig {
    iconName: string;
    iconColor: string;
    backgroundColor: string;
}

// Notification item interface
export interface NotificationItem {
    id: string;
    title: string;
    description: string;
    timeAgo: string;
    category: NotificationCategory;
    isRead: boolean;
    isUrgent?: boolean;
    isPersonal?: boolean;
    date: string; // grouping key: "today" | "yesterday" | ISO date string
}
