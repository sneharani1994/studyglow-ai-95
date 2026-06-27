import { useEffect, useState } from "react";
import { authService, type AuthUser } from "@/lib/api";
import { setAuthToken } from "@/lib/api/client";

export type User = { name: string; email: string };

const KEY = "studygpt_user";
const EVT = "studygpt-auth";

/** Cached snapshot of the authenticated user (kept in sync with the backend). */
export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try { const v = localStorage.getItem(KEY); return v ? JSON.parse(v) : null; } catch { return null; }
}

function persist(u: User | null) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(KEY, JSON.stringify(u));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVT));
}

const toUser = (u: AuthUser): User => ({ name: u.name, email: u.email });

/** Login via Railway backend. Stores bearer token + user snapshot on success. */
export async function loginWithCredentials(email: string, password: string): Promise<User> {
  const res = await authService.login({ email, password });
  const user = toUser(res.user);
  persist(user);
  return user;
}

/** Signup via Railway backend. */
export async function signupWithCredentials(name: string, email: string, password: string): Promise<User> {
  const res = await authService.signup({ name, email, password });
  const user = toUser(res.user);
  persist(user);
  return user;
}

/** Calls backend logout (best-effort) and clears local session. */
export async function logout(): Promise<void> {
  try { await authService.logout(); } catch { /* ignore */ }
  setAuthToken(null);
  persist(null);
}

/** Validate cached session against backend. Clears it if invalid. */
export async function refreshUserFromBackend(): Promise<User | null> {
  try {
    const me = await authService.me();
    const user = toUser(me);
    persist(user);
    return user;
  } catch {
    setAuthToken(null);
    persist(null);
    return null;
  }
}

export function clearUser() {
  setAuthToken(null);
  persist(null);
}

export function useUser(): User | null {
  const [u, setU] = useState<User | null>(() => getUser());
  useEffect(() => {
    setU(getUser());
    const h = () => setU(getUser());
    window.addEventListener(EVT, h);
    window.addEventListener("storage", h);
    refreshUserFromBackend().catch(() => {});
    return () => { window.removeEventListener(EVT, h); window.removeEventListener("storage", h); };
  }, []);
  return u;
}

export function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase() ?? "").join("") || "U";
}