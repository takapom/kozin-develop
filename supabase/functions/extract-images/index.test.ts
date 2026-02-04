// 親の extract-images/index.ts に HotPepper URL を渡したとき、
// hotpaper/index.ts のロジック（tryExtractHotpaper）が使われることを確認するテスト

// VSCode/TS Server側ではDenoグローバルが解決できない場合があるため宣言
// （実行時はDenoが提供）
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Deno: any;

// @ts-ignore: Deno実行時は拡張子付きimportが必要
import { handleRequest } from "./index.ts";

async function withMockedFetch<T>(
  mock: typeof fetch,
  fn: () => Promise<T>,
): Promise<T> {
  const original = globalThis.fetch;
  (globalThis as unknown as { fetch: typeof fetch }).fetch = mock;
  try {
    return await fn();
  } finally {
    (globalThis as unknown as { fetch: typeof fetch }).fetch = original;
  }
}

Deno.test("handleRequest: HotPepper URLならHotPepper API経由で返す（fetchモック）", async () => {
  // @ts-ignore: Deno runtime API
  Deno.env.set("HOTPEPPER_API_KEY", "dummy");

  const hotpepperUrl = "https://www.hotpepper.jp/strJ001161672/";

  let calledApi = 0;
  let calledHtml = 0;

  const mockedFetch: typeof fetch = async (input: RequestInfo | URL) => {
    const u =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input instanceof Request
            ? input.url
            : String(input);

    // HotPepper公式API（Recruit）
    if (u.startsWith("https://webservice.recruit.co.jp/hotpepper/gourmet/v1/")) {
      calledApi++;
      const payload = {
        results: {
          shop: [
            {
              id: "J001161672",
              name: "テスト店舗",
              address: "大阪府大阪市北区…",
              lat: "34.7000",
              lng: "135.5000",
              urls: { pc: hotpepperUrl },
              photo: { mobile: { l: "https://example.com/photo-l.jpg" } },
            },
          ],
        },
      };
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    // 汎用フォールバックのHTML fetch まで行ってないことを確認したい
    if (u === hotpepperUrl) {
      calledHtml++;
      return new Response("<html></html>", {
        status: 200,
        headers: { "content-type": "text/html" },
      });
    }

    throw new Error(`unexpected fetch url: ${u}`);
  };

  const res = await withMockedFetch(mockedFetch, () =>
    handleRequest(
      new Request("http://localhost/functions/v1/extract-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: hotpepperUrl }),
      })
    )
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`expected 2xx, got ${res.status}: ${text}`);
  }

  const data = await res.json();
  if (calledApi !== 1) throw new Error(`expected calledApi=1, got ${calledApi}`);
  if (calledHtml !== 0) throw new Error(`expected calledHtml=0, got ${calledHtml}`);

  if (!data?.images?.length) throw new Error("expected images in response");
  if (data.images[0].source !== "hotpepper:api") {
    throw new Error(`expected source=hotpepper:api, got ${data.images[0].source}`);
  }
});

