import { api } from "../client";

// TODO: confirm endpoint paths and shapes with backend.
export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type?: string;
}

export const notificationsService = {
  // TODO: GET /notifications
  list: (): Promise<Notification[]> => api.get<Notification[]>("/notifications"),
  // TODO: POST /notifications/:id/read
  markRead: (id: string): Promise<void> =>
    api.post(`/notifications/${id}/read`, undefined, { responseType: "void" }),
  // TODO: POST /notifications/read-all
  markAllRead: (): Promise<void> =>
    api.post("/notifications/read-all", undefined, { responseType: "void" }),
};