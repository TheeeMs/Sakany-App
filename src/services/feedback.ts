import { api } from "./api";

// ─── Types matching backend ─────────────────────────────────────────────────

export type FeedbackType   = "SUGGESTION" | "COMPLAINT" | "COMPLIMENT";
export type FeedbackStatus = "OPEN" | "UNDER_REVIEW" | "ADDRESSED" | "APPROVED" | "CLOSED";
export type VoteType       = "UPVOTE" | "DOWNVOTE";

export interface FeedbackItem {
  id: string;
  authorId: string;
  title: string;
  content: string;
  type: FeedbackType;
  isPublic: boolean;
  status: FeedbackStatus;
  upvotes: number;
  downvotes: number;
  category: string;
  location: string | null;
  isAnonymous: boolean;
  adminResponse: string | null;
  imageUrl: string | null;
  viewCount: number;
  createdAt: string;
}

export interface MyFeedbackSummary {
  totalPosts: number;
  approvedPosts: number;
  totalVotes: number;
  posts: FeedbackItem[];
}

export interface SubmitFeedbackPayload {
  title: string;
  content: string;
  type: FeedbackType;
  isPublic: boolean;
  category: string;
  location?: string;
  isAnonymous: boolean;
  imageUrl?: string;
}

// ─── API Functions ──────────────────────────────────────────────────────────

/** GET /v1/feedback — all approved public posts */
export async function getPublicFeedback(): Promise<FeedbackItem[]> {
  const { data } = await api.get<FeedbackItem[]>("/feedback");
  return data;
}

/** GET /v1/feedback/me — my posts + summary stats */
export async function getMyFeedback(): Promise<MyFeedbackSummary> {
  const { data } = await api.get<MyFeedbackSummary>("/feedback/me");
  return data;
}

/** POST /v1/feedback — submit new feedback */
export async function submitFeedback(payload: SubmitFeedbackPayload): Promise<string> {
  const { data } = await api.post<string>("/feedback", payload);
  return data;
}

/** POST /v1/feedback/{id}/vote */
export async function voteFeedback(id: string, voteType: VoteType): Promise<void> {
  await api.post(`/feedback/${id}/vote`, { voteType });
}

// ─── Mapping helpers ────────────────────────────────────────────────────────

/** Map category display label → backend category string */
export function mapCategoryToBackend(label: string): string {
  const map: Record<string, string> = {
    "Security & Safety":    "SECURITY_SAFETY",
    "Amenities":            "AMENITIES",
    "Maintenance & Repairs":"MAINTENANCE",
    "Community":            "COMMUNITY",
    "Other":                "OTHER",
  };
  return map[label] ?? label.toUpperCase().replace(/\s+/g, "_");
}

/** Map backend category → display label */
export function mapCategoryToLabel(cat: string): string {
  const map: Record<string, string> = {
    SECURITY_SAFETY: "Security & Safety",
    AMENITIES:       "Amenities",
    MAINTENANCE:     "Maintenance",
    COMMUNITY:       "Community",
    OTHER:           "Other",
  };
  return map[cat] ?? cat;
}

/** Map backend status → frontend PostStatus */
export function mapStatus(status: FeedbackStatus): "approved" | "under_review" | "not_approved" {
  if (status === "APPROVED" || status === "OPEN" || status === "ADDRESSED") return "approved";
  if (status === "UNDER_REVIEW") return "under_review";
  return "not_approved"; // CLOSED
}

/** Format ISO date → "Dec 10, 2024" */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/** Format ISO date → relative time (e.g. "2h ago") */
export function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800)return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(iso);
}
