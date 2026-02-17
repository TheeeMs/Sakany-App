export interface Event {
  id: string;
  title: string;
  host: string;
  description: string;
  image?: any;
  date: string;
  time: string;
  location: string;
  attendeesCount: number;
  maxAttendees: number;
  price: number;
  isJoined: boolean;
  isPast: boolean;
}

export type EventTabType = "upcoming" | "past";
