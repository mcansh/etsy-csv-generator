/// <reference types="node" />

// Extend the NodeJS namespace with variables in next.config.js
declare namespace NodeJS {
  interface ProcessEnv {
    readonly ETSY_SHOP_NAME: string | undefined;
    readonly ETSY_API_KEY: string | undefined;
    readonly ETSY_DOMAIN: string | undefined;
    readonly ETSY_SHOP_SLUG: string | undefined;
  }
}
