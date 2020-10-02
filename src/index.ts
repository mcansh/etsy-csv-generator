import path from "path";
import { format } from "url";

import fetch, { RequestInfo, RequestInit } from "node-fetch";
import { createObjectCsvWriter } from "csv-writer";
import he from "he";
import * as dotenv from "dotenv";

import { ApiResponse, Result } from "./@types/shop";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const {
  ETSY_SHOP_NAME,
  ETSY_API_KEY,
  ETSY_SHOP_SLUG,
  ETSY_DOMAIN,
  ETSY_CATEGORY,
} = process.env;

if (!ETSY_SHOP_NAME || !ETSY_API_KEY || !ETSY_SHOP_SLUG || !ETSY_DOMAIN) {
  throw new Error(
    `Missing one of the following environment variables 'ETSY_SHOP_NAME', 'ETSY_API_KEY', 'ETSY_SHOP_SLUG', 'ETSY_DOMAIN'`
  );
}

const typedFetch = async <T extends any>(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<T> => {
  const promise = await fetch(input, init);
  if (!promise.ok) {
    throw new Error(promise.statusText);
  }

  return promise.json() as T;
};

async function fetchShopListings(
  page: number,
  currentItems: Result[] = []
): Promise<any> {
  const url = format({
    protocol: "https",
    host: "openapi.etsy.com",
    pathname: `/v2/shops/${ETSY_SHOP_SLUG}/listings/active`,
    query: {
      api_key: ETSY_API_KEY,
      limit: 100,
      page,
      includes: "MainImage",
    },
  });

  const data = await typedFetch<ApiResponse>(url);

  const items = data.results.filter((item) => !item.is_digital);

  const nextPage = data.pagination.next_page;

  const merged = [...currentItems, ...items];

  if (nextPage) return fetchShopListings(nextPage, merged);

  const csvWriter = createObjectCsvWriter({
    path: "./output.csv",
    header: [
      { id: "id", title: "id" },
      { id: "title", title: "title" },
      { id: "description", title: "description" },
      { id: "availability", title: "availability" },
      { id: "condition", title: "condition" },
      { id: "price", title: "price" },
      { id: "link", title: "link" },
      { id: "image_link", title: "image_link" },
      { id: "brand", title: "brand" },
      { id: "google_product_category", title: "google_product_category" },
    ],
  });

  const records = merged.map((item) => {
    return {
      id: item.listing_id,
      title: he.decode(item.title),
      description: he.decode(item.description),
      availability: "in stock",
      condition: "new",
      price: `${item.price} ${item.currency_code}`,
      link: item.url.replace("https://www.etsy.com", ETSY_DOMAIN),
      image_link: item.MainImage.url_fullxfull,
      brand: ETSY_SHOP_NAME,
      google_product_category: ETSY_CATEGORY
        ? ETSY_CATEGORY
        : item.taxonomy_path.join(" > ") || "",
    };
  });

  return csvWriter.writeRecords(records);
}

fetchShopListings(1);
