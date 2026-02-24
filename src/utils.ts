import type { RequestOptions } from 'crawlee';
import { API_URL, GWR_BASE_URL, GWR_RECORD_BASE_URL, LABELS, PER_PAGE } from './constants.js';
import type { UserData, UserInput } from './types.js';

// Strips HTML tags from a string and collapses extra whitespace.
export function stripHtml(html: string | null): string | null {
    if (!html) return html;
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Builds the full GWR URL for a result item.
// Slugs from the API can be bare ("some-slug"), full-path ("/news/2023/9/some-slug.html"),
// or bare newsarticle slugs that need year/month from pubDate.
export function buildRecordUrl(slug: string | null, type: string, pubDate: string | null): string | null {
    if (!slug) return null;
    // API sometimes returns slugs with a leading slash — normalize it away.
    const normalizedSlug = slug.startsWith('/') ? slug.slice(1) : slug;
    if (type === 'record') {
        return `${GWR_RECORD_BASE_URL}${normalizedSlug}`;
    }
    if (type === 'newsarticle') {
        // Slug already contains the full path (e.g. "news/commercial/2015/9/slug.html").
        if (normalizedSlug.startsWith('news/')) {
            return `${GWR_BASE_URL}/${normalizedSlug}`;
        }
        // Bare slug — derive year/month from pubDate.
        if (pubDate) {
            const date = new Date(pubDate);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            return `${GWR_BASE_URL}/news/${year}/${month}/${normalizedSlug}`;
        }
    }
    return `${GWR_BASE_URL}/${normalizedSlug}`;
}

export function getStartUrls(
    pagesNeeded: number,
    searchTerm: string,
    maxItems: number,
    searchType: NonNullable<UserInput['searchType']>,
): RequestOptions<UserData[typeof LABELS.SEARCH]>[] {
    return Array.from({ length: pagesNeeded }, (_, i) => {
        const page = i + 1;
        const itemsOnPage = Math.min(PER_PAGE, maxItems - i * PER_PAGE);
        const url = `${API_URL}?term=${encodeURIComponent(searchTerm)}&page=${page}&type=${searchType}&max=${itemsOnPage}`;
        return { url, label: LABELS.SEARCH, userData: { page, searchType } };
    });
}
