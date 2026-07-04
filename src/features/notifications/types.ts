// Contrato espelhando o backend (NotificationResponse). Nome "AppNotification" evita
// colisão com o global do DOM `Notification` (Notifications API).

export type NotificationType =
  | "RENTAL_REQUESTED"
  | "RENTAL_APPROVED"
  | "RENTAL_REJECTED"
  | "RENTAL_RETURNED"
  | "BOOK_CREATED"
  | "USER_REGISTERED"
  | "SYSTEM";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  actorUserId?: string | null;
  targetType?: string | null;
  targetId?: string | null;
  actionUrl?: string | null;
  read: boolean;
  createdAt: string;
  readAt?: string | null;
}

export interface UnreadCount {
  count: number;
}
