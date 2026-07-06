import { useQuery } from "@tanstack/react-query";
import { getBookReviews, getUserReviews } from "@/api/reviews";

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
