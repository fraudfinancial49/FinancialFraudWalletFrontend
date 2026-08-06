import React, { createContext, useContext, useState } from "react";
import { loginCustomer, logoutCustomer, registerCustomer } from "@/api/client";

interface AuthCtx {
  accountId: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accountId, setAccountId] = useState<string | null>(
    localStorage.getItem("customer_account_id")
  );

  async function login(email: string, password: string) {
    const res = await loginCustomer(email, password);
    setAccountId(res.account_id);
  }

  async function register(name: string, email: string, password: string) {
    await registerCustomer(name, email, password);
    await login(email, password);
  }

  function logout() {
    logoutCustomer();
    setAccountId(null);
  }

  return <Ctx.Provider value={{ accountId, login, register, logout }}>{children}</Ctx.Provider>;
};

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
