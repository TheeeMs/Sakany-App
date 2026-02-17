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

// Private Feedback message status
export type PrivateMessageStatus = "responded" | "pending";

// Private feedback category (extends beyond the standard categories)
export type PrivateFeedbackCategory =
    | "security_safety"
    | "maintenance"
    | "other";

// Admin response for private feedback
export interface PrivateAdminResponse {
    teamName: string;
    date: string;
    message: string;
}

// Pending response placeholder
export interface PendingResponse {
    message: string;
}

// Private feedback message
export interface PrivateFeedbackMessage {
    id: string;
    title: string;
    category: PrivateFeedbackCategory;
    categoryLabel: string;
    status: PrivateMessageStatus;
    timeAgo: string;
    userMessage: string;
    adminResponse?: PrivateAdminResponse;
    pendingResponse?: PendingResponse;
}
