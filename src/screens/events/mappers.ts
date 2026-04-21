import type { EventDto } from "../../services/events";
import type { Event } from "./types";

function isValidDate(value: string | null | undefined) {
  if (!value) {
    return false;
  }

  return !Number.isNaN(new Date(value).getTime());
}

function formatDate(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatTime(value: string) {
  const date = new Date(value);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function mapEventDtoToUi(dto: EventDto): Event {
  const hasStart = isValidDate(dto.startDate);
  const hasEnd = isValidDate(dto.endDate);

  const endTime = hasEnd ? new Date(dto.endDate).getTime() : null;
  const isPast = endTime !== null ? endTime < Date.now() : false;

  const dateLabel = hasStart ? formatDate(dto.startDate) : "Date TBD";
  const timeLabel =
    hasStart && hasEnd
      ? `${formatTime(dto.startDate)} - ${formatTime(dto.endDate)}`
      : hasStart
        ? formatTime(dto.startDate)
        : "Time TBD";

  return {
    id: dto.id,
    organizerId: dto.organizerId,
    title: dto.title?.trim() || "Untitled Event",
    hostName: dto.hostName?.trim() || "Community Team",
    description: dto.description?.trim() || "No description provided.",
    imageUrl: dto.imageUrl || null,
    dateLabel,
    timeLabel,
    location: dto.location?.trim() || "Location TBD",
    attendeesCount: Number.isFinite(dto.currentAttendees)
      ? dto.currentAttendees
      : 0,
    maxAttendees: dto.maxAttendees ?? null,
    price: dto.price ?? 0,
    isPast,
    startDate: dto.startDate,
    endDate: dto.endDate,
    category: dto.category || null,
    hostRole: dto.hostRole || null,
    contactPhone: dto.contactPhone || null,
    latitude: dto.latitude ?? null,
    longitude: dto.longitude ?? null,
    tags: dto.tags || null,
    recurringEvent: Boolean(dto.recurringEvent),
    status: dto.status,
    approvedBy: dto.approvedBy || null,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export function eventDateTimeSummary(event: Event) {
  if (!isValidDate(event.startDate)) {
    return "Time not available";
  }

  const startDate = new Date(event.startDate);
  return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${formatTime(event.startDate)}`;
}
