# etsy-csv-generator

Generate a csv file for your etsy store, originally made for an instagram shop bulk upload

## Before you get started

1. You'll need an Etsy shop
2. You'll need to register as an [Etsy developer](https://www.etsy.com/developers/register)
3. You'll need a recent version of [node](https://nodejs.org/en/) >= 12

## Getting Started

1. Clone or [download](https://github.com/mcansh/etsy-csv-generator/archive/main.zip) the project `git clone https://github.com/mcansh/etsy-csv-generator`
2. Install dependencies `npm ci`
3. Setup environment variables
    - Copy or rename `env.sample` to `.env` `cp env.sample .env`
    - Fill out the env file
      - `ETSY_SHOP_NAME` will be your brand
      - `ETSY_DOMAIN` will be the domain you provide facebook/instagram
      - `ETSY_SHOP_SLUG` is what shows up after https://etsy.com/

4. In my usecase I wanted to filter out `downloadable` products, if you want to keep them, remove everything on this [line](https://github.com/mcansh/etsy-csv-generator/blob/0d7667fd75a0b9914fd95b57fa91225cace70fb6/src/index.ts#L57) after `data.results`
5. Build the app `npm run build`
6. Run it! `node dist`
7. You'll now have an `output.csv` in the root of the project :)
