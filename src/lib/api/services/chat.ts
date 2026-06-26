import { api, API_BASE_URL, getAuthToken } from "../client";

// TODO: confirm endpoint paths and shapes with backend.
export interface ChatConversation {
  id: string;
  title: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export const chatService = {
  // TODO: GET /chat/conversations
  listConversations: (): Promise<ChatConversation[]> =>
    api.get<ChatConversation[]>("/chat/conversations"),
  // TODO: POST /chat/conversations
  createConversation: (title?: string): Promise<ChatConversation> =>
    api.post<ChatConversation>("/chat/conversations", { title }),
  // TODO: GET /chat/conversations/:id/messages
  listMessages: (conversationId: string): Promise<ChatMessage[]> =>
    api.get<ChatMessage[]>(`/chat/conversations/${conversationId}/messages`),
  // TODO: POST /chat/conversations/:id/messages
  sendMessage: (conversationId: string, content: string): Promise<ChatMessage> =>
    api.post<ChatMessage>(`/chat/conversations/${conversationId}/messages`, { content }),
  // TODO: POST /chat/conversations/:id/messages/stream — SSE/streaming variant
  streamMessage: async (
    conversationId: string,
    content: string,
    onChunk: (chunk: string) => void,
    signal?: AbortSignal,
  ): Promise<void> => {
    const token = getAuthToken();
    const res = await fetch(
      `${API_BASE_URL}/chat/conversations/${conversationId}/messages/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content }),
        signal,
      },
    );
    if (!res.ok || !res.body) throw new Error(`Stream failed: ${res.status}`);
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      onChunk(decoder.decode(value, { stream: true }));
    }
  },
};