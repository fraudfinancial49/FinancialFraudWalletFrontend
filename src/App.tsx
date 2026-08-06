import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Login } from "@/pages/Login";
import { Pay } from "@/pages/Pay";
import { Balance } from "@/pages/Balance";
import { History } from "@/pages/History";

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { accountId } = useAuth();
  return accountId ? <>{children}</> : <Navigate to="/login" replace />;
};

const Nav: React.FC = () => {
  const { accountId, logout } = useAuth();
  if (!accountId) return null;
  return (
    <nav className="flex gap-6 p-4 border-b">
      <Link to="/pay">Pay</Link>
      <Link to="/balance">Balance</Link>
      <Link to="/history">History</Link>
      <button className="ml-auto text-sm text-red-600" onClick={logout}>Log out</button>
    </nav>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Nav />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/pay" element={<Protected><Pay /></Protected>} />
          <Route path="/balance" element={<Protected><Balance /></Protected>} />
          <Route path="/history" element={<Protected><History /></Protected>} />
          <Route path="*" element={<Navigate to="/balance" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
