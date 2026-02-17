// Filter tab types
export type FeedbackFilterType = "all" | "trending" | "recent";

// Category types for feedback
export type FeedbackCategoryType =
    | "security_safety"
    | "amenities"
    | "maintenance"
    | "community"
    | "other";

// Category display config
export interface CategoryConfig {
    label: string;
    backgroundColor: string;
    textColor: string;
}

// Feedback post interface
export interface FeedbackPost {
    id: string;
    authorName: string;
    authorInitials?: string;
    authorLocation: string;
    timeAgo: string;
    isAnonymous?: boolean;
    title: string;
    category: FeedbackCategoryType;
    description: string;
    image?: any;
    votes: number;
    upvotes: number;
    downvotes: number;
    isBookmarked?: boolean;
    userVote?: "up" | "down" | null;
}
