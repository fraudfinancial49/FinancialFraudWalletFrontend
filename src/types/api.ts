export interface BalanceOut {
  account_id: string;
  balance: number;
  updated_at: string;
}

export interface CustomerTransactionOut {
  transaction_id: string;
  direction: "sent" | "received";
  counterparty: string;
  type: string;
  amount: number;
  routing_decision: string;
  status: string;
  timestamp: string;
}

export interface AssessResponse {
  transaction_id: string;
  final_risk_score: number;
  routing_decision: "approve" | "otp_verification" | "auto_reject" | "honeypot";
  message: string;
  vault_id?: string | null;
  auto_reject_id?: string | null;
}
