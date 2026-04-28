import { api } from "./api";

// ─── Types matching backend ─────────────────────────────────────────────────

export type VisitPurpose = "GUEST" | "DELIVERY" | "SERVICE" | "FAMILY" | "OTHER";
export type AccessCodeStatus = "ACTIVE" | "USED" | "EXPIRED" | "REVOKED";

export interface AccessCode {
  id: string;
  residentId: string;
  visitorName: string;
  visitorPhone: string | null;
  purpose: VisitPurpose;
  code: string;
  qrData: string;
  isSingleUse: boolean;
  validFrom: string;
  validUntil: string;
  status: AccessCodeStatus;
  usedAt: string | null;
}

export interface CreateAccessCodePayload {
  visitorName: string;
  visitorPhone?: string;
  purpose: VisitPurpose;
  isSingleUse: boolean;
  validFrom: string;   // ISO 8601
  validUntil: string;  // ISO 8601
}

export interface VisitLog {
  id: string;
  accessCodeId: string;
  residentId: string;
  visitorName: string;
  entryTime: string;
  exitTime: string | null;
  gateNumber: string | null;
}

// ─── API Functions ──────────────────────────────────────────────────────────

/** Create a new QR access code */
export async function createAccessCode(payload: CreateAccessCodePayload): Promise<AccessCode> {
  const { data } = await api.post<AccessCode>("/access/codes", payload);
  return data;
}

/** Get all my active access codes */
export async function getMyAccessCodes(): Promise<AccessCode[]> {
  const { data } = await api.get<AccessCode[]>("/access/codes/my");
  return data;
}

/** Get a single access code by ID */
export async function getAccessCode(id: string): Promise<AccessCode> {
  const { data } = await api.get<AccessCode>(`/access/codes/${id}`);
  return data;
}

/** Revoke (delete) an access code */
export async function revokeAccessCode(id: string): Promise<void> {
  await api.delete(`/access/codes/${id}`);
}

/** Reactivate an expired/used access code with new validity window */
export async function reactivateAccessCode(
  codeId: string,
  validFrom: string,
  validUntil: string
): Promise<AccessCode> {
  const { data } = await api.post<AccessCode>(`/access/codes/${codeId}/reactivate`, {
    validFrom,
    validUntil,
  });
  return data;
}

/** Get my visit logs (entry/exit history) */
export async function getMyVisitLogs(): Promise<VisitLog[]> {
  const { data } = await api.get<VisitLog[]>("/access/visit-logs");
  return data;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Map frontend VisitorType → backend VisitPurpose */
export function mapVisitorTypeToPurpose(
  type: "guest" | "delivery" | "service" | "family"
): VisitPurpose {
  const map: Record<string, VisitPurpose> = {
    guest: "GUEST",
    delivery: "DELIVERY",
    service: "SERVICE",
    family: "FAMILY",
  };
  return map[type] ?? "OTHER";
}

/** Map backend AccessCodeStatus → frontend display status */
export function mapStatusToDisplay(
  status: AccessCodeStatus
): "Active" | "Used" | "Expired" {
  if (status === "ACTIVE") return "Active";
  if (status === "USED") return "Used";
  return "Expired"; // EXPIRED | REVOKED
}

/** Map backend VisitPurpose → display type label */
export function mapPurposeToType(purpose: VisitPurpose): string {
  const map: Record<VisitPurpose, string> = {
    GUEST: "Visitor",
    DELIVERY: "Delivery",
    SERVICE: "Service",
    FAMILY: "Family",
    OTHER: "Other",
  };
  return map[purpose];
}
