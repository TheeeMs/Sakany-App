import { api } from "./api";

export type EventStatus =
  | "PROPOSED"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED"
  | string;

export interface EventDto {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl: string | null;
  hostName: string;
  price: number | null;
  maxAttendees: number | null;
  category: string | null;
  hostRole: string | null;
  contactPhone: string | null;
  latitude: number | null;
  longitude: number | null;
  tags: string | null;
  recurringEvent: boolean;
  currentAttendees: number;
  status: EventStatus;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProposeEventPayload {
  organizerId?: string;
  title: string;
  description: string;
  location?: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  hostName: string;
  price?: number;
  maxAttendees?: number;
  category: string;
  hostRole?: string;
  contactPhone: string;
  latitude?: number;
  longitude?: number;
  tags?: string;
  recurringEvent?: boolean;
}

export async function getEvents(status?: EventStatus) {
  const { data } = await api.get<EventDto[]>("/events", {
    params: status ? { status } : undefined,
  });
  return data;
}

export async function getEventById(id: string) {
  const { data } = await api.get<EventDto>(`/events/${id}`);
  return data;
}

export async function createEvent(payload: ProposeEventPayload) {
  const { headers } = await api.post<void>("/events", payload);
  return headers?.location ?? null;
}

export async function registerForEvent(id: string, residentId?: string) {
  await api.post(`/events/${id}/register`, null, {
    params: residentId ? { residentId } : undefined,
  });
}

export async function cancelEventRegistration(id: string, residentId?: string) {
  await api.delete(`/events/${id}/register`, {
    params: residentId ? { residentId } : undefined,
  });
}

export async function approveEvent(id: string, adminId?: string) {
  await api.patch(`/events/${id}/approve`, null, {
    params: adminId ? { adminId } : undefined,
  });
}

export async function rejectEvent(id: string, adminId?: string) {
  await api.patch(`/events/${id}/reject`, null, {
    params: adminId ? { adminId } : undefined,
  });
}
