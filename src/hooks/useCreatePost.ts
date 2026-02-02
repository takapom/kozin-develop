import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, extractImages } from "../api/posts";

/**
 * 画像抽出のためのhook
 */
export function useExtractImages() {
  return useMutation({
    mutationFn: (url: string) => extractImages(url),
  });
}

/**
 * 投稿作成のためのhook
 */
export function useCreatePost(hirobaId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      image_url: string;
      caption?: string;
      source_url: string;
    }) =>
      createPost({
        hiroba_id: hirobaId,
        ...params,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", hirobaId] });
    },
  });
}
