import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteHiroba } from "../api/hirobas";

export function useDeleteHiroba() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHiroba,
    onSuccess: () => {
      // 広場一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ["myHirobas"] });
    },
  });
}
