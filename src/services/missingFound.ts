import { api } from "./api";

// ─── Types matching the backend AlertController ────────────────────────────

export type AlertType = "MISSING" | "FOUND";
export type AlertCategory = "PET" | "ITEM" | "PERSON" | "VEHICLE" | "OTHER";
export type AlertStatus =
  | "ACTIVE"
  | "MATCHED"
  | "RESOLVED"
  | "CLOSED"
  | "REJECTED";

export interface Alert {
  id: string;
  reporterId: string;
  type: AlertType;
  category: AlertCategory;
  title: string;
  description: string;
  location: string;
  eventTime: string | null;
  photoUrls: string[];
  contactNumber: string;
  status: AlertStatus;
  isResolved: boolean;
  resolvedAt: string | null;
}

export interface CreateAlertPayload {
  type: AlertType;
  category: AlertCategory;
  title: string;
  description: string;
  location: string;
  eventTime?: string | null;
  photoUrls?: string[];
  contactNumber: string;
}

// ─── API Functions ──────────────────────────────────────────────────────────

/** Fetch all active alerts (missing + found) */
export async function getActiveAlerts(): Promise<Alert[]> {
  const { data } = await api.get<Alert[]>("/alerts");
  return data;
}

/** Fetch a single alert by ID */
export async function getAlertById(id: string): Promise<Alert> {
  const { data } = await api.get<Alert>(`/alerts/${id}`);
  return data;
}

/** Create a new missing/found report */
export async function createAlert(payload: CreateAlertPayload): Promise<string> {
  const { data } = await api.post<string>("/alerts", payload);
  return data;
}

/** Mark an alert as resolved */
export async function resolveAlert(id: string): Promise<void> {
  await api.patch(`/alerts/${id}/resolve`);
}
