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

  useEffect(() => {
    getMyTransactions()
      .then((d) => setRows(d.transactions))
      .finally(() => setLoading(false));
  }, []);

  const statusBadge = (status: string) => {
    const value = status.toLowerCase();

    if (value.includes("approved")) {
      return (
        <span className="badge bg-risk-low/15 text-risk-low">
          <ShieldCheck className="h-3 w-3" />
          Approved
        </span>
      );
    }

    if (value.includes("otp")) {
      return (
        <span className="badge bg-yellow-500/15 text-yellow-400">
          <Clock3 className="h-3 w-3" />
          OTP Required
        </span>
      );
    }

    if (value.includes("review")) {
      return (
        <span className="badge bg-orange-500/15 text-orange-400">
          <ShieldAlert className="h-3 w-3" />
          Review
        </span>
      );
    }

    if (value.includes("blocked")) {
      return (
        <span className="badge bg-risk-high/15 text-risk-high">
          <ShieldAlert className="h-3 w-3" />
          Blocked
        </span>
      );
    }

    return (
      <span className="badge bg-vault-700 text-slate-300">
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

        <div className="panel overflow-hidden">
          <div className="panel-header">
            <h2 className="text-lg font-semibold text-slate-100">
              Recent Transactions
            </h2>

            <span className="badge bg-accent-indigo/20 text-accent-indigo">
              {rows.length} Records
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400">
              Loading transactions...
            </div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No transactions found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-vault-850 text-slate-400">
                  <tr>
                    <th className="px-5 py-4 text-left">Date</th>
                    <th className="px-5 py-4 text-left">Direction</th>
                    <th className="px-5 py-4 text-left">Counterparty</th>
                    <th className="px-5 py-4 text-left">Type</th>
                    <th className="px-5 py-4 text-right">Amount</th>
                    <th className="px-5 py-4 text-center">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.transaction_id}
                      className="border-t border-vault-700/60 hover:bg-vault-850/40"
                    >
                      <td className="px-5 py-4 text-slate-300">
                        {new Date(r.timestamp).toLocaleString()}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {r.direction.toLowerCase() === "debit" ? (
                            <ArrowUpRight className="h-4 w-4 text-risk-high" />
                          ) : (
                            <ArrowDownLeft className="h-4 w-4 text-risk-low" />
                          )}

                          <span className="text-slate-300">
                            {r.direction}
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
                        ${r.amount.toFixed(2)}
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