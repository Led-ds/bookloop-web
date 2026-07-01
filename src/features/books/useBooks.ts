import { useQuery } from "@tanstack/react-query";
import { getBook, searchBooks, type BookFilters } from "@/api/books";

export function useBooksSearch(filters: BookFilters) {
  return useQuery({
    queryKey: ["books", filters],
    queryFn: () => searchBooks(filters),
  });
}

export function useBook(id: string) {
  return useQuery({ queryKey: ["book", id], queryFn: () => getBook(id), enabled: !!id });
}
