import React, { useEffect, useState } from "react";
import {
  Wallet,
  CreditCard,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { getMyBalance } from "@/api/client";
import type { BalanceOut } from "@/types/api";

export const Balance: React.FC = () => {
  const [balance, setBalance] = useState<BalanceOut | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBalance().then(setBalance).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-vault-950 p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">
              Welcome Back
            </h1>

            <p className="mt-1 text-slate-400">
              View your balance and securely manage your account.
            </p>
          </div>

          <button className="btn-secondary">
            <RefreshCw className="h-4 w-4" />
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
              ) : (
                <h2 className="mt-1 text-5xl font-bold text-slate-50">
                  $
                  {balance?.balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
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

            <button className="btn-primary mt-5 w-full justify-center">
              <ArrowUpRight className="h-4 w-4" />
              Send Money
            </button>
          </div>

          <div className="panel p-5">
            <ShieldCheck className="mb-4 h-7 w-7 text-risk-low" />

            <h3 className="text-lg font-semibold text-slate-100">
              Security Status
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              AI Fraud Protection is active for your account.
            </p>

            <div className="badge mt-5 bg-risk-low/15 text-risk-low">
              Protected
            </div>
          </div>

          <div className="panel p-5">
            <Wallet className="mb-4 h-7 w-7 text-accent-teal" />

            <h3 className="text-lg font-semibold text-slate-100">
              Account
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              View your recent transactions and account activity.
            </p>

            <button className="btn-secondary mt-5 w-full justify-center">
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};