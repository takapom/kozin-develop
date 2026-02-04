import type { ExtractImagesResponse } from "../types.ts";

function matchesInstagram(url: URL): boolean {
  return (
    url.hostname === "instagram.com" ||
    url.hostname.endsWith(".instagram.com") ||
    url.hostname === "instagr.am" ||
    url.hostname.endsWith(".instagr.am")
  );
}

/**
 * Instagram向けの抽出ロジックを書く場所。
 *
 * 注意: Instagramはログイン誘導/レート制限等でHTML取得が安定しないことが多いです。
 * 安定させるなら oEmbed / Graph API などの「公式API」を使う構成が必要になることがあります。
 */
export async function tryExtractInstagram(
  url: URL
): Promise<ExtractImagesResponse | null> {
  if (!matchesInstagram(url)) return null;

  // TODO: ここにInstagram用のAPI処理を書く（例: oEmbed、Graph API 等）
  return null;
}

