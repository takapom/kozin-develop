export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      hirobas: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          owner_id?: string;
          title?: string;
          description?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "hirobas_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      hiroba_members: {
        Row: {
          hiroba_id: string;
          user_id: string;
          role: "owner" | "member";
          status: "pending" | "approved" | "declined";
          invited_by: string | null;
          created_at: string;
        };
        Insert: {
          hiroba_id: string;
          user_id: string;
          role?: "owner" | "member";
          status?: "pending" | "approved" | "declined";
          invited_by?: string | null;
          created_at?: string;
        };
        Update: {
          role?: "owner" | "member";
          status?: "pending" | "approved" | "declined";
        };
        Relationships: [
          {
            foreignKeyName: "hiroba_members_hiroba_id_fkey";
            columns: ["hiroba_id"];
            isOneToOne: false;
            referencedRelation: "hirobas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "hiroba_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "hiroba_members_invited_by_fkey";
            columns: ["invited_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      posts: {
        Row: {
          id: string;
          hiroba_id: string;
          user_id: string;
          image_path: string;
          caption: string | null;
          likes_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          hiroba_id: string;
          user_id: string;
          image_path: string;
          caption?: string | null;
          likes_count?: number;
          created_at?: string;
        };
        Update: {
          image_path?: string;
          caption?: string | null;
          likes_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: "posts_hiroba_id_fkey";
            columns: ["hiroba_id"];
            isOneToOne: false;
            referencedRelation: "hirobas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "posts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      plans: {
        Row: {
          id: string;
          hiroba_id: string;
          created_by: string;
          name: string;
          summary: string | null;
          route_json: Json;
          source_post_ids: string[];
          status: "draft" | "selected";
          created_at: string;
        };
        Insert: {
          id?: string;
          hiroba_id: string;
          created_by: string;
          name: string;
          summary?: string | null;
          route_json: Json;
          source_post_ids?: string[];
          status?: "draft" | "selected";
          created_at?: string;
        };
        Update: {
          name?: string;
          summary?: string | null;
          route_json?: Json;
          source_post_ids?: string[];
          status?: "draft" | "selected";
        };
        Relationships: [
          {
            foreignKeyName: "plans_hiroba_id_fkey";
            columns: ["hiroba_id"];
            isOneToOne: false;
            referencedRelation: "hirobas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "plans_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

/** 各テーブルの Row 型ショートカット */
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Hiroba = Database["public"]["Tables"]["hirobas"]["Row"];
export type HirobaMember = Database["public"]["Tables"]["hiroba_members"]["Row"];
export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type Plan = Database["public"]["Tables"]["plans"]["Row"];
