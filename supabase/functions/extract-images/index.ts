// @ts-ignore: Deno JSR import (available in Supabase Edge Functions)
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// ---------------------------------------------------------------------------
// CORS helpers
// ---------------------------------------------------------------------------
// NOTE:
// - CORSはブラウザだけが強制する仕組み。React Nativeのようなネイティブは通常 `Origin` を付けません。
// - そこで「ブラウザから来た `Origin` だけ」ホワイトリストで許可し、それ以外はブロックします。
// 許可するWebオリジンは `ALLOWED_ORIGINS`（カンマ区切り）で設定します。
// 例: https://example.com,https://staging.example.com
// @ts-ignore: Deno runtime API (available in Supabase Edge Functions)
const allowedOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((s: string) => s.trim())
  .filter(Boolean);

function buildCorsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
  };

  // ブラウザ由来のOriginが許可リストにある場合だけ返す
  if (origin && allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Vary"] = "Origin";
  }

  return headers;
}

// parseしてJSONレスポンスの返却
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

// URL utilities

// 相対URL→絶対URL
function toAbsoluteUrl(src: string, baseUrl: string): string | null {
  try {
    return new URL(src, baseUrl).href;
  } catch {
    return null;
  }
}

// image urlかどうか
function looksLikeImageUrl(url: string): boolean {
  // Reject data: URIs and empty strings
  if (!url || url.startsWith("data:")) return false;
  return true;
}

// 小さい画像かどうか
function isProbablySmallImage(url: string): boolean {
  const lower = url.toLowerCase();
  return (
    lower.includes("thumb") ||
    lower.includes("icon") ||
    lower.includes("favicon") ||
    lower.includes("logo") ||
    lower.includes("badge") ||
    lower.includes("sprite") ||
    lower.includes("1x1") ||
    lower.includes("pixel") ||
    lower.includes("spacer") ||
    lower.includes("tracking")
  );
}

// ---------------------------------------------------------------------------
// Regex-based HTML extraction (no DOM parser dependency)
// ---------------------------------------------------------------------------

interface ImageCandidate {
  url: string;
  source: string;
}

//   Extract content
function getMetaContent(html: string, pattern: RegExp): string[] {
  const results: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(html)) !== null) {
    const content = match[1] || match[2];
    if (content) results.push(content.trim());
  }
  return results;
}

/** Extract images from HTML */
function extractImages(html: string, pageUrl: string): ImageCandidate[] {
  const seen = new Set<string>();
  const results: ImageCandidate[] = [];

  const addCandidate = (rawUrl: string | null | undefined, source: string) => {
    if (!rawUrl) return;
    if (!looksLikeImageUrl(rawUrl)) return;

    const absolute = toAbsoluteUrl(rawUrl.trim(), pageUrl);
    if (!absolute) return;
    if (seen.has(absolute)) return;

    seen.add(absolute);
    results.push({ url: absolute, source });
  };

  // 1. og:image
  const ogImagePattern =
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']|<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/gi;
  for (const url of getMetaContent(html, ogImagePattern)) {
    addCandidate(url, "og:image");
  }

  // 2. twitter:image
  const twitterImagePattern =
    /<meta[^>]+(?:name|property)=["']twitter:image["'][^>]+content=["']([^"']+)["']|<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']twitter:image["']/gi;
  for (const url of getMetaContent(html, twitterImagePattern)) {
    addCandidate(url, "twitter:image");
  }

  // 3. <img> elements
  const imgPattern =
    /<img[^>]+(?:src|data-src|data-lazy-src)=["']([^"']+)["'][^>]*>/gi;
  let imgMatch: RegExpExecArray | null;
  while ((imgMatch = imgPattern.exec(html)) !== null) {
    if (results.length >= 5) break;

    const src = imgMatch[1];
    if (!src) continue;
    if (isProbablySmallImage(src)) continue;

    // Check for small width/height attributes
    const tagStr = imgMatch[0];
    const widthMatch = tagStr.match(/width=["']?(\d+)/i);
    const heightMatch = tagStr.match(/height=["']?(\d+)/i);
    const w = widthMatch ? parseInt(widthMatch[1], 10) : 0;
    const h = heightMatch ? parseInt(heightMatch[1], 10) : 0;
    if ((w > 0 && w < 80) || (h > 0 && h < 80)) continue;

    addCandidate(src, "img");
  }

  return results.slice(0, 5);
}


function extractTitle(html: string): string {
  // Try og:title
  const ogPattern =
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']|<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i;
  const ogMatch = html.match(ogPattern);
  if (ogMatch) return (ogMatch[1] || ogMatch[2] || "").trim();

  // Fall back to <title>
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : "";
}

function extractDescription(html: string): string {
  // Try og:description
  const ogPattern =
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']|<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i;
  const ogMatch = html.match(ogPattern);
  if (ogMatch) return (ogMatch[1] || ogMatch[2] || "").trim();

  // Try meta description
  const metaPattern =
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']|<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i;
  const metaMatch = html.match(metaPattern);
  if (metaMatch) return (metaMatch[1] || metaMatch[2] || "").trim();

  return "";
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
    // ブラウザのプリフライトで、Originが許可されていない場合は拒否
    if (origin && !corsHeaders["Access-Control-Allow-Origin"]) {
      return new Response("forbidden", { status: 403 });
    }
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, corsHeaders);
  }

  try {
    const body = await req.json();
    const url: string | undefined = body?.url;

    if (!url || typeof url !== "string") {
      return jsonResponse(
        { error: "Missing or invalid 'url' field" },
        400,
        corsHeaders
      );
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      return jsonResponse({ error: "Invalid URL" }, 400, corsHeaders);
    }

    // Fetch the page HTML with a browser-like User-Agent
    const response = await fetch(parsedUrl.href, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return jsonResponse(
        { error: `Failed to fetch URL: ${response.status} ${response.statusText}` },
        502,
        corsHeaders
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("text/xhtml")) {
      return jsonResponse(
        { error: "URL does not point to an HTML page" },
        400,
        corsHeaders
      );
    }

    const html = await response.text();

    // Use the final (redirected) URL as the base for resolving relative URLs
    const finalUrl = response.url || parsedUrl.href;

    const images = extractImages(html, finalUrl);
    const title = extractTitle(html);
    const description = extractDescription(html);

    return jsonResponse({ images, title, description }, 200, corsHeaders);
  } catch (err) {
    console.error("extract-images error:", err);
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Internal server error" },
      500,
      corsHeaders
    );
  }
});
