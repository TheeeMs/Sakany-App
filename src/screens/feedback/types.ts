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

// Post status types for My Posts screen
export type PostStatus = "approved" | "under_review" | "not_approved";

// Status display config
export interface StatusConfig {
    label: string;
    backgroundColor: string;
    textColor: string;
    iconName: string;
}

// Admin response
export interface AdminResponse {
    message: string;
}

// My Post interface (for the My Posts screen)
export interface MyPost {
    id: string;
    title: string;
    category: FeedbackCategoryType;
    description: string;
    image?: any;
    status: PostStatus;
    adminResponse?: AdminResponse;
    upvotes: number;
    downvotes: number;
    views: number;
    date: string;
}
