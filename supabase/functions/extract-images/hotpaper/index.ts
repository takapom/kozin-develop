import type { ExtractImagesResponse, HotpepperShop } from "../types.ts";

// 店舗IDは "J" + 9桁（例: J001161672）
// URL内のどこにあっても拾えるように広めにマッチ
export function extractHotpepperShopId(inputUrl: string): string | null {
  const m = inputUrl.match(/(J\d{9})/);
  return m ? m[1] : null;
}

// URLがHotpepperの店舗ページかどうかを判定
function matchesHotpaper(url: URL): boolean {
  return (
    url.hostname.endsWith("hotpepper.jp") ||
    extractHotpepperShopId(url.href) !== null
  );
}

// Hotpepper APIから店舗情報を取得
export async function fetchHotpepperShopById(
  shopId: string
): Promise<HotpepperShop | null> {
  // @ts-ignore: Deno runtime API (available in Supabase Edge Functions)
  const key = Deno.env.get("HOTPEPPER_API_KEY");
  if (!key) throw new Error("HOTPEPPER_API_KEY is not set");

  // 公式: gourmet/v1, format=json
  const endpoint = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/";
  const params = new URLSearchParams({ key, id: shopId, format: "json" });

  const res = await fetch(`${endpoint}?${params.toString()}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;

  const data = await res.json();
  const shop = data?.results?.shop?.[0];
  if (!shop) return null;

  const lat = Number(shop?.lat);
  const lng = Number(shop?.lng);

  return {
    id: String(shop?.id ?? shopId),
    name: String(shop?.name ?? ""),
    address: String(shop?.address ?? ""),
    lat: Number.isFinite(lat) ? lat : 0,
    lng: Number.isFinite(lng) ? lng : 0,
    url: String(shop?.urls?.pc ?? ""),
    photoL: shop?.photo?.mobile?.l ?? shop?.photo?.pc?.l ?? undefined,
  };
}

/**
 * hotpaper向けの抽出ロジックを書く場所。
 * 実装できたら `ExtractImagesResponse` を返し、該当しない/失敗時は null を返す。
 */
export async function tryExtractHotpaper(
  url: URL
): Promise<ExtractImagesResponse | null> {
  if (!matchesHotpaper(url)) return null;

  const shopId = extractHotpepperShopId(url.href);
  if (!shopId) return null;

  const shop = await fetchHotpepperShopById(shopId);
  if (!shop) return null;

  const images = shop.photoL ? [{ url: shop.photoL, source: "hotpepper:api" }] : [];
  return {
    images,
    title: shop.name || "",
    description: shop.address || "",
  };
}
