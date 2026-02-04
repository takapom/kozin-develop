import type { ExtractImagesResponse } from "../types.ts";

function matchesTabelog(url: URL): boolean {
  return url.hostname === "tabelog.com" || url.hostname.endsWith(".tabelog.com");
}

/**
 * 食べログ向けの抽出ロジックを書く場所。
 * 該当URLなら `ExtractImagesResponse`、該当しない/失敗時は null。
 */
export async function tryExtractTabelog(
  url: URL
): Promise<ExtractImagesResponse | null> {
  if (!matchesTabelog(url)) return null;

  // TODO: ここに食べログ用のAPI/抽出処理を書く
  return null;
}

