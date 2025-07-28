import { NextResponse } from "next/server"

// Free translation APIs worldwide
const TRANSLATION_PROVIDERS = {
  mymemory: {
    url: "https://api.mymemory.translated.net/get",
    // Completely free, no key needed
  },
  libretranslate: {
    url: "https://libretranslate.de/translate",
    // Free and open source
  },
  googletranslate: {
    url: "https://translate.googleapis.com/translate_a/single",
    // Free tier available
  },
}

// Supported languages for global reach
const SUPPORTED_LANGUAGES = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  ar: "Arabic",
  hi: "Hindi",
  tr: "Turkish",
  pl: "Polish",
  nl: "Dutch",
}

async function translateWithMyMemory(text: string, fromLang: string, toLang: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`,
    )

    if (response.ok) {
      const result = await response.json()
      return result.responseData?.translatedText || text
    }
  } catch (error) {
    console.error("MyMemory translation error:", error)
  }
  return text
}

async function translateWithLibreTranslate(text: string, fromLang: string, toLang: string): Promise<string> {
  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: fromLang,
        target: toLang,
        format: "text",
      }),
    })

    if (response.ok) {
      const result = await response.json()
      return result.translatedText || text
    }
  } catch (error) {
    console.error("LibreTranslate error:", error)
  }
  return text
}

export async function POST(request: Request) {
  try {
    const { text, fromLang = "en", toLang, article } = await request.json()

    if (!text || !toLang) {
      return NextResponse.json({ error: "Text and target language are required" }, { status: 400 })
    }

    if (!SUPPORTED_LANGUAGES[toLang as keyof typeof SUPPORTED_LANGUAGES]) {
      return NextResponse.json({ error: "Unsupported language" }, { status: 400 })
    }

    // Try multiple translation providers
    let translatedText = await translateWithMyMemory(text, fromLang, toLang)

    if (translatedText === text) {
      translatedText = await translateWithLibreTranslate(text, fromLang, toLang)
    }

    // If translating full article
    if (article) {
      const translatedArticle = {
        ...article,
        title: await translateWithMyMemory(article.title, fromLang, toLang),
        summary: await translateWithMyMemory(article.summary, fromLang, toLang),
        content: await translateWithMyMemory(article.content, fromLang, toLang),
        language: toLang,
      }

      return NextResponse.json({ article: translatedArticle })
    }

    return NextResponse.json({
      translatedText,
      fromLanguage: SUPPORTED_LANGUAGES[fromLang as keyof typeof SUPPORTED_LANGUAGES],
      toLanguage: SUPPORTED_LANGUAGES[toLang as keyof typeof SUPPORTED_LANGUAGES],
    })
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json({ error: "Translation failed" }, { status: 500 })
  }
}
