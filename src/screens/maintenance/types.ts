import { ImageSourcePropType } from "react-native";

export type RequestLocation = "At Home" | "Neighborhood";

export type CategoryType =
  | "Plumbing"
  | "Electrical"
  | "AC/Heating"
  | "Housekeeping"
  | "Painting"
  | "Carpentry"
  | "Garden"
  | "Aluminum"
  | "Other";

export type RequestStatus =
  | "In Progress"
  | "Completed"
  | "Cancelled"
  | "Pending";

export interface MaintenanceCategory {
  id: string;
  name: CategoryType;
  icon: string;
  backgroundColor: string;
  iconColor: string;
}

export interface MaintenanceRequest {
  id: string;
  title: string;
  category: CategoryType;
  description: string;
  location: RequestLocation;
  date: string;
  status: RequestStatus;
  technician?: string;
  photos?: string[];
}

export interface RequestFormData {
  title: string;
  description: string;
  category: CategoryType;
  location: RequestLocation;
  photos: string[];
}
