import { api } from "../client";

// TODO: confirm endpoint paths and shapes with backend.
export interface PlannerEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  type?: "study" | "exam" | "break" | "task";
  completed?: boolean;
}

export const plannerService = {
  // TODO: GET /planner/events
  list: (range?: { from?: string; to?: string }): Promise<PlannerEvent[]> =>
    api.get<PlannerEvent[]>("/planner/events", { query: range }),
  // TODO: POST /planner/events
  create: (input: Partial<PlannerEvent>): Promise<PlannerEvent> =>
    api.post<PlannerEvent>("/planner/events", input),
  // TODO: PUT /planner/events/:id
  update: (id: string, patch: Partial<PlannerEvent>): Promise<PlannerEvent> =>
    api.put<PlannerEvent>(`/planner/events/${id}`, patch),
  // TODO: DELETE /planner/events/:id
  remove: (id: string): Promise<void> =>
    api.delete(`/planner/events/${id}`, { responseType: "void" }),
};