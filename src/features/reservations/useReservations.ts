import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptReservation, createReservation, declineReservation,
  getMyReservations, leaveReservation,
} from "@/api/reservations";
import { orgKey } from "@/lib/orgPath";

export function useMyReservations() {
  return useQuery({ queryKey: orgKey("reservations", "mine"), queryFn: getMyReservations });
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: orgKey("reservations") });
    qc.invalidateQueries({ queryKey: orgKey("books") });
    qc.invalidateQueries({ queryKey: orgKey("rentals") });
  };
}

export function useCreateReservation() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: (bookId: string) => createReservation(bookId), onSuccess: invalidate });
}
export function useAcceptReservation() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: (id: string) => acceptReservation(id), onSuccess: invalidate });
}
export function useDeclineReservation() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: (id: string) => declineReservation(id), onSuccess: invalidate });
}
export function useLeaveReservation() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: (id: string) => leaveReservation(id), onSuccess: invalidate });
}
