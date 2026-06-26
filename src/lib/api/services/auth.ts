import { api, setAuthToken } from "../client";

// TODO: confirm exact endpoint paths and request/response shapes with backend.
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LoginInput { email: string; password: string }
export interface SignupInput { email: string; password: string; name: string }

export const authService = {
  // TODO: POST /auth/login
  login: async (input: LoginInput): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/login", input, { skipAuth: true });
    if (res?.token) setAuthToken(res.token);
    return res;
  },
  // TODO: POST /auth/signup
  signup: async (input: SignupInput): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/signup", input, { skipAuth: true });
    if (res?.token) setAuthToken(res.token);
    return res;
  },
  // TODO: POST /auth/logout
  logout: async (): Promise<void> => {
    try { await api.post("/auth/logout"); } finally { setAuthToken(null); }
  },
  // TODO: GET /auth/me
  me: (): Promise<AuthUser> => api.get<AuthUser>("/auth/me"),
  // TODO: POST /auth/forgot-password
  forgotPassword: (email: string): Promise<void> =>
    api.post("/auth/forgot-password", { email }, { skipAuth: true, responseType: "void" }),
  // TODO: POST /auth/reset-password
  resetPassword: (token: string, password: string): Promise<void> =>
    api.post("/auth/reset-password", { token, password }, { skipAuth: true, responseType: "void" }),
  // TODO: OAuth — typically a redirect to backend, e.g. /auth/google
  oauthUrl: (provider: "google" | "github"): string =>
    `https://studyglow-backend-production.up.railway.app/auth/${provider}`,
};