import { supabase } from "../lib/supabase";
import type { Hiroba } from "../types/supabase";

export type HirobaWithCounts = Hiroba & {
  hiroba_members: { count: number }[]; // メンバー数
  posts: { count: number }[]; // 投稿数
};

// 自分の広場一覧からメンバー数と投稿数を取得(表示用)
export async function fetchMyHirobas(): Promise<HirobaWithCounts[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("未ログイン");

  const { data, error } = await supabase
    .from("hirobas")
    .select(
      "*, hiroba_members!hiroba_members_hiroba_id_fkey!inner(count), posts(count)"
    )
    .eq("hiroba_members.user_id", user.id)
    .eq("hiroba_members.status", "approved")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as HirobaWithCounts[];
}

// 特定の広場の詳細を取得
export async function fetchHiroba(hirobaId: string): Promise<Hiroba> {
  const { data, error } = await supabase
    .from("hirobas")
    .select("*")
    .eq("id", hirobaId)
    .single();

  if (error) throw error;
  return data as Hiroba;
}
