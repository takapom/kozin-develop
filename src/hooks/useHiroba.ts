import { useQuery } from "@tanstack/react-query";
import { fetchHiroba } from "../api/hirobas";

export function useHiroba(hirobaId: string) {
  return useQuery({
    queryKey: ["hirobas", hirobaId],
    queryFn: () => fetchHiroba(hirobaId),
    enabled: !!hirobaId,
  });
}
