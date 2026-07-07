import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReview, getBookReviews, getPendingReviews, getUserReviews,
  type CreateReviewInput,
} from "@/api/reviews";

export function useBookReviews(bookId: string) {
  return useQuery({
    queryKey: ["reviews", "book", bookId],
    queryFn: () => getBookReviews(bookId),
    enabled: !!bookId,
  });
}

export function useUserReviews(userId: string) {
  return useQuery({
    queryKey: ["reviews", "user", userId],
    queryFn: () => getUserReviews(userId),
    enabled: !!userId,
  });
}

export function usePendingReviews() {
  return useQuery({ queryKey: ["reviews", "pending"], queryFn: getPendingReviews });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateReviewInput) => createReview(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      qc.invalidateQueries({ queryKey: ["community"] });
    },
  });
}
