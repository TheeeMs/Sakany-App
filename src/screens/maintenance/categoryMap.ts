import type { CategoryType, MaintenanceCategory } from "./types";

export const MAINTENANCE_CATEGORIES: MaintenanceCategory[] = [
  {
    id: "1",
    name: "Plumbing",
    backendName: "PLUMBING",
    icon: "water-outline",
    backgroundColor: "#C7F5F3",
    iconColor: "#0D9488",
  },
  {
    id: "2",
    name: "Electrical",
    backendName: "ELECTRICAL",
    icon: "flash-outline",
    backgroundColor: "#C7F5F3",
    iconColor: "#0D9488",
  },
  {
    id: "3",
    name: "AC/Heating",
    backendName: "AC_HEATING",
    icon: "air",
    backgroundColor: "#C7F5F3",
    iconColor: "#0D9488",
  },
  {
    id: "4",
    name: "Housekeeping",
    backendName: "HOUSEKEEPING",
    icon: "star-four-points-outline",
    backgroundColor: "#C7F5F3",
    iconColor: "#0D9488",
  },
  {
    id: "5",
    name: "Painting",
    backendName: "PAINTING",
    icon: "brush-outline",
    backgroundColor: "#C7F5F3",
    iconColor: "#0D9488",
  },
  {
    id: "6",
    name: "Carpentry",
    backendName: "CARPENTRY",
    icon: "hammer-outline",
    backgroundColor: "#C7F5F3",
    iconColor: "#0D9488",
  },
  {
    id: "7",
    name: "Garden",
    backendName: "GARDEN",
    icon: "flower-outline",
    backgroundColor: "#C7F5F3",
    iconColor: "#0D9488",
  },
  {
    id: "8",
    name: "Aluminum",
    backendName: "ALUMINUM",
    icon: "cube-outline",
    backgroundColor: "#C7F5F3",
    iconColor: "#0D9488",
  },
  {
    id: "9",
    name: "Other",
    backendName: "OTHER",
    icon: "help-circle-outline",
    backgroundColor: "#C7F5F3",
    iconColor: "#0D9488",
  },
];

export function mapCategoryToBackend(category: CategoryType): string {
  return (
    MAINTENANCE_CATEGORIES.find((item) => item.name === category)
      ?.backendName || "OTHER"
  );
}
