import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  requestRental, myRentals, myLendings, rentalAction,
  type CreateRentalInput,
} from "@/api/rentals";

export type RentalActionType = "approve" | "reject" | "activate" | "cancel" | "return";

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
