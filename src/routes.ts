import { createHttpRouter } from '@crawlee/http';
import { Actor, log } from 'apify';
import { LABELS } from './constants.js';
import type { GwrApiResponse, UserData } from './types.js';
import { buildRecordUrl, stripHtml } from './utils.js';

export function createRouter() {
    const router = createHttpRouter();

    router.addHandler<UserData[typeof LABELS.SEARCH]>(LABELS.SEARCH, async ({ body, request }) => {
        const { page, searchType } = request.userData;
        const data = JSON.parse(body as string) as GwrApiResponse;
        const results = (data.Results ?? []).filter((r) => r.Type === searchType);

        log.info(`Page ${page}: fetched ${results.length} records`);

        await Actor.pushData(
            results.map((r) => ({
                title: r.Title,
                status: r.Status,
                content: stripHtml(r.Content),
                slug: r.Slug,
                categories: r.Categories,
                location: r.Location,
                type: r.Type,
                pubDate: r.PubDate,
                lastUpdated: r.LastUpdated,
                keywords: r.Keywords,
                url: buildRecordUrl(r.Slug, r.Type, r.PubDate),
            })),
        );
    });

    return router;
}
