import { api } from "@/lib/api";
import { orgPath } from "@/lib/orgPath";
import type { ApiResponse, PageResponse, Rental } from "@/types";

export interface CreateRentalInput {
  bookId: string;
  message?: string;
  startDate: string;
  endDate: string;
  termAccepted: boolean;
  signerName: string;
}

export async function requestRental(input: CreateRentalInput) {
  const res = await api.post<ApiResponse<Rental>>(orgPath("/rentals"), input);
  return res.data.data;
}

export async function myRentals(page = 0) {
  const res = await api.get<ApiResponse<PageResponse<Rental>>>(orgPath("/rentals/mine"), { params: { page } });
  return res.data.data;
}

export async function myLendings(page = 0) {
  const res = await api.get<ApiResponse<PageResponse<Rental>>>(orgPath("/rentals/lendings"), { params: { page } });
  return res.data.data;
}

export async function rentalAction(
  id: string,
  action: "approve" | "reject" | "activate" | "cancel" | "return" | "return-request" | "return-confirm" | "renewal-approve" | "renewal-reject",
) {
  const res = await api.post<ApiResponse<Rental>>(orgPath(`/rentals/${id}/${action}`));
  return res.data.data;
}

/** Locatário solicita renovação (nova data de fim). Dono aprova/rejeita via rentalAction. */
export async function requestRenewal(id: string, newEndDate: string): Promise<Rental> {
  const res = await api.post<ApiResponse<Rental>>(orgPath(`/rentals/${id}/renewal-request`), { newEndDate });
  return res.data.data;
}
