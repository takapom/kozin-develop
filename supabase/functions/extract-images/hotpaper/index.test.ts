// @ts-ignore: Deno実行時は拡張子付きimportが必要
import {
  extractHotpepperShopId,
  fetchHotpepperShopById,
  tryExtractHotpaper,
// @ts-ignore: Deno実行時は拡張子付きimportが必要
} from "./index.ts";

// VSCode/TS Server側ではDenoグローバルが解決できない場合があるため宣言しておく
// （実行時はDenoが提供）
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Deno: any;

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

Deno.test("extractHotpepperShopId: HotPepper URLから店舗IDを抽出できる", () => {
  const url = "https://www.hotpepper.jp/strJ001161672/";
  const id = extractHotpepperShopId(url);
  console.log(`[extractHotpepperShopId] url=${url} -> shopId=${id}`);
  if (id !== "J001161672") {
    throw new Error(`expected J001161672, got ${id}`);
  }
});

Deno.test("extractHotpepperShopId: マッチしない場合はnull", () => {
  const url = "https://example.com/foo";
  const id = extractHotpepperShopId(url);
  if (id !== null) {
    throw new Error(`expected null, got ${id}`);
  }
});

Deno.test("fetchHotpepperShopById: APIレスポンスをパースして店舗情報を返す（fetchモック）", async () => {
  // @ts-ignore: Deno runtime API
  Deno.env.set("HOTPEPPER_API_KEY", "dummy");

  const mockedFetch: typeof fetch = async (input: RequestInfo | URL) => {
    const u =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input instanceof Request
            ? input.url
            : String(input);
    if (!u.startsWith("https://webservice.recruit.co.jp/hotpepper/gourmet/v1/")) {
      throw new Error(`unexpected url: ${u}`);
    }
    const payload = {
      results: {
        shop: [
          {
            id: "J001161672",
            name: "テスト店舗",
            address: "大阪府大阪市北区…",
            lat: "34.7000",
            lng: "135.5000",
            urls: { pc: "https://www.hotpepper.jp/strJ001161672/" },
            photo: { mobile: { l: "https://example.com/photo-l.jpg" } },
          },
        ],
      },
    };
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };

  const shop = await withMockedFetch(mockedFetch, () =>
    fetchHotpepperShopById("J001161672")
  );

  if (!shop) throw new Error("expected shop, got null");
  if (shop.id !== "J001161672") throw new Error(`unexpected id: ${shop.id}`);
  if (shop.name !== "テスト店舗") throw new Error(`unexpected name: ${shop.name}`);
  if (shop.photoL !== "https://example.com/photo-l.jpg") {
    throw new Error(`unexpected photoL: ${shop.photoL}`);
  }
});

Deno.test("tryExtractHotpaper: URL→店舗ID→APIで ExtractImagesResponse を返す（fetchモック）", async () => {
  // @ts-ignore: Deno runtime API
  Deno.env.set("HOTPEPPER_API_KEY", "dummy");

  const mockedFetch: typeof fetch = async () => {
    const payload = {
      results: {
        shop: [
          {
            id: "J001161672",
            name: "テスト店舗",
            address: "大阪府大阪市北区…",
            lat: "34.7000",
            lng: "135.5000",
            urls: { pc: "https://www.hotpepper.jp/strJ001161672/" },
            photo: { pc: { l: "https://example.com/photo-l.jpg" } },
          },
        ],
      },
    };
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };

  const result = await withMockedFetch(mockedFetch, () =>
    tryExtractHotpaper(new URL("https://www.hotpepper.jp/strJ001161672/"))
  );

  if (!result) throw new Error("expected result, got null");
  if (result.title !== "テスト店舗") throw new Error(`unexpected title: ${result.title}`);
  if (result.images.length !== 1) {
    throw new Error(`expected 1 image, got ${result.images.length}`);
  }
});

