import React, { useEffect, useState } from "react";
import {
  Wallet,
  CreditCard,
  ArrowUpRight,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { getMyBalance, getMyStatus } from "@/api/client";
import type { BalanceOut } from "@/types/api";

export const Balance: React.FC = () => {
  const [balance, setBalance] = useState<BalanceOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  // Retrieve the Account ID that was saved during login/registration
  const accountId = localStorage.getItem("customer_account_id") || "Unknown Account";

  const fetchBalance = () => {
    setLoading(true);
    setError(null);
    getMyBalance()
      .then(setBalance)
      .catch(() => setError("Unable to reach the backend. It may be waking up."))
      .finally(() => setLoading(false));
    // Independent of the balance fetch -- a failure here shouldn't block the
    // rest of the page, so it fails silently and just leaves isBlocked as-is.
    getMyStatus()
      .then((s) => setIsBlocked(s.is_blocked))
      .catch(() => {});
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(accountId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-vault-950 p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">
              Welcome Back
            </h1>
            
            {/* NEW: Account ID Display with Copy Button */}
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
              <span>Account ID: <strong className="font-mono text-slate-200">{accountId}</strong></span>
              <button 
                onClick={handleCopy} 
                className="rounded p-1 transition-colors hover:bg-vault-800 hover:text-slate-200"
                title="Copy Account ID"
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-risk-low" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button onClick={fetchBalance} disabled={loading} className="btn-secondary flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="panel p-8">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-accent-indigo/20 p-4">
              <Wallet className="h-8 w-8 text-accent-indigo" />
            </div>

            <div>
              <p className="text-sm uppercase tracking-wide text-slate-400">
                Available Balance
              </p>

              {loading ? (
                <p className="mt-2 text-lg text-slate-400">
                  Loading...
                </p>
              ) : error ? (
                <p className="mt-2 text-lg text-red-500">
                  {error}
                </p>
              ) : (
                <h2 className="mt-1 text-5xl font-bold text-slate-50">
                  $
                  {balance?.amount?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  }) ?? "0.00"}
                </h2>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="panel p-5">
            <CreditCard className="mb-4 h-7 w-7 text-accent-indigo" />

            <h3 className="text-lg font-semibold text-slate-100">
              Make Payment
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Send money securely with AI-powered fraud detection.
            </p>

            <button onClick={() => window.location.href='/pay'} className="btn-primary flex items-center mt-5 w-full justify-center gap-2">
              <ArrowUpRight className="h-4 w-4" />
              Send Money
            </button>
          </div>

          <div className="panel p-5">
            {isBlocked ? (
              <ShieldAlert className="mb-4 h-7 w-7 text-risk-high" />
            ) : (
              <ShieldCheck className="mb-4 h-7 w-7 text-risk-low" />
            )}

            <h3 className="text-lg font-semibold text-slate-100">
              Security Status
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              {isBlocked
                ? "Your account has been blocked. Contact support for assistance."
                : "AI Fraud Protection is active for your account."}
            </p>

            {isBlocked ? (
              <div className="badge inline-block mt-5 bg-risk-high/15 text-risk-high">
                Blocked
              </div>
            ) : (
              <div className="badge inline-block mt-5 bg-risk-low/15 text-risk-low">
                Protected
              </div>
            )}
          </div>

          <div className="panel p-5">
            <Wallet className="mb-4 h-7 w-7 text-accent-teal" />

            <h3 className="text-lg font-semibold text-slate-100">
              Account
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              View your recent transactions and account activity.
            </p>

            <button onClick={() => window.location.href='/history'} className="btn-secondary mt-5 w-full justify-center">
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
