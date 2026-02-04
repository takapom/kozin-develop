import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHiroba } from "../api/hirobas";

export function useCreateHiroba() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHiroba,
    onSuccess: () => {
      // 広場一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ["myHirobas"] });
    },
  });
}
