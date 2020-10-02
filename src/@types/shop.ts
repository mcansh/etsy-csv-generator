export interface ApiResponse {
  count: number;
  results: Result[];
  params: Params;
  type: string;
  pagination: Pagination;
}

export interface Pagination {
  effective_limit: number;
  effective_offset: number;
  next_offset: number | null;
  effective_page: number;
  next_page: number | null;
}

export interface Params {
  limit: string;
  offset: number;
  page: string;
  shop_id: string;
  keywords: null;
  sort_on: string;
  sort_order: string;
  min_price: null;
  max_price: null;
  color: null;
  color_accuracy: number;
  tags: null;
  taxonomy_id: null;
  translate_keywords: string;
  include_private: number;
}

export interface Result {
  listing_id: number;
  state: string;
  user_id: number;
  category_id: null;
  title: string;
  description: string;
  creation_tsz: number;
  ending_tsz: number;
  original_creation_tsz: number;
  last_modified_tsz: number;
  price: string;
  currency_code: string;
  quantity: number;
  sku: any[];
  tags: string[];
  materials: string[];
  shop_section_id: number;
  featured_rank: number | null;
  state_tsz: number;
  url: string;
  views: number;
  num_favorers: number;
  shipping_template_id: number | null;
  processing_min: number | null;
  processing_max: number | null;
  who_made: string;
  is_supply: string;
  when_made: string;
  item_weight: null | string;
  item_weight_unit: string;
  item_length: null | string;
  item_width: null | string;
  item_height: null | string;
  item_dimensions_unit: string;
  is_private: boolean;
  recipient: null;
  occasion: null;
  style: null;
  non_taxable: boolean;
  is_customizable: boolean;
  is_digital: boolean;
  file_data: string;
  should_auto_renew: boolean;
  language: string;
  has_variations: boolean;
  taxonomy_id: number;
  taxonomy_path: string[];
  used_manufacturer: boolean;
  is_vintage: boolean;
}
