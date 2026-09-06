import { api } from "@/lib/api";
import { orgPath } from "@/lib/orgPath";
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
  const res = await api.post<ApiResponse<Reservation>>(orgPath("/reservations"), { bookId });
  return res.data.data;
}

export async function getMyReservations(): Promise<Reservation[]> {
  const res = await api.get<ApiResponse<Reservation[]>>(orgPath("/reservations/mine"));
  return res.data.data;
}

export async function acceptReservation(id: string): Promise<Reservation> {
  const res = await api.post<ApiResponse<Reservation>>(orgPath(`/reservations/${id}/accept`));
  return res.data.data;
}

export async function declineReservation(id: string): Promise<Reservation> {
  const res = await api.post<ApiResponse<Reservation>>(orgPath(`/reservations/${id}/decline`));
  return res.data.data;
}

export async function leaveReservation(id: string): Promise<void> {
  await api.delete(orgPath(`/reservations/${id}`));
}
