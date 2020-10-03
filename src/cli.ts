#!/usr/bin/env node

import sade from 'sade';
import kleur from 'kleur';
import { fetchShopListings, Options } from './';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json');

const prog = sade(pkg.name).version(pkg.version);

prog
  .command('generate')
  .option('--shop', 'the name of your shop')
  .option('--slug', 'the slug of your shop, found after https://etsy.com/')
  .option('--domain', 'the custom domain you have pointed to your shop')
  .option('--apiKey', 'the api key you got from etsy')
  .option('--fallbackTaxonomy', 'a fallback taxonomy path')
  .option('--noDigital', 'whether or not to filter out digital listings', true)
  .action(async (args: Options) => {
    if (!args.shop || !args.slug || !args.domain || !args.apiKey) {
      console.log(
        kleur.red(
          `You must supply all of the following arguments: 'shop', 'slug', 'domain', and 'apiKey'`
        )
      );
      process.exit(1);
    }

    try {
      await fetchShopListings(args, 1, []);
      console.log(kleur.green(`saved ${args.slug}.csv!`));
      process.exit(0);
    } catch (error) {
      console.error(kleur.red('something went wrong'));
      process.exit(1);
    }
  });

prog.parse(process.argv);
