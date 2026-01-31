import React, { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { Profile } from "../types/supabase";

type AuthState = {
  /** Supabase セッション (未ログインなら null) */
  session: Session | null;
  /** auth.users の情報 */
  user: User | null;
  /** profiles テーブルの情報 */
  profile: Profile | null;
  /** 初回セッション確認中 */
  loading: boolean;
  /** サインアップ (メール+パスワード) */
  signUp: (
    email: string,
    password: string,
    username: string
  ) => Promise<{ error: string | null }>;
  /** ログイン (メール+パスワード) */
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  /** ログアウト */
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // ----- プロフィール取得 -----
  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error || !data) {
      setProfile(null);
      return;
    }
    setProfile(data as Profile);
  }

  // ----- 初回セッション復元 + リスナー -----
  // 元のuseEffectでは「初回セッション取得時 setLoading(false)」を行うが、onAuthStateChangeでその後にリアルタイム変更されてもloadingは変わらないなど粗さがある。
  // 修正版では「アンマウント時のstate更新防止」にactiveフラグを入れ、
  // 「初回セッション＆プロフィール取得」と「サブスクリプション登録解除」をより安全にしている。
  // loadingの扱い自体は変えていない（本質改善ならonAuthStateChange時も考慮した方が良いが、元の仕様に近づけている）。
  useEffect(() => {
    let active = true;

    // 初回セッションの取得
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!active) return;
      setSession(s);
      if (s?.user) {
        fetchProfile(s.user.id);
      }
      setLoading(false);
    });

    // セッション状態変化の監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        fetchProfile(s.user.id);
      } else {
        setProfile(null);
      }
    });

    // アンマウント時のクリーンアップ
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // ----- サインアップ -----
  const signUp = async (
    email: string,
    password: string,
    username: string
  ): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  // ----- ログイン -----
  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  // ----- ログアウト -----
  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth は AuthProvider の中で使用してください");
  }
  return ctx;
}
