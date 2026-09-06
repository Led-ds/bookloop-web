import { useQuery } from "@tanstack/react-query";
import { getBook, searchBooks, type BookFilters } from "@/api/books";
import { activeOrgKey } from "@/lib/orgPath";

export function useBooksSearch(filters: BookFilters) {
  return useQuery({
    queryKey: ["org", activeOrgKey(), "books", filters],
    queryFn: () => searchBooks(filters),
  });
}

export function useBook(id: string) {
  return useQuery({ queryKey: ["org", activeOrgKey(), "book", id], queryFn: () => getBook(id), enabled: !!id });
}
