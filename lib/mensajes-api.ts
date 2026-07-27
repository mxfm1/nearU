import { apiFetch } from './api-client';

export type MessageType = 'TEXT' | 'SYSTEM' | 'FILE' | 'IMAGE' | 'MIXED';

export type Attachment = {
  url: string;
  type: 'FILE' | 'IMAGE';
  mimeType: string;
  size: number;
  name: string;
};

export type Mensaje = {
  id: string;
  threadId: string;
  senderProfileId: string;
  content: string | null;
  messageType: MessageType;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
  senderName: string;
  senderLogoUrl: string | null;
  attachments: Attachment[];
};

export type SendMessagePayload = {
  content?: string | null;
  messageType: MessageType;
  attachments?: Attachment[];
};

export type Conversation = {
  id: string;
  applicationId: string;
  status: 'OPEN' | 'CLOSED';
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
  applicationTitle: string;
  applicantProfileId: string;
  applicantUserId: string;
  applicantName: string;
  applicantLogoUrl: string | null;
  organizerProfileId: string;
  organizerUserId: string;
  organizerName: string;
  organizerLogoUrl: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  mensajes?: Mensaje[];
};

export type ConversationListItem = {
  id: string;
  applicationId: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  applicationTitle: string;
  applicantProfileId: string;
  applicantUserId: string;
  applicantName: string;
  applicantLogoUrl: string | null;
  organizerProfileId: string;
  organizerUserId: string;
  organizerName: string;
  organizerLogoUrl: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
};

export const mensajesApi = {
  /**
   * Obtiene la lista de conversaciones del usuario actual.
   */
  getConversations: async () => {
    return apiFetch<{ data: ConversationListItem[] }>('/threads');
  },

  /**
   * Verifica si el usuario tiene alguna conversación activa.
   * Útil para mostrar el badge en la sidebar.
   */
  hasActiveConversations: async () => {
    return apiFetch<{ success: boolean; data: { hasConversations: boolean } }>(
      '/mensajes/has-conversations'
    );
  },

  /**
   * Obtiene los mensajes de un thread específico.
   */
  getThreadMessages: async (threadId: string) => {
    return apiFetch<Mensaje[]>(`/threads/${threadId}/messages`);
  },

  /**
   * Obtiene los detalles de un thread específico.
   */
  getThread: async (threadId: string) => {
    return apiFetch<Conversation>(`/threads/${threadId}`);
  },

  getByApplicationId: async (applicationId: string) => {
    return apiFetch<{ success: boolean; data: Conversation }>(
      `/mensajes/application/${applicationId}`
    );
  },

  /**
   * Envía un mensaje a un thread.
   */
  sendMessage: async (threadId: string, payload: SendMessagePayload) => {
    return apiFetch<{ data: Mensaje }>(`/threads/${threadId}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
