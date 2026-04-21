export interface Event {
  id: string;
  organizerId: string;
  title: string;
  hostName: string;
  description: string;
  imageUrl: string | null;
  dateLabel: string;
  timeLabel: string;
  location: string;
  attendeesCount: number;
  maxAttendees: number | null;
  price: number;
  isPast: boolean;
  startDate: string;
  endDate: string;
  category: string | null;
  hostRole: string | null;
  contactPhone: string | null;
  latitude: number | null;
  longitude: number | null;
  tags: string | null;
  recurringEvent: boolean;
  status: string;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export type EventTabType = "upcoming" | "past";
