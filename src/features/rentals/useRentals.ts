import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  requestRental, myRentals, myLendings, rentalAction, requestRenewal,
  type CreateRentalInput,
} from "@/api/rentals";

export type RentalActionType =
  | "approve" | "reject" | "activate" | "cancel" | "return" | "return-request" | "return-confirm"
  | "renewal-approve" | "renewal-reject";

export function useMyRentals() {
  return useQuery({ queryKey: ["rentals", "mine"], queryFn: () => myRentals() });
}

export function useMyLendings() {
  return useQuery({ queryKey: ["rentals", "lendings"], queryFn: () => myLendings() });
}

export function useRequestRental() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateRentalInput) => requestRental(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rentals"] });
      qc.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useRentalAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: string; action: RentalActionType }) =>
      rentalAction(v.id, v.action),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rentals"] });
      qc.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useRequestRenewal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: string; newEndDate: string }) => requestRenewal(v.id, v.newEndDate),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rentals"] }),
  });
}
