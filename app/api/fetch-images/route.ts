import { NextResponse } from "next/server"

// Guaranteed working image sources (no CORS issues)
const RELIABLE_IMAGE_SOURCES = {
  // Direct image URLs (no API calls needed)
  unsplash_direct: {
    technology: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=400&fit=crop",
    ],
    ai: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop",
    ],
    mobile: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&h=400&fit=crop",
    ],
    security: [
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop",
    ],
    startup: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1515378791036-0648a814c963?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    ],
  },

  // Picsum (always works, no CORS)
  picsum: "https://picsum.photos/800/400",

  // Lorem Picsum with seeds (consistent images)
  picsum_seeded: [
    "https://picsum.photos/seed/tech1/800/400",
    "https://picsum.photos/seed/tech2/800/400",
    "https://picsum.photos/seed/tech3/800/400",
    "https://picsum.photos/seed/ai1/800/400",
    "https://picsum.photos/seed/ai2/800/400",
    "https://picsum.photos/seed/mobile1/800/400",
    "https://picsum.photos/seed/mobile2/800/400",
    "https://picsum.photos/seed/security1/800/400",
    "https://picsum.photos/seed/security2/800/400",
    "https://picsum.photos/seed/startup1/800/400",
  ],

  // Placeholder.com (guaranteed to work)
  placeholder: "https://via.placeholder.com/800x400",

  // DummyImage (always works)
  dummyimage: "https://dummyimage.com/800x400",
}

// AI Image Generation (working APIs only)
async function generatePollinationsImage(prompt: string): Promise<string> {
  try {
    const cleanPrompt = encodeURIComponent(`${prompt} professional technology modern clean`)
    const imageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=800&height=400&nologo=true&enhance=true`

    // Test if the URL works
    const testResponse = await fetch(imageUrl, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    })

    if (testResponse.ok) {
      return imageUrl
    }
  } catch (error) {
    console.error("Pollinations failed:", error)
  }
  return ""
}

// Get category-specific image
function getCategoryImage(category: string, keywords: string[]): string {
  const categoryKey = category.toLowerCase()
  const images =
    RELIABLE_IMAGE_SOURCES.unsplash_direct[categoryKey as keyof typeof RELIABLE_IMAGE_SOURCES.unsplash_direct]

  if (images && images.length > 0) {
    // Use keywords to select most relevant image
    const randomIndex = Math.floor(Math.random() * images.length)
    return images[randomIndex]
  }

  // Fallback to general tech images
  const techImages = RELIABLE_IMAGE_SOURCES.unsplash_direct.technology
  const randomIndex = Math.floor(Math.random() * techImages.length)
  return techImages[randomIndex]
}

// Get seeded random image (consistent for same content)
function getSeededImage(title: string): string {
  const seed = title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .substring(0, 10)
  return `https://picsum.photos/seed/${seed}/800/400`
}

// Create custom placeholder with text
function createCustomPlaceholder(title: string, category: string): string {
  const colors = {
    tech: "2563eb/ffffff",
    ai: "7c3aed/ffffff",
    mobile: "ea580c/ffffff",
    security: "dc2626/ffffff",
    startup: "059669/ffffff",
    default: "374151/ffffff",
  }

  const color = colors[category.toLowerCase() as keyof typeof colors] || colors.default
  const text = encodeURIComponent(title.substring(0, 25))

  return `https://via.placeholder.com/800x400/${color}?text=${text}`
}

// Main image generation with guaranteed fallbacks
async function generateGuaranteedImage(
  title: string,
  summary: string,
  category: string,
): Promise<{ imageUrl: string; provider: string; keywords: string[] }> {
  const keywords = extractKeywords(title, summary, category)
  const searchQuery = keywords.slice(0, 3).join(" ")

  console.log(`🎨 Generating image for: "${title}" (Category: ${category})`)

  // Method 1: Try AI generation (best quality)
  try {
    const aiImage = await generatePollinationsImage(searchQuery)
    if (aiImage) {
      console.log("✅ AI Generated image")
      return { imageUrl: aiImage, provider: "Pollinations AI", keywords }
    }
  } catch (error) {
    console.log("❌ AI generation failed")
  }

  // Method 2: Category-specific curated images
  try {
    const categoryImage = getCategoryImage(category, keywords)
    console.log("✅ Category-specific image")
    return { imageUrl: categoryImage, provider: "Curated Unsplash", keywords }
  } catch (error) {
    console.log("❌ Category image failed")
  }

  // Method 3: Seeded random image (consistent)
  try {
    const seededImage = getSeededImage(title)
    console.log("✅ Seeded random image")
    return { imageUrl: seededImage, provider: "Picsum Seeded", keywords }
  } catch (error) {
    console.log("❌ Seeded image failed")
  }

  // Method 4: Random picsum (always works)
  try {
    const randomImage = `${RELIABLE_IMAGE_SOURCES.picsum}?random=${Date.now()}`
    console.log("✅ Random Picsum image")
    return { imageUrl: randomImage, provider: "Picsum Random", keywords }
  } catch (error) {
    console.log("❌ Random image failed")
  }

  // Method 5: Custom placeholder (guaranteed)
  const placeholderImage = createCustomPlaceholder(title, category)
  console.log("✅ Custom placeholder")
  return { imageUrl: placeholderImage, provider: "Custom Placeholder", keywords }
}

// Extract keywords from content
function extractKeywords(title: string, summary: string, category: string): string[] {
  const text = `${title} ${summary}`.toLowerCase()
  const words = text.match(/\b\w{4,}\b/g) || []

  const relevantWords = words.filter(
    (word) => !["this", "that", "with", "from", "they", "have", "been", "will", "more", "than"].includes(word),
  )

  return [category, ...relevantWords.slice(0, 5)]
}

export async function POST(request: Request) {
  try {
    const { title, summary, category, keywords } = await request.json()

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    console.log(`🎯 Image request: "${title}"`)

    const result = await generateGuaranteedImage(title, summary || "", category || "tech")

    console.log(`🎉 Image generated: ${result.provider}`)

    return NextResponse.json({
      imageUrl: result.imageUrl,
      provider: result.provider,
      keywords: result.keywords,
      success: true,
      metadata: {
        title: title.substring(0, 50),
        category: category || "tech",
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("❌ Image generation error:", error)

    // Emergency fallback - guaranteed to work
    const emergencyImage = `https://via.placeholder.com/800x400/1f2937/ffffff?text=${encodeURIComponent("AI News Hub")}`

    return NextResponse.json({
      imageUrl: emergencyImage,
      provider: "Emergency Fallback",
      keywords: ["technology", "news"],
      success: false,
      error: "Used emergency fallback",
    })
  }
}
