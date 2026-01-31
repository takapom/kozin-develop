import { useQuery } from "@tanstack/react-query";
import { fetchHirobaMembers } from "../api/members";

export function useHirobaMembers(hirobaId: string) {
  return useQuery({
    queryKey: ["members", hirobaId],
    queryFn: () => fetchHirobaMembers(hirobaId),
    enabled: !!hirobaId,
  });
}
