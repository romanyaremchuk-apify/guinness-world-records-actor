import { createHttpRouter } from '@crawlee/http';
import { Actor, log } from 'apify';
import { LABELS, PER_PAGE } from './constants.js';
import type { GwrApiResponse, UserData } from './types.js';
import { buildPageRequest, buildRecordUrl, stripHtml } from './utils.js';

export const router = createHttpRouter();

router.addHandler<UserData[typeof LABELS.SEARCH]>(LABELS.SEARCH, async ({ body, request, crawler }) => {
    const { page, searchType, searchTerm, maxItems } = request.userData;
    const data = JSON.parse(body as string) as GwrApiResponse;
    const results = (data.Results ?? []).filter((r) => r.Type === searchType);

    log.info(`Page ${page}: fetched ${results.length} records`);

    // On the first page, use TotalItems to enqueue only as many pages as actually exist.
    if (page === 1) {
        const clampedMax = Math.min(maxItems, data.TotalItems);
        const pagesNeeded = Math.ceil(clampedMax / PER_PAGE);
        if (pagesNeeded > 1) {
            await crawler.addRequests(
                Array.from({ length: pagesNeeded - 1 }, (_, i) =>
                    buildPageRequest(i + 2, searchTerm, clampedMax, searchType),
                ),
            );
        }
    }

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
