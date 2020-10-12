import { format } from 'url';

import fetch, { RequestInfo, RequestInit } from 'node-fetch';
import { createObjectCsvWriter } from 'csv-writer';
import he from 'he';

import { ApiResponse, Result } from './@types/shop';

const typedFetch = async <T>(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<T> => {
  const promise = await fetch(input, init);
  if (!promise.ok) {
    throw new Error(promise.statusText);
  }

  return promise.json();
};

export interface Options {
  /**
   * @description the name of your shop
   */
  shop: string;
  /**
   * @description the slug of your shop, found after https://etsy.com/
   */
  slug: string;
  /**
   * @description the custom domain you have pointed to your shop
   */
  domain: string;
  /**
   * @description the api key you got from etsy.
   */
  apiKey: string;
  /**
   * @description a fallback taxonomy path
   * @see https://www.google.com/basepages/producttype/taxonomy.en-US.txt
   * @example Arts & Entertainment > Party & Celebration > Gift Giving > Greeting & Note Cards
   */
  fallbackTaxonomy?: string;
  /**
   * @description whether or not to filter out digital listings
   * @default true
   */
  noDigital: boolean;
}

async function fetchShopListings(
  options: Options,
  page: number,
  currentItems: Result[] = []
): Promise<void> {
  const url = format({
    protocol: 'https',
    host: 'openapi.etsy.com',
    pathname: `/v2/shops/${options.slug}/listings/active`,
    query: {
      api_key: options.apiKey,
      limit: 100,
      page,
      includes: 'MainImage',
    },
  });

  const data = await typedFetch<ApiResponse>(url);

  const items = options.noDigital
    ? data.results.filter((item) => !item.is_digital)
    : data.results;

  const nextPage = data.pagination.next_page;

  const merged = [...currentItems, ...items];

  if (nextPage) return fetchShopListings(options, nextPage, merged);

  const csvWriter = createObjectCsvWriter({
    path: `./${options.slug}.csv`,
    header: [
      { id: 'id', title: 'id' },
      { id: 'title', title: 'title' },
      { id: 'description', title: 'description' },
      { id: 'availability', title: 'availability' },
      { id: 'condition', title: 'condition' },
      { id: 'price', title: 'price' },
      { id: 'link', title: 'link' },
      { id: 'image_link', title: 'image_link' },
      { id: 'brand', title: 'brand' },
      { id: 'google_product_category', title: 'google_product_category' },
    ],
  });

  const records = merged.map((item) => {
    return {
      id: item.listing_id,
      title: he.decode(item.title),
      description: he.decode(item.description),
      availability: 'in stock',
      condition: 'new',
      price: `${item.price} ${item.currency_code}`,
      link: item.url.replace('https://www.etsy.com', options.domain),
      image_link: item.MainImage.url_fullxfull,
      brand: options.shop,
      google_product_category:
        item.taxonomy_path?.join(' > ') ?? options.fallbackTaxonomy ?? '',
    };
  });

  return csvWriter.writeRecords(records);
}

export { fetchShopListings };
