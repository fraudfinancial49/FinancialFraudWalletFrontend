import axios from "axios";

// Same backend as the admin dashboard — just a different origin/app on top of it.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://financialfraudbackend.onrender.com";

export const apiClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("customer_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export async function registerCustomer(name: string, email: string, password: string) {
  const { data } = await apiClient.post("/api/v1/customer/register", { name, email, password });
  return data;
}

export async function loginCustomer(email: string, password: string) {
  const { data } = await apiClient.post("/api/v1/customer/login", { email, password });
  localStorage.setItem("customer_token", data.access_token);
  localStorage.setItem("customer_account_id", data.account_id);
  return data;
}

export function logoutCustomer() {
  localStorage.removeItem("customer_token");
  localStorage.removeItem("customer_account_id");
}

export async function getMyBalance() {
  const { data } = await apiClient.get("/api/v1/customer/me/balance");
  return data;
}

export async function getMyTransactions(page = 1, pageSize = 25) {
  const { data } = await apiClient.get("/api/v1/customer/me/transactions", {
    params: { page, page_size: pageSize },
  });
  return data;
}

// Reuses Part 1's existing endpoint as-is.
export async function assessTransaction(payload: {
  nameDest: string; amount: number; type: string;
}) {
  const { data } = await apiClient.post("/api/v1/transactions/assess", payload);
  return data;
}

export async function verifyOtp(transactionId: string, otp: string) {
  const { data } = await apiClient.post(
    `/api/v1/transactions/${transactionId}/verify-otp`,
    { otp }
  );
  return data;
}
