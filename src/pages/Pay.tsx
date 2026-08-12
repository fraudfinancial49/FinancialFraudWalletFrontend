import React, { useState } from "react";
import {
  Send,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  Clock3,
  Ban,
  Lock,
} from "lucide-react";
import { assessTransaction, verifyOtp } from "@/api/client";
import type { AssessResponse } from "@/types/api";

export const Pay: React.FC = () => {
  const [nameDest, setNameDest] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("TRANSFER");

  const [result, setResult] = useState<AssessResponse | null>(null);
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); // NEW: Dedicated error state
  const [loading, setLoading] = useState(false);

  async function submitPayment(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setStatus(null);
    setError(null); // NEW: Clear previous errors

    try {
      const res = await assessTransaction({
        nameDest,
        amount: Number(amount),
        type,
      });

      setResult(res);

      switch (res.routing_decision) {
        case "approve":
          setStatus("Payment approved successfully.");
          break;

        case "otp_verification":
          setStatus("OTP verification required.");
          break;

        case "manual_review":
          setStatus(
            "Your transaction has been sent for manual review."
          );
          break;

        case "auto_reject":
        case "blocked":
          setStatus(
            "Transaction blocked due to suspicious activity."
          );
          break;

        default:
          setStatus("Transaction submitted.");
      }
    } catch (err: any) {
      // NEW: Set the error state instead of the general status state
      setError(
        err?.response?.data?.detail ?? "Payment failed."
      );
    } finally {
      setLoading(false);
    }
  }

  async function submitOtp(e: React.FormEvent) {
    e.preventDefault();

    if (!result) return;

    setLoading(true);
    setError(null); // NEW: Clear errors on OTP submit

    try {
      await verifyOtp(result.transaction_id, otp);

      setStatus("OTP verified. Payment approved.");

      setResult(null);
      setOtp("");
    } catch (err: any) {
      // NEW: Set the error state for OTP failures
      setError(
        err?.response?.data?.detail ?? "Incorrect OTP."
      );
    } finally {
      setLoading(false);
    }
  }

  const decision = result?.routing_decision;

  const needsOtp = decision === "otp_verification";

  return (
    <div className="min-h-screen bg-vault-950 p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-50">
            <Send className="h-8 w-8 text-accent-indigo" />
            Send Money
          </h1>

          <p className="mt-2 text-slate-400">
            Every transfer is protected using AI-powered fraud
            detection.
          </p>
        </div>

        <div className="panel p-6">
          {!needsOtp ? (
            <form
              onSubmit={submitPayment}
              className="space-y-5"
            >
              <div>
                <label className="field-label">
                  Recipient Account
                </label>

                {/* NEW: Added conditional border color if there is an error */}
                <input
                  className={`input-field ${error ? "border-risk-high/50 focus:border-risk-high" : ""}`}
                  placeholder="Recipient Account ID"
                  value={nameDest}
                  onChange={(e) =>
                    setNameDest(e.target.value)
                  }
                  required
                />
              </div>

              <div>
                <label className="field-label">
                  Amount
                </label>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="input-field"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                  required
                />
              </div>

              <div>
                <label className="field-label">
                  Transaction Type
                </label>

                <select
                  className="input-field"
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value)
                  }
                >
                  <option value="TRANSFER">
                    Transfer
                  </option>

                  <option value="PAYMENT">
                    Payment
                  </option>

                  <option value="CASH_OUT">
                    Cash Out
                  </option>
                </select>
              </div>

              <button
                disabled={loading}
                className="btn-primary w-full justify-center"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}

                {loading
                  ? "Assessing Transaction..."
                  : "Continue"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={submitOtp}
              className="space-y-5"
            >
              <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Lock className="h-5 w-5" />

                  <span className="font-medium">
                    OTP Verification Required
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-300">
                  We've sent a one-time password to your
                  registered email address.
                </p>
              </div>

              <div>
                <label className="field-label">
                  One-Time Password
                </label>

                {/* NEW: Added conditional border color if there is an error */}
                <input
                  className={`input-field text-center text-lg tracking-[0.4em] ${error ? "border-risk-high/50 focus:border-risk-high" : ""}`}
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value)
                  }
                />
              </div>

              <button
                disabled={loading}
                className="btn-primary w-full justify-center"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}

                Verify OTP
              </button>
            </form>
          )}
        </div>

        {/* NEW: Dedicated Error Display Box */}
        {error && (
          <div className="panel border border-risk-high/30 bg-risk-high/10 p-5 shadow-sm shadow-risk-high/5">
            <div className="flex items-start gap-3">
              <Ban className="mt-0.5 h-6 w-6 text-risk-high shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-risk-high">
                  Transaction Failed
                </h3>
                <p className="mt-1 text-slate-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Updated: Only show general status if there is NO error */}
        {status && !error && (
          <div className="panel p-5">
            <div className="flex items-center gap-3">
              {decision === "approve" && (
                <ShieldCheck className="h-6 w-6 text-risk-low" />
              )}

              {decision === "otp_verification" && (
                <Clock3 className="h-6 w-6 text-yellow-400" />
              )}

              {decision === "honeypot" && (
                <ShieldAlert className="h-6 w-6 text-orange-400" />
              )}

              {decision === "auto_reject" && (
                <Ban className="h-6 w-6 text-risk-high" />
              )}

              <div>
                <h3 className="text-lg font-semibold text-slate-100">
                  Transaction Status
                </h3>

                <p className="mt-1 text-slate-400">
                  {status}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pay;
