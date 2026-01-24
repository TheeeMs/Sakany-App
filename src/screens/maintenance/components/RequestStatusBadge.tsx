import { View, Text } from "react-native";
import type { RequestStatus } from "../types";

interface RequestStatusBadgeProps {
  status: RequestStatus;
}

const STATUS_CONFIG: Record<
  RequestStatus,
  { bg: string; text: string; textColor: string }
> = {
  "In Progress": {
    bg: "#DBEAFE",
    text: "In Progress",
    textColor: "#1E40AF",
  },
  Completed: {
    bg: "#D1FAE5",
    text: "Completed",
    textColor: "#065F46",
  },
  Cancelled: {
    bg: "#FEE2E2",
    text: "Cancelled",
    textColor: "#991B1B",
  },
  Pending: {
    bg: "#FEF3C7",
    text: "Pending",
    textColor: "#92400E",
  },
};

export default function RequestStatusBadge({
  status,
}: RequestStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <View
      className="px-3 py-1 rounded-full"
      style={{ backgroundColor: config.bg }}
    >
      <Text className="text-xs font-medium" style={{ color: config.textColor }}>
        {config.text}
      </Text>
    </View>
  );
}
