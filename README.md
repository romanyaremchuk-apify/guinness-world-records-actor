# Guinness World Records Scraper

An [Apify Actor](https://apify.com/actors) that scrapes records, news articles, and pages from [Guinness World Records](https://www.guinnessworldrecords.com/) by search term.

## What it does

- Searches the Guinness World Records API by a given term
- Returns structured data including title, URL, categories, location, keywords, and dates
- Supports filtering by content type: records, news articles, or pages

## Output

Each item in the dataset contains:

```json
{
  "title": "Fastest 100m sprint",
  "status": "Current",
  "content": "...",
  "slug": "fastest-100m-sprint",
  "categories": ["Athletics"],
  "location": ["Jamaica"],
  "type": "record",
  "pubDate": "2009-08-16T00:00:00Z",
  "lastUpdated": "2023-01-01T00:00:00Z",
  "keywords": ["running", "speed"],
  "url": "https://www.guinnessworldrecords.com/world-records/fastest-100m-sprint"
}
```

## Resources

- [Apify SDK documentation](https://docs.apify.com/sdk/js)
- [Crawlee documentation](https://crawlee.dev)
- [Apify platform documentation](https://docs.apify.com/platform)
