import React from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { Wallet, Send, History as HistoryIcon, LogOut } from "lucide-react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { TelemetryProvider } from "@/context/TelemetryContext";
import { Login } from "@/pages/Login";
import { Pay } from "@/pages/Pay";
import { Balance } from "@/pages/Balance";
import { History } from "@/pages/History";
import logo from "@/assets/finwallet-logo.png";

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { accountId } = useAuth();
  return accountId ? <>{children}</> : <Navigate to="/login" replace />;
};

const NAV_ITEMS = [
  { to: "/balance", label: "Balance", icon: Wallet },
  { to: "/pay", label: "Pay", icon: Send },
  { to: "/history", label: "History", icon: HistoryIcon },
];

const Nav: React.FC = () => {
  const { accountId, logout } = useAuth();
  if (!accountId) return null;
  return (
    <nav className="sticky top-0 z-10 border-b border-vault-800 bg-vault-900/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
        <div className="flex items-center gap-2 text-slate-100">
          <img src={logo} alt="FinWallet" className="h-7 w-7 rounded-full object-contain" />
          <span className="font-semibold tracking-tight">FinWallet</span>
        </div>

        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-accent-indigo/15 text-accent-indigo"
                    : "text-slate-400 hover:bg-vault-800 hover:text-slate-200"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </div>

        <button
          className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-400 transition hover:bg-risk-high/10 hover:text-risk-high"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </nav>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TelemetryProvider>
          <Nav />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/pay" element={<Protected><Pay /></Protected>} />
            <Route path="/balance" element={<Protected><Balance /></Protected>} />
            <Route path="/history" element={<Protected><History /></Protected>} />
            <Route path="*" element={<Navigate to="/balance" replace />} />
          </Routes>
        </TelemetryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
