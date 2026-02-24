import { setTimeout } from 'node:timers/promises';

import { HttpCrawler } from '@crawlee/http';
import { Actor, log } from 'apify';

import { router } from './routes.js';
import type { UserInput } from './types.js';
import { buildPageRequest } from './utils.js';

await Actor.init();

Actor.on('aborting', async () => {
    await setTimeout(1000);
    await Actor.exit();
});

const { searchTerm, searchType, maxItems } = await Actor.getInputOrThrow<UserInput>();

log.info(`Scraping "${searchTerm}" — up to ${maxItems} item(s)`);

const crawler = new HttpCrawler({
    maxConcurrency: 5, // limit to avoid overloading the Guinness API
    requestHandler: router,
});

await crawler.run([buildPageRequest(1, searchTerm, maxItems, searchType)]);

log.info('Scraping finished');
await Actor.exit();
