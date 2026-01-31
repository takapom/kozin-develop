import { supabase } from "../lib/supabase";
import type { Post, Profile } from "../types/supabase";

export type PostWithProfile = Post & {
  profiles: Pick<Profile, "id" | "username" | "avatar_url"> | null;
  imageUrl: string | null;
};

export async function fetchHirobaPosts(
  hirobaId: string
): Promise<PostWithProfile[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles:user_id(id, username, avatar_url)")
    .eq("hiroba_id", hirobaId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // 各投稿の画像に signed URL を生成
  const postsWithUrls = await Promise.all(
    ((data ?? []) as unknown as (Post & { profiles: Pick<Profile, "id" | "username" | "avatar_url"> | null })[]).map(
      async (post) => {
        let imageUrl: string | null = null;
        if (post.image_path) {
          const { data: signedData } = await supabase.storage
            .from("post-images")
            .createSignedUrl(post.image_path, 60 * 60); // 1時間
          imageUrl = signedData?.signedUrl ?? null;
        }
        return { ...post, imageUrl };
      }
    )
  );

  return postsWithUrls;
}
