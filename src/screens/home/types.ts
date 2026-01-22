// Quick Action Types
export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  iconFamily: "Ionicons" | "MaterialCommunityIcons" | "Feather";
  backgroundColor: string;
  onPress: () => void;
}

// Recent Action Types
export type ActionStatus = "completed" | "paid" | "pending" | "cancelled";

export interface RecentAction {
  id: string;
  title: string;
  description: string;
  date: string;
  status: ActionStatus;
}

// Banner Types
export interface Banner {
  id: string;
  title: string;
  description: string;
  image?: string;
  buttonText?: string;
  onPress?: () => void;
}

// User Info Types
export interface UserInfo {
  name: string;
  building: string;
  unit: string;
}
