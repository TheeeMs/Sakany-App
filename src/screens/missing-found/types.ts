// Tab types
export type TabType = "missing" | "found";

// Category types
export type CategoryType = "pet" | "item" | "person" | "other";

// Missing/Found Item interface
export interface MissingFoundItem {
    id: string;
    type: TabType;
    category: CategoryType;
    title: string;
    description: string;
    location: string;
    timeAgo: string;
    image: any; // Image source
    ownerName: string;
    ownerPhone: string;
    reward?: string;
    isResolved?: boolean;
}

// Filter options
export interface FilterOptions {
    category: CategoryType | "all";
    dateRange: "today" | "week" | "month" | "all";
    location: string;
}
