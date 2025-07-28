import { NextResponse } from "next/server"

// Comprehensive global RSS feeds (all free)
const GLOBAL_RSS_FEEDS = {
  technology: [
    "https://feeds.feedburner.com/TechCrunch",
    "https://www.wired.com/feed/rss",
    "https://feeds.arstechnica.com/arstechnica/index",
    "https://www.theverge.com/rss/index.xml",
    "https://feeds.feedburner.com/venturebeat/SZYF",
    "https://feeds.feedburner.com/Mashable",
    "https://feeds.feedburner.com/GizmodoFeed",
    "https://www.engadget.com/rss.xml",
    "https://feeds.feedburner.com/ommalik",
    "https://feeds.feedburner.com/readwriteweb",
  ],
  ai: [
    "https://feeds.feedburner.com/AINews",
    "https://www.artificialintelligence-news.com/feed/",
    "https://feeds.feedburner.com/MachineLearningMastery",
    "https://feeds.feedburner.com/kdnuggets-data-mining-analytics",
    "https://www.unite.ai/feed/",
    "https://feeds.feedburner.com/oreilly/radar",
  ],
  cybersecurity: [
    "https://feeds.feedburner.com/TheHackersNews",
    "https://feeds.feedburner.com/securityweek",
    "https://www.darkreading.com/rss.xml",
    "https://feeds.feedburner.com/CyberSecurityNews",
    "https://www.bleepingcomputer.com/feed/",
    "https://feeds.feedburner.com/KrebsOnSecurity",
  ],
  mobile: [
    "https://feeds.feedburner.com/AndroidCentral",
    "https://feeds.feedburner.com/9to5Mac-MacAllDay",
    "https://feeds.feedburner.com/Phonearena",
    "https://www.gsmarena.com/rss-news-reviews.php3",
    "https://feeds.feedburner.com/androidpolice",
  ],
  startup: [
    "https://feeds.feedburner.com/entrepreneur/latest",
    "https://feeds.feedburner.com/fastcompany/headlines",
    "https://feeds.feedburner.com/inc/headlines",
    "https://feeds.feedburner.com/venturebeat/SZYF",
    "https://feeds.feedburner.com/crunchbase-news",
  ],
  global: [
    "https://feeds.bbci.co.uk/news/technology/rss.xml",
    "https://www.reuters.com/technology/rss",
    "https://feeds.feedburner.com/time/topstories",
    "https://feeds.feedburner.com/cnn/topstories",
    "https://feeds.feedburner.com/ap-topnews",
  ],
}

interface RSSItem {
  title: string
  description: string
  link: string
  pubDate: string
  category: string
  source: string
  keywords: string[]
}

// Enhanced RSS parser with better content extraction
function parseRSSFeed(xmlText: string, category: string, source: string): RSSItem[] {
  const items: RSSItem[] = []

  try {
    // Remove CDATA and clean XML
    const cleanXml = xmlText.replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1")

    // Extract items with improved regex
    const itemMatches = cleanXml.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || []

    itemMatches.forEach((itemXml, index) => {
      if (index >= 10) return // Limit to 10 items per feed

      const title = itemXml
        .match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
        ?.replace(/<[^>]*>/g, "")
        .trim()

      let description = itemXml
        .match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1]
        ?.replace(/<[^>]*>/g, "")
        .trim()

      // Try content:encoded if description is short
      if (!description || description.length < 50) {
        description = itemXml
          .match(/<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/i)?.[1]
          ?.replace(/<[^>]*>/g, "")
          .trim()
      }

      const link = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]?.trim()

      const pubDate = itemXml.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1]?.trim() || new Date().toISOString()

      // Extract keywords from content
      const keywords = extractKeywords(title + " " + description)

      if (title && description && link && title.length > 10) {
        items.push({
          title: title.substring(0, 200),
          description: description.substring(0, 300) + "...",
          link,
          pubDate,
          category,
          source,
          keywords,
        })
      }
    })
  } catch (error) {
    console.error(`Error parsing RSS feed from ${source}:`, error)
  }

  return items
}

// Extract keywords for better categorization
function extractKeywords(text: string): string[] {
  const commonWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "must",
    "can",
    "this",
    "that",
    "these",
    "those",
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
    "me",
    "him",
    "her",
    "us",
    "them",
  ])

  return (
    text
      .toLowerCase()
      .match(/\b\w{4,}\b/g)
      ?.filter((word) => !commonWords.has(word))
      .slice(0, 10) || []
  )
}

// Fetch with retry mechanism
async function fetchWithRetry(url: string, retries = 3): Promise<string | null> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "AI-News-Hub/2.0 (Professional News Aggregator)",
          Accept: "application/rss+xml, application/xml, text/xml",
        },
        timeout: 10000,
      })

      if (response.ok) {
        return await response.text()
      }
    } catch (error) {
      console.error(`Attempt ${i + 1} failed for ${url}:`, error)
      if (i === retries - 1) return null
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
  return null
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || "all"
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const allItems: RSSItem[] = []
    const feedPromises: Promise<void>[] = []

    // Select feeds based on category
    const feedsToFetch =
      category === "all"
        ? Object.values(GLOBAL_RSS_FEEDS).flat()
        : GLOBAL_RSS_FEEDS[category as keyof typeof GLOBAL_RSS_FEEDS] || GLOBAL_RSS_FEEDS.technology

    // Fetch from multiple RSS feeds concurrently
    feedsToFetch.slice(0, 8).forEach((feedUrl) => {
      feedPromises.push(
        fetchWithRetry(feedUrl)
          .then((xmlText) => {
            if (xmlText) {
              const feedCategory =
                Object.keys(GLOBAL_RSS_FEEDS).find((cat) =>
                  GLOBAL_RSS_FEEDS[cat as keyof typeof GLOBAL_RSS_FEEDS].includes(feedUrl),
                ) || "technology"

              const source = new URL(feedUrl).hostname.replace("www.", "")
              const items = parseRSSFeed(xmlText, feedCategory, source)
              allItems.push(...items)
            }
          })
          .catch((error) => {
            console.error(`Failed to process feed ${feedUrl}:`, error)
          }),
      )
    })

    await Promise.all(feedPromises)

    // Sort by date and remove duplicates
    const uniqueItems = allItems
      .filter((item, index, self) => index === self.findIndex((t) => t.title === item.title))
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, limit)

    return NextResponse.json({
      items: uniqueItems,
      total: uniqueItems.length,
      categories: Object.keys(GLOBAL_RSS_FEEDS),
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching RSS feeds:", error)
    return NextResponse.json({ error: "Failed to fetch RSS feeds" }, { status: 500 })
  }
}
