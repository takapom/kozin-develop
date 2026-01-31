import { supabase } from "../lib/supabase";
import type { HirobaMember, Profile } from "../types/supabase";

export type MemberWithProfile = HirobaMember & {
  profiles: Pick<Profile, "id" | "username" | "avatar_url"> | null;
};

// 特定の広場のメンバーの実データ(ユーザー名・アバター・ロール)を取得
export async function fetchHirobaMembers(
  hirobaId: string
): Promise<MemberWithProfile[]> {
  const { data, error } = await supabase
    .from("hiroba_members")
    .select(
      "*, profiles!hiroba_members_user_id_fkey(id, username, avatar_url)"
    )
    .eq("hiroba_id", hirobaId)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as MemberWithProfile[];
}
