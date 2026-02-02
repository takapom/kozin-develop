// @ts-ignore: Deno JSR import (available in Supabase Edge Functions)
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// @ts-ignore: Deno JSR import (available in Supabase Edge Functions)
import { createClient } from "jsr:@supabase/supabase-js@2";

// ---------------------------------------------------------------------------
// CORS helpers
// ---------------------------------------------------------------------------
// NOTE:
// - CORSはブラウザだけが強制する仕組み。React Nativeのようなネイティブは通常 `Origin` を付けません。
// - そこで「ブラウザから来た `Origin` だけ」ホワイトリストで許可し、それ以外はブロックします。
// 許可するWebオリジンは `ALLOWED_ORIGINS`（カンマ区切り）で設定します。
// @ts-ignore: Deno runtime API (available in Supabase Edge Functions)
const allowedOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((s: string) => s.trim())
  .filter(Boolean);

function buildCorsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-user-token",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
  };

  if (origin && allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Vary"] = "Origin";
  }

  return headers;
}

function jsonResponse(
  body: unknown,
  status = 200,
  corsHeaders: Record<string, string> = {}
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Guess a file extension from the Content-Type header. */
function extensionFromContentType(contentType: string | null): string {
  if (!contentType) return "jpg";
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("gif")) return "gif";
  if (contentType.includes("svg")) return "svg";
  return "jpg";
}

/** Guess MIME type from extension for Storage upload. */
function mimeFromExtension(ext: string): string {
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    svg: "image/svg+xml",
  };
  return map[ext] ?? "image/jpeg";
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

// @ts-ignore: Deno runtime API (available in Supabase Edge Functions)
Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  const corsHeaders = buildCorsHeaders(origin);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    if (origin && !corsHeaders["Access-Control-Allow-Origin"]) {
      return new Response("forbidden", { status: 403 });
    }
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, corsHeaders);
  }

  // -----------------------------------------------------------------------
  // 1. Authenticate the user via JWT
  // -----------------------------------------------------------------------
  // ユーザーJWTはカスタムヘッダー x-user-token から取得
  // (Authorization ヘッダーはSupabaseゲートウェイがanon keyの検証に使用するため)
  const userJwt = req.headers.get("x-user-token");
  if (!userJwt) {
    return jsonResponse(
      { error: "Missing x-user-token header" },
      401,
      corsHeaders
    );
  }

  // @ts-ignore: Deno runtime API
  const supabaseUrl: string = Deno.env.get("SUPABASE_URL")!;
  // @ts-ignore: Deno runtime API
  const supabaseServiceRoleKey: string = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Create a client scoped to the user to extract user_id
  const supabaseUser = createClient(supabaseUrl, supabaseServiceRoleKey, {
    global: { headers: { Authorization: `Bearer ${userJwt}` } },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const {
    data: { user },
    error: authError,
  } = await supabaseUser.auth.getUser(userJwt);

  if (authError || !user) {
    return jsonResponse(
      { error: "Unauthorized: invalid or expired token" },
      401,
      corsHeaders
    );
  }

  const userId = user.id;

  // -----------------------------------------------------------------------
  // 2. Parse request body
  // -----------------------------------------------------------------------
  let body: {
    hiroba_id?: string;
    image_url?: string;
    caption?: string;
    source_url?: string;
  };

  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400, corsHeaders);
  }

  const { hiroba_id, image_url, caption, source_url } = body;

  if (!hiroba_id || typeof hiroba_id !== "string") {
    return jsonResponse(
      { error: "Missing or invalid 'hiroba_id'" },
      400,
      corsHeaders
    );
  }

  if (!image_url || typeof image_url !== "string") {
    return jsonResponse(
      { error: "Missing or invalid 'image_url'" },
      400,
      corsHeaders
    );
  }

  // Validate image_url
  try {
    const u = new URL(image_url);
    if (!["http:", "https:"].includes(u.protocol)) {
      throw new Error("Invalid protocol");
    }
  } catch {
    return jsonResponse({ error: "Invalid image URL" }, 400, corsHeaders);
  }

  // -----------------------------------------------------------------------
  // 3. Fetch the image from the external URL
  // -----------------------------------------------------------------------
  let imageBytes: Uint8Array;
  let ext: string;

  try {
    const imageResponse = await fetch(image_url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        Accept: "image/*,*/*;q=0.8",
      },
      redirect: "follow",
    });

    if (!imageResponse.ok) {
      return jsonResponse(
        {
          error: `Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`,
        },
        502,
        corsHeaders
      );
    }

    const contentType = imageResponse.headers.get("content-type");
    // Basic check that the response is actually an image
    if (contentType && !contentType.startsWith("image/")) {
      return jsonResponse(
        { error: "URL does not point to an image" },
        400,
        corsHeaders
      );
    }

    ext = extensionFromContentType(contentType);
    imageBytes = new Uint8Array(await imageResponse.arrayBuffer());
  } catch (err) {
    console.error("Image fetch error:", err);
    return jsonResponse(
      {
        error: `Failed to download image: ${
          err instanceof Error ? err.message : "unknown error"
        }`,
      },
      502,
      corsHeaders
    );
  }

  if (imageBytes.length === 0) {
    return jsonResponse({ error: "Downloaded image is empty" }, 400, corsHeaders);
  }

  // -----------------------------------------------------------------------
  // 4. Upload to Supabase Storage (using service role for guaranteed access)
  // -----------------------------------------------------------------------
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const timestamp = Date.now();
  const storagePath = `hirobas/${hiroba_id}/${userId}/${timestamp}.${ext}`;
  const mime = mimeFromExtension(ext);

  const { error: uploadError } = await supabaseAdmin.storage
    .from("post-images")
    .upload(storagePath, imageBytes, {
      contentType: mime,
      upsert: false,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    return jsonResponse(
      { error: `Storage upload failed: ${uploadError.message}` },
      500,
      corsHeaders
    );
  }

  // -----------------------------------------------------------------------
  // 5. INSERT into posts table
  // -----------------------------------------------------------------------
  const { data: post, error: insertError } = await supabaseAdmin
    .from("posts")
    .insert({
      hiroba_id,
      user_id: userId,
      image_path: storagePath,
      caption: caption ?? null,
    })
    .select()
    .single();

  if (insertError) {
    console.error("DB insert error:", insertError);

    // Best-effort cleanup: remove the uploaded file since DB insert failed
    await supabaseAdmin.storage
      .from("post-images")
      .remove([storagePath])
      .catch((e: unknown) => console.error("Cleanup failed:", e));

    return jsonResponse(
      { error: `Database insert failed: ${insertError.message}` },
      500,
      corsHeaders
    );
  }

  // -----------------------------------------------------------------------
  // 6. Return the created post
  // -----------------------------------------------------------------------
  return jsonResponse(
    {
      post,
      storage_path: storagePath,
      source_url: source_url ?? null,
    },
    201,
    corsHeaders
  );
});
