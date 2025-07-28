import { NextResponse } from "next/server"

// Image cache management
const imageCache = new Map<string, { url: string; timestamp: number; provider: string }>()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

// Additional free image sources worldwide
const GLOBAL_IMAGE_SOURCES = {
  // European Sources
  europeana: "https://api.europeana.eu/record/v2/search.json",
  wikimedia: "https://commons.wikimedia.org/w/api.php",

  // Asian Sources
  flickr_commons: "https://api.flickr.com/services/rest/",

  // Government Sources (Public Domain)
  nasa_images: "https://images-api.nasa.gov/search",
  smithsonian: "https://api.si.edu/openaccess/api/v1.0/search",

  // Creative Commons
  openverse: "https://api.openverse.engineering/v1/images/",
  creative_commons: "https://search.creativecommons.org/api/v1/images/",
}

// NASA Images API (completely free, high quality)
async function getNASAImage(query: string): Promise<string> {
  try {
    const response = await fetch(
      `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image&page_size=10`,
    )

    if (response.ok) {
      const data = await response.json()
      if (data.collection?.items?.length > 0) {
        const randomItem = data.collection.items[Math.floor(Math.random() * data.collection.items.length)]
        const imageUrl = randomItem.links?.[0]?.href
        if (imageUrl) return imageUrl
      }
    }
  } catch (error) {
    console.error("NASA Images error:", error)
  }
  return ""
}

// Wikimedia Commons (free, high quality)
async function getWikimediaImage(query: string): Promise<string> {
  try {
    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=10&origin=*`,
    )

    if (response.ok) {
      const data = await response.json()
      if (data.query?.search?.length > 0) {
        const randomResult = data.query.search[Math.floor(Math.random() * data.query.search.length)]
        const filename = randomResult.title.replace("File:", "")
        return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=800`
      }
    }
  } catch (error) {
    console.error("Wikimedia error:", error)
  }
  return ""
}

// Openverse (Creative Commons)
async function getOpenverseImage(query: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.openverse.engineering/v1/images/?q=${encodeURIComponent(query)}&license=cc0,pdm,by,by-sa,by-nc,by-nd,by-nc-sa,by-nc-nd&page_size=10`,
    )

    if (response.ok) {
      const data = await response.json()
      if (data.results?.length > 0) {
        const randomImage = data.results[Math.floor(Math.random() * data.results.length)]
        return randomImage.url
      }
    }
  } catch (error) {
    console.error("Openverse error:", error)
  }
  return ""
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || "technology"
    const category = searchParams.get("category") || "tech"

    // Check cache first
    const cacheKey = `${query}-${category}`
    const cached = imageCache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        imageUrl: cached.url,
        provider: cached.provider,
        cached: true,
        keywords: query.split(" "),
      })
    }

    // Try additional sources
    const additionalSources = [
      { name: "NASA Images", fn: () => getNASAImage(query) },
      { name: "Wikimedia Commons", fn: () => getWikimediaImage(query) },
      { name: "Openverse", fn: () => getOpenverseImage(query) },
    ]

    for (const source of additionalSources) {
      try {
        const imageUrl = await source.fn()
        if (imageUrl) {
          // Cache the result
          imageCache.set(cacheKey, {
            url: imageUrl,
            timestamp: Date.now(),
            provider: source.name,
          })

          return NextResponse.json({
            imageUrl,
            provider: source.name,
            cached: false,
            keywords: query.split(" "),
          })
        }
      } catch (error) {
        console.error(`${source.name} failed:`, error)
        continue
      }
    }

    return NextResponse.json({ error: "No images found" }, { status: 404 })
  } catch (error) {
    console.error("Image cache error:", error)
    return NextResponse.json({ error: "Cache error" }, { status: 500 })
  }
}

export async function DELETE() {
  // Clear image cache
  imageCache.clear()
  return NextResponse.json({ message: "Cache cleared" })
}
