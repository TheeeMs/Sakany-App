// Visitor Types
export type VisitorType = "guest" | "delivery" | "service" | "family";

// Pass Types
export type PassType = "one-time" | "multiple";

// Active Pass Interface
export interface ActivePass {
    id: string;
    name: string;
    type: "Visitor" | "Delivery" | "Service" | "Family";
    usage: "Single use" | "Multiple use";
    validUntil: string;
}
