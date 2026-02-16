export type PaymentStatus = "Pending" | "Paid" | "Overdue" | "Cancelled";

export type PaymentType =
  | "Monthly Fee"
  | "Maintenance Charge"
  | "Security Deposit"
  | "Water Bill"
  | "Electricity Bill"
  | "Internet"
  | "Parking"
  | "Other";

export interface Payment {
  id: string;
  title: string;
  type: PaymentType;
  description: string;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  isPaid?: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  type: PaymentType;
  description: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  paymentMethod?: string;
}

export interface PaymentStats {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  thisMonth: number;
}
