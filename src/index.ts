import path from "path";

import fetch from "node-fetch";
import { createObjectCsvWriter } from "csv-writer";
import he from "he";
import * as dotenv from "dotenv";

import { ApiResponse, Result } from "./@types/shop";

dotenv.config({ path: path.join(process.cwd(), ".env") });

console.log(path.join(process.cwd(), ".env"));

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

async function fetchShopListings(
  page: number,
  currentItems: Result[] = []
): Promise<any> {
  const url = `https://openapi.etsy.com/v2/shops/${ETSY_SHOP_NAME}/listings/active?api_key=${ETSY_API_KEY}&limit=100&page=${page}`;

  const promise = await fetch(url);
  const data = (await promise.json()) as ApiResponse;

  const items = data.results.filter((item) => !item.url.includes("download"));

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
      image_link:
        "https://i.etsystatic.com/17015747/r/il/5ad817/2277807796/il_1588xN.2277807796_rd07.jpg",
      brand: ETSY_SHOP_NAME,
      google_product_category: ETSY_CATEGORY ?? "",
    };
  });

  return csvWriter.writeRecords(records);
}

fetchShopListings(1);
