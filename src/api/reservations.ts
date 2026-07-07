import { api } from "@/lib/api";
import type { ApiResponse } from "@/types";

export type ReservationStatus = "WAITING" | "OFFERED" | "ACCEPTED" | "DECLINED" | "EXPIRED";

export interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCoverUrl?: string;
  status: ReservationStatus;
  position: number;
  offerExpiresAt?: string;
}

export async function createReservation(bookId: string): Promise<Reservation> {
  const res = await api.post<ApiResponse<Reservation>>("/reservations", { bookId });
  return res.data.data;
}

export async function getMyReservations(): Promise<Reservation[]> {
  const res = await api.get<ApiResponse<Reservation[]>>("/reservations/mine");
  return res.data.data;
}

export async function acceptReservation(id: string): Promise<Reservation> {
  const res = await api.post<ApiResponse<Reservation>>(`/reservations/${id}/accept`);
  return res.data.data;
}

export async function declineReservation(id: string): Promise<Reservation> {
  const res = await api.post<ApiResponse<Reservation>>(`/reservations/${id}/decline`);
  return res.data.data;
}

export async function leaveReservation(id: string): Promise<void> {
  await api.delete(`/reservations/${id}`);
}
