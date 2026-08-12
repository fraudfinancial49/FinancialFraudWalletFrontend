import React, { useEffect, useState } from "react";
import {
  History as HistoryIcon,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  ShieldAlert,
  Clock3,
} from "lucide-react";
import { getMyTransactions } from "@/api/client";
import type { CustomerTransactionOut } from "@/types/api";

export const History: React.FC = () => {
  const [rows, setRows] = useState<CustomerTransactionOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyTransactions()
      .then((data) => {
        // The backend returns the array directly, so we use 'data' instead of 'data.transactions'
        setRows(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setError("Failed to load transactions. The backend might be asleep or unreachable.");
      })
      .finally(() => setLoading(false));
  }, []);

  const statusBadge = (status: string) => {
    // Added optional chaining to prevent crashes if status is ever undefined
    const value = status?.toLowerCase() || "unknown";

    if (value.includes("approved")) {
      return (
        <span className="badge inline-flex items-center gap-1 rounded-full bg-risk-low/15 px-2 py-1 text-xs font-medium text-risk-low">
          <ShieldCheck className="h-3 w-3" />
          Approved
        </span>
      );
    }

    if (value.includes("otp") || value.includes("pending")) {
      return (
        <span className="badge inline-flex items-center gap-1 rounded-full bg-yellow-500/15 px-2 py-1 text-xs font-medium text-yellow-500">
          <Clock3 className="h-3 w-3" />
          OTP Required
        </span>
      );
    }

    if (value.includes("review")) {
      return (
        <span className="badge inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2 py-1 text-xs font-medium text-orange-500">
          <ShieldAlert className="h-3 w-3" />
          Review
        </span>
      );
    }

    if (value.includes("blocked") || value.includes("rejected") || value.includes("failed")) {
      return (
        <span className="badge inline-flex items-center gap-1 rounded-full bg-risk-high/15 px-2 py-1 text-xs font-medium text-risk-high">
          <ShieldAlert className="h-3 w-3" />
          Declined
        </span>
      );
    }

    return (
      <span className="badge inline-flex items-center gap-1 rounded-full bg-vault-700 px-2 py-1 text-xs font-medium text-slate-300">
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-vault-950 p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-50">
            <HistoryIcon className="h-8 w-8 text-accent-indigo" />
            Transaction History
          </h1>

          <p className="mt-2 text-slate-400">
            Review all your recent transfers and fraud protection decisions.
          </p>
        </div>

        <div className="panel overflow-hidden rounded-xl border border-vault-800 bg-vault-900 shadow-sm">
          <div className="panel-header flex items-center justify-between border-b border-vault-800 p-5">
            <h2 className="text-lg font-semibold text-slate-100">
              Recent Transactions
            </h2>

            <span className="badge rounded-full bg-accent-indigo/20 px-3 py-1 text-xs font-medium text-accent-indigo">
              {rows.length} Records
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400">
              Loading transactions...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400">
              {error}
            </div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No transactions found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-vault-950/50 text-slate-400">
                  <tr>
                    <th className="px-5 py-4 text-left font-medium">Date</th>
                    <th className="px-5 py-4 text-left font-medium">Direction</th>
                    <th className="px-5 py-4 text-left font-medium">Counterparty</th>
                    <th className="px-5 py-4 text-left font-medium">Type</th>
                    <th className="px-5 py-4 text-right font-medium">Amount</th>
                    <th className="px-5 py-4 text-center font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.transaction_id}
                      className="border-t border-vault-800 hover:bg-vault-800/50"
                    >
                      <td className="px-5 py-4 text-slate-300">
                        {new Date(r.timestamp).toLocaleString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {r.direction?.toLowerCase() === "debit" || r.direction?.toLowerCase() === "sent" ? (
                            <ArrowUpRight className="h-4 w-4 text-risk-high" />
                          ) : (
                            <ArrowDownLeft className="h-4 w-4 text-risk-low" />
                          )}

                          <span className="capitalize text-slate-300">
                            {r.direction || "Unknown"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {r.counterparty}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {r.type}
                      </td>

                      <td className="px-5 py-4 text-right font-semibold text-slate-100">
                        ${r.amount?.toFixed(2)}
                      </td>

                      <td className="px-5 py-4 text-center">
                        {statusBadge(r.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
