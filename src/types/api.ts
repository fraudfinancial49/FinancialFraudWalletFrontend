export interface BalanceOut {
  account_id: string;
  amount: number;
  updated_at: string;
}

export interface CustomerStatusOut {
  is_blocked: boolean;
}

export interface CustomerTransactionOut {
  id: string;
  name_orig: string;
  name_dest: string;
  type: string;
  amount: number;
  routing_decision: string | null;
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
  honeypot_session_id?: string | null;
  individual_scores?: Record<string, number> | null;
  fusion_weights?: Record<string, number> | null;
  /** Present only in non-production when email delivery fails — auto-fills the OTP input */
  otp_debug?: string | null;
}
