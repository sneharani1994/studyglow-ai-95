import { api } from "../client";

// TODO: confirm endpoint paths and shapes with backend.
export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

export const uploadsService = {
  // TODO: GET /uploads
  list: (): Promise<UploadedFile[]> => api.get<UploadedFile[]>("/uploads"),
  // TODO: POST /uploads (multipart/form-data). Use XHR for granular progress.
  upload: (file: File): Promise<UploadedFile> => {
    const fd = new FormData();
    fd.append("file", file);
    return api.post<UploadedFile>("/uploads", undefined, { rawBody: fd });
  },
  // TODO: DELETE /uploads/:id
  remove: (id: string): Promise<void> =>
    api.delete(`/uploads/${id}`, { responseType: "void" }),
};