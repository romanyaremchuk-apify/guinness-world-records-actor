import { setTimeout } from 'node:timers/promises';

import { HttpCrawler } from '@crawlee/http';
import { Actor, log } from 'apify';

import { createRouter } from './routes.js';
import { PER_PAGE } from './constants.js';
import type { UserInput } from './types.js';
import { getStartUrls } from './utils.js';
await Actor.init();

Actor.on('aborting', async () => {
    await setTimeout(1000);
    await Actor.exit();
});

const { searchTerm, searchType, maxItems } = await Actor.getInputOrThrow<UserInput>();

if (maxItems <= 0) {
    log.error('maxItems must be a positive integer');
    await Actor.exit({ exitCode: 1 });
}

const pagesNeeded = Math.ceil(maxItems / PER_PAGE);
log.info(`Scraping "${searchTerm}" — ${maxItems} items over ${pagesNeeded} page(s)`);

const startUrls = getStartUrls(pagesNeeded, searchTerm, maxItems, searchType);

const crawler = new HttpCrawler({
    maxConcurrency: 5, // limit to avoid overloading the Guinness API
    requestHandler: createRouter(),
});

await crawler.run(startUrls);

log.info('Scraping finished');
await Actor.exit();
