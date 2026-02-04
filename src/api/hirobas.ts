import { supabase } from "../lib/supabase";
import * as Crypto from "expo-crypto";
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

// 広場を作成（自分をownerとしてメンバー登録も行う）
export async function createHiroba(params: {
  title: string;
  description?: string;
}): Promise<Hiroba> {
  console.log("[createHiroba] 開始", params);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("[createHiroba] user:", user?.id);
  if (!user) throw new Error("未ログイン");

  // IDを事前に生成（React Native対応）
  const hirobaId = Crypto.randomUUID();
  console.log("[createHiroba] 生成したID:", hirobaId);

  // 1. 広場を作成（SELECTなし - RLSのSELECTポリシー回避）
  const { error: hirobaError } = await supabase
    .from("hirobas")
    .insert({
      id: hirobaId,
      owner_id: user.id,
      title: params.title,
      description: params.description || null,
    });

  console.log("[createHiroba] hirobas INSERT結果:", { hirobaError });
  if (hirobaError) throw hirobaError;

  // 2. 自分をownerとしてメンバー登録
  const { error: memberError } = await supabase
    .from("hiroba_members")
    .insert({
      hiroba_id: hirobaId,
      user_id: user.id,
      role: "owner",
      status: "approved",
    });

  console.log("[createHiroba] hiroba_members INSERT結果:", { memberError });
  if (memberError) {
    // ロールバック: 広場も削除
    await supabase.from("hirobas").delete().eq("id", hirobaId);
    throw memberError;
  }

  // 3. メンバー登録後にSELECT（これでRLSのSELECTポリシーを通過）
  const { data: hiroba, error: selectError } = await supabase
    .from("hirobas")
    .select("*")
    .eq("id", hirobaId)
    .single();

  console.log("[createHiroba] SELECT結果:", { hiroba, selectError });
  if (selectError) throw selectError;

  return hiroba as Hiroba;
}

// 広場を削除（CASCADE削除で関連データも自動削除）
export async function deleteHiroba(hirobaId: string): Promise<void> {
  const { error } = await supabase
    .from("hirobas")
    .delete()
    .eq("id", hirobaId);

  if (error) throw error;
}
