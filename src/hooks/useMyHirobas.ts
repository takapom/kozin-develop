import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { fetchMyHirobas } from "../api/hirobas";

export function useMyHirobas() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["hirobas", "my", user?.id],
    queryFn: fetchMyHirobas,
    enabled: !!user,
  });
}
