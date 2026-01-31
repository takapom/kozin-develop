/**
 * ダミーデータ投入スクリプト
 * 実行: SEED_EMAIL=xxx SEED_PASSWORD=xxx npx tsx scripts/seed-dummy.ts
 */
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const email = process.env.SEED_EMAIL!;
const password = process.env.SEED_PASSWORD!;

const supabase = createClient(supabaseUrl, anonKey, {
  auth: { persistSession: false },
});

async function main() {
  // 1. ログイン
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (authError || !authData.user) {
    console.error("ログイン失敗:", authError?.message);
    process.exit(1);
  }

  const userId = authData.user.id;
  console.log(`ログイン成功: ${email} (${userId})`);

  // 2. 広場を2件作成（UUID はクライアント生成、SELECT ポリシー回避のため .select() なし）
  const hiroba1Id = randomUUID();
  const hiroba2Id = randomUUID();

  const { error: hirobasError } = await supabase.from("hirobas").insert([
    {
      id: hiroba1Id,
      owner_id: userId,
      title: "今週末の渋谷🏙️",
      description: "週末に行きたい場所を集めよう",
    },
    {
      id: hiroba2Id,
      owner_id: userId,
      title: "卒業旅行✈️",
      description: "3月の卒業旅行プランを考える",
    },
  ]);

  if (hirobasError) {
    console.error("hirobas 挿入失敗:", hirobasError.message);
    process.exit(1);
  }

  console.log("広場作成: OK");
  console.log(`  - 今週末の渋谷🏙️ (${hiroba1Id})`);
  console.log(`  - 卒業旅行✈️ (${hiroba2Id})`);

  // 3. hiroba_members に owner として登録（status: approved）
  const { error: membersError } = await supabase
    .from("hiroba_members")
    .insert([
      {
        hiroba_id: hiroba1Id,
        user_id: userId,
        role: "owner",
        status: "approved",
      },
      {
        hiroba_id: hiroba2Id,
        user_id: userId,
        role: "owner",
        status: "approved",
      },
    ]);

  if (membersError) {
    console.error("hiroba_members 挿入失敗:", membersError.message);
    process.exit(1);
  }

  console.log("メンバー登録: OK (owner として2件)");

  // 4. 投稿を各広場に1件ずつ作成
  const { error: postsError } = await supabase.from("posts").insert([
    {
      hiroba_id: hiroba1Id,
      user_id: userId,
      image_path: "dummy/placeholder1.jpg",
      caption: "渋谷の新しいラーメン屋見つけた！🍜",
    },
    {
      hiroba_id: hiroba2Id,
      user_id: userId,
      image_path: "dummy/placeholder2.jpg",
      caption: "この温泉旅館よさそう♨️",
    },
  ]);

  if (postsError) {
    console.error("posts 挿入失敗:", postsError.message);
    process.exit(1);
  }

  console.log("投稿作成: OK (各広場1件ずつ)");

  console.log("\n✅ ダミーデータ投入完了！アプリを再読み込みして確認してください。");
}

main().catch(console.error);
