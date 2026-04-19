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
  | "Rejected"
  | "Cancelled"
  | "Pending";

export interface MaintenanceCategory {
  id: string;
  name: CategoryType;
  backendName: string;
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
  apiStatus?: string;
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
