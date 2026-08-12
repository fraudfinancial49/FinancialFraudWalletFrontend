import axios, { AxiosError } from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://financialfraudbackend.onrender.com";

export const apiClient = axios.create({ baseURL: API_BASE_URL });

// Request Interceptor: Attach Token
apiClient.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("customer_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Response Interceptor: Handle Expired Tokens Globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      logoutCustomer();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// --- Interfaces ---
export interface AuthResponse {
  access_token: string;
  account_id: string;
  full_name?: string;
}

export interface BalanceResponse {
  balance: number;
  currency: string;
}

// --- API Endpoints ---
export async function registerCustomer(name: string, email: string, password: string): Promise<AuthResponse> {
  // Note: Mapped 'name' to 'full_name' to perfectly match the backend Pydantic schema
  const { data } = await apiClient.post<AuthResponse>("/api/v1/customer/register", { full_name: name, email, password });
  return data;
}

export async function loginCustomer(email: string, password: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/api/v1/customer/login", { email, password });
  localStorage.setItem("customer_token", data.access_token);
  localStorage.setItem("customer_account_id", data.account_id);
  return data;
}

export function logoutCustomer(): void {
  localStorage.removeItem("customer_token");
  localStorage.removeItem("customer_account_id");
}

export async function getMyBalance(): Promise<BalanceResponse> {
  const { data } = await apiClient.get<BalanceResponse>("/api/v1/customer/me/balance");
  return data;
}

export async function getMyTransactions(page = 1, pageSize = 25) {
  const { data } = await apiClient.get("/api/v1/customer/me/transactions", {
    params: { page, page_size: pageSize },
  });
  return data;
}

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
