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

/**
 * Edge Functionを呼び出してURLから画像候補を抽出
 */
export async function extractImages(url: string): Promise<{
  images: { url: string; source: string }[];
  title: string | null;
  description: string | null;
}> {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  const res = await fetch(
    `${supabaseUrl}/functions/v1/extract-images`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseAnonKey}`,
        apikey: supabaseAnonKey!,
      },
      body: JSON.stringify({ url }),
    },
  );

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }

  return body;
}

/**
 * Edge Functionを呼び出して投稿を作成
 */
export async function createPost(params: {
  hiroba_id: string;
  image_url: string;
  caption?: string;
  source_url: string;
}): Promise<Post> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("認証が必要です");
  }

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  const res = await fetch(
    `${supabaseUrl}/functions/v1/create-post`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseAnonKey}`,
        apikey: supabaseAnonKey!,
        "x-user-token": session.access_token,
      },
      body: JSON.stringify(params),
    },
  );

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }

  return body.post as Post;
}
