// Tab types
export type TabType = "missing" | "found";

// Category types
export type CategoryType = "pet" | "item" | "person" | "vehicle" | "other";

// Missing/Found Item interface
export interface MissingFoundItem {
    id: string;
    type: TabType;
    category: CategoryType;
    title: string;
    description: string;
    location: string;
    locationDetail?: string;
    timeAgo: string;
    date?: string;
    image: any; // Image source
    ownerName: string;
    ownerPhone: string;
    ownerUnit?: string;
    ownerInitials?: string;
    isVerified?: boolean;
    reward?: string;
    isResolved?: boolean;
}

// Filter options
export interface FilterOptions {
    category: CategoryType | "all";
    dateRange: "today" | "week" | "month" | "all";
    location: string;
}
