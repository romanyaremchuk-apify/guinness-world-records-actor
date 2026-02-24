import type { LABELS } from './constants.js';

export type UserInput = {
    searchTerm: string;
    searchType?: 'record' | 'newsarticle' | 'page';
    maxItems: number;
};

export type UserData = {
    [LABELS.SEARCH]: { page: number; searchType: NonNullable<UserInput['searchType']> };
};

export interface GwrRecord {
    Title: string | null;
    Status: string | null;
    Content: string;
    Slug: string | null;
    Categories: string[];
    Location: string[];
    Type: string;
    PubDate: string | null;
    LastUpdated: string;
    Keywords: string[];
}

export interface GwrApiResponse {
    Results: GwrRecord[];
    TotalItems: number;
}
