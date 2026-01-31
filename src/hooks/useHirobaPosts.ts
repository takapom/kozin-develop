import { useQuery } from "@tanstack/react-query";
import { fetchHirobaPosts } from "../api/posts";

export function useHirobaPosts(hirobaId: string) {
  return useQuery({
    queryKey: ["posts", hirobaId],
    queryFn: () => fetchHirobaPosts(hirobaId),
    enabled: !!hirobaId,
  });
}
