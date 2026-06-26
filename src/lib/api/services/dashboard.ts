import { api } from "../client";

// TODO: confirm endpoint paths and shapes with backend.
export interface DashboardStats {
  studyMinutesToday: number;
  streakDays: number;
  quizzesCompleted: number;
  flashcardsReviewed: number;
  weeklyProgress: { date: string; minutes: number }[];
  upcomingEvents: { id: string; title: string; start: string }[];
}

export const dashboardService = {
  // TODO: GET /dashboard
  get: (): Promise<DashboardStats> => api.get<DashboardStats>("/dashboard"),
  // TODO: GET /dashboard/analytics
  analytics: (range?: "7d" | "30d" | "90d"): Promise<unknown> =>
    api.get("/dashboard/analytics", { query: { range } }),
};