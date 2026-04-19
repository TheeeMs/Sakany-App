import { api } from "./api";

export type MaintenanceApiStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "REJECTED"
  | "CANCELLED"
  | "ASSIGNED"
  | string;

export interface MaintenanceRequestApiItem {
  id: string;
  residentId?: string | null;
  unitId?: string | null;
  technicianId?: string | null;
  title?: string | null;
  description?: string | null;
  locationLabel?: string | null;
  category?: string | null;
  priority?: string | null;
  location?: string | null;
  status?: MaintenanceApiStatus | null;
  isPublic?: boolean;
  photoUrls?: string[];
  resolvedAt?: string | null;
  resolutionNotes?: string | null;
  resolutionCost?: number | null;
  technicianName?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface CreateMaintenanceRequestPayload {
  residentId: string;
  unitId?: string | null;
  title?: string;
  description: string;
  category: string;
  locationLabel: string;
  priority?: "LOW" | "NORMAL" | "URGENT" | "EMERGENCY";
  isPublic?: boolean;
  photoUrls?: string[];
}

export interface AssignMaintenanceRequestPayload {
  technicianId?: string;
  assigneeId?: string;
}

export async function createMaintenanceRequest(
  payload: CreateMaintenanceRequestPayload,
) {
  const { data } = await api.post<MaintenanceRequestApiItem>(
    "/maintenance-requests",
    payload,
  );
  return data;
}

export async function startMaintenanceRequest(id: string) {
  const { data } = await api.post<MaintenanceRequestApiItem>(
    `/maintenance-requests/${id}/start`,
  );
  return data;
}

export async function resolveMaintenanceRequest(id: string) {
  const { data } = await api.post<MaintenanceRequestApiItem>(
    `/maintenance-requests/${id}/resolve`,
  );
  return data;
}

export async function rejectMaintenanceRequest(id: string) {
  const { data } = await api.post<MaintenanceRequestApiItem>(
    `/maintenance-requests/${id}/reject`,
    { reason: "Rejected by resident" },
  );
  return data;
}

export async function cancelMaintenanceRequest(id: string) {
  const { data } = await api.post<MaintenanceRequestApiItem>(
    `/maintenance-requests/${id}/cancel`,
  );
  return data;
}

export async function assignMaintenanceRequest(
  id: string,
  payload: AssignMaintenanceRequestPayload,
) {
  const { data } = await api.post<MaintenanceRequestApiItem>(
    `/maintenance-requests/${id}/assign`,
    payload,
  );
  return data;
}

export async function getMaintenanceRequestById(id: string) {
  const { data } = await api.get<MaintenanceRequestApiItem>(
    `/maintenance-requests/${id}`,
  );
  return data;
}

export async function getMaintenanceRequestsByStatus(status: string) {
  const { data } = await api.get<MaintenanceRequestApiItem[]>(
    `/maintenance-requests/status/${status}`,
  );
  return data;
}

export async function getMaintenanceRequestsByResident(residentId: string) {
  const { data } = await api.get<MaintenanceRequestApiItem[]>(
    `/maintenance-requests/resident/${residentId}`,
  );
  return data;
}
