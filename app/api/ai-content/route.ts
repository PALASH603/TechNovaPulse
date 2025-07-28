import { NextResponse } from "next/server"

// Comprehensive free AI APIs from around the world
const GLOBAL_AI_APIS = {
  // Text Generation APIs
  huggingface: {
    url: "https://api-inference.huggingface.co/models/",
    models: [
      "microsoft/DialoGPT-large",
      "facebook/blenderbot-400M-distill",
      "google/flan-t5-large",
      "EleutherAI/gpt-neo-2.7B",
      "bigscience/bloom-560m",
      "microsoft/GODEL-v1_1-large-seq2seq",
    ],
    free: true,
  },
  cohere: {
    url: "https://api.cohere.ai/v1/generate",
    model: "command-light",
    free: true, // Trial available
  },
  ai21: {
    url: "https://api.ai21.com/studio/v1/j2-light/complete",
    free: true, // Free tier
  },
  gooseai: {
    url: "https://api.goose.ai/v1/engines/gpt-neo-20b/completions",
    free: true, // Free credits
  },
  writesonic: {
    url: "https://api.writesonic.com/v2/business/content/article-writer",
    free: true, // Free tier
  },
  // International APIs
  baidu: {
    url: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions",
    free: true, // Chinese AI
  },
  yandex: {
    url: "https://translate.api.cloud.yandex.net/translate/v2/translate",
    free: true, // Russian AI
  },
}

// Professional content templates by category
const CONTENT_TEMPLATES = {
  technology: {
    intro: [
      "The technology sector continues to evolve at an unprecedented pace with",
      "Recent developments in technology have unveiled",
      "Industry leaders are closely monitoring advancements in",
      "Breakthrough innovations in technology are reshaping",
    ],
    body: [
      "This development represents a significant milestone in digital transformation, with potential applications spanning multiple industries. Early adopters are already reporting substantial improvements in operational efficiency and user experience.",
      "Market analysts predict widespread adoption within the next 12-18 months, as organizations seek to leverage these capabilities for competitive advantage. The technology addresses long-standing challenges while opening new possibilities for innovation.",
      "Research institutions worldwide are collaborating to explore additional use cases and optimize performance parameters. Initial testing has shown promising results across various implementation scenarios.",
    ],
    conclusion: [
      "The implications of this advancement extend far beyond immediate applications, potentially serving as a foundation for future technological breakthroughs.",
      "Organizations that embrace this technology early are likely to gain significant competitive advantages in an increasingly digital marketplace.",
      "As the technology matures, we can expect to see broader adoption and integration across various industry verticals.",
    ],
  },
  ai: {
    intro: [
      "Artificial intelligence research has achieved a significant breakthrough with",
      "The field of AI continues to advance rapidly through",
      "Machine learning capabilities have been enhanced by",
      "Researchers have developed innovative approaches to",
    ],
    body: [
      "This AI advancement addresses fundamental limitations in current systems, offering improved accuracy, reduced computational requirements, and enhanced interpretability. The breakthrough could accelerate AI adoption across industries previously hesitant due to technical constraints.",
      "Leading AI researchers have collaborated across continents to develop this technology, combining expertise from computer science, cognitive psychology, and neuroscience. The interdisciplinary approach has yielded insights previously unattainable through traditional methods.",
      "Initial testing demonstrates remarkable improvements in AI system performance, particularly in areas requiring contextual understanding and creative problem-solving. These capabilities enable AI systems to tackle more complex real-world challenges.",
    ],
    conclusion: [
      "The technology's potential applications span numerous sectors, from autonomous systems and robotics to personalized education and healthcare diagnostics.",
      "Industry experts predict this could be the catalyst for the next generation of AI-powered solutions that more closely mimic human reasoning.",
      "As AI systems become more sophisticated, we can expect to see transformative changes in how we interact with technology in our daily lives.",
    ],
  },
  cybersecurity: {
    intro: [
      "Cybersecurity professionals worldwide are responding to emerging developments in",
      "The cybersecurity landscape has been significantly impacted by",
      "Security researchers have identified critical developments related to",
      "New cybersecurity challenges have emerged with",
    ],
    body: [
      "This discovery underscores the critical importance of maintaining robust security postures as technology continues to advance. The cybersecurity landscape has become increasingly complex, with threat actors employing sophisticated techniques that challenge traditional defense mechanisms.",
      "Security experts from leading institutions have collaborated to analyze the implications and develop comprehensive response strategies. Their findings suggest that traditional security approaches may be insufficient to address the complexity of modern threats.",
      "The development has led to increased investment in cybersecurity research and development, with both government agencies and private organizations allocating additional resources to threat intelligence and defensive technologies.",
    ],
    conclusion: [
      "Organizations are advised to review their current security postures and implement enhanced monitoring capabilities with emphasis on proactive threat detection.",
      "The coordinated response from the cybersecurity community reflects the critical importance of maintaining digital infrastructure stability in our interconnected world.",
      "As threats continue to evolve, the cybersecurity industry must remain agile and innovative in developing effective countermeasures.",
    ],
  },
}

// Generate content using multiple AI providers
async function generateWithHuggingFace(prompt: string): Promise<string> {
  const models = GLOBAL_AI_APIS.huggingface.models
  const randomModel = models[Math.floor(Math.random() * models.length)]

  try {
    const response = await fetch(`${GLOBAL_AI_APIS.huggingface.url}${randomModel}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 800,
          temperature: 0.7,
          do_sample: true,
          top_p: 0.9,
          repetition_penalty: 1.1,
        },
      }),
    })

    if (response.ok) {
      const result = await response.json()
      return result[0]?.generated_text?.replace(prompt, "").trim() || ""
    }
  } catch (error) {
    console.error("HuggingFace generation error:", error)
  }
  return ""
}

async function generateWithCohere(prompt: string): Promise<string> {
  try {
    const response = await fetch(GLOBAL_AI_APIS.cohere.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer TRIAL",
      },
      body: JSON.stringify({
        model: "command-light",
        prompt: prompt,
        max_tokens: 600,
        temperature: 0.7,
        k: 0,
        stop_sequences: [],
        return_likelihoods: "NONE",
      }),
    })

    if (response.ok) {
      const result = await response.json()
      return result.generations[0]?.text?.trim() || ""
    }
  } catch (error) {
    console.error("Cohere generation error:", error)
  }
  return ""
}

// Professional content generation with templates
function generateProfessionalContent(topic: string, category: string): string {
  const templates = CONTENT_TEMPLATES[category as keyof typeof CONTENT_TEMPLATES] || CONTENT_TEMPLATES.technology

  const intro = templates.intro[Math.floor(Math.random() * templates.intro.length)]
  const body = templates.body[Math.floor(Math.random() * templates.body.length)]
  const conclusion = templates.conclusion[Math.floor(Math.random() * templates.conclusion.length)]

  return `${intro} ${topic.toLowerCase()}.

${body}

${conclusion}

Industry stakeholders continue to monitor developments closely, as the full implications of this advancement become clearer. The technology represents a significant step forward in ${category} innovation, with potential to influence market dynamics and competitive landscapes across multiple sectors.

Further research and development efforts are expected to refine the technology and expand its applications, making it more accessible to organizations of various sizes and industries.`
}

// SEO optimization
function optimizeForSEO(content: string, keywords: string[]): string {
  let optimizedContent = content

  // Naturally integrate keywords
  keywords.forEach((keyword, index) => {
    if (index < 3 && !optimizedContent.toLowerCase().includes(keyword.toLowerCase())) {
      const sentences = optimizedContent.split(". ")
      const randomIndex = Math.floor(Math.random() * Math.min(3, sentences.length))
      sentences[randomIndex] += ` This development in ${keyword} technology`
      optimizedContent = sentences.join(". ")
    }
  })

  return optimizedContent
}

export async function POST(request: Request) {
  try {
    const { topic, category, keywords = [], style = "professional" } = await request.json()

    if (!topic || !category) {
      return NextResponse.json({ error: "Topic and category are required" }, { status: 400 })
    }

    const prompt = `Write a comprehensive, professional news article about: ${topic}. 
    Category: ${category}. 
    Style: ${style}.
    Include technical details, market implications, and future prospects.
    Make it engaging for tech-savvy readers while remaining informative and accurate.`

    // Try multiple AI providers
    let content = await generateWithHuggingFace(prompt)

    if (!content || content.length < 200) {
      content = await generateWithCohere(prompt)
    }

    // Fallback to template-based generation
    if (!content || content.length < 200) {
      content = generateProfessionalContent(topic, category)
    }

    // Optimize for SEO
    const optimizedContent = optimizeForSEO(content, keywords)

    // Generate metadata
    const wordCount = optimizedContent.split(" ").length
    const readTime = Math.ceil(wordCount / 200) // Average reading speed

    return NextResponse.json({
      content: optimizedContent,
      metadata: {
        wordCount,
        readTime: `${readTime} min read`,
        seoScore: calculateSEOScore(optimizedContent, keywords),
        keywords: extractContentKeywords(optimizedContent),
        sentiment: analyzeSentiment(optimizedContent),
      },
    })
  } catch (error) {
    console.error("AI content generation error:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}

// Calculate SEO score
function calculateSEOScore(content: string, keywords: string[]): number {
  let score = 0
  const wordCount = content.split(" ").length

  // Length score (400-800 words is optimal)
  if (wordCount >= 400 && wordCount <= 800) score += 30
  else if (wordCount >= 300) score += 20

  // Keyword density
  keywords.forEach((keyword) => {
    const density = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), "g")) || []).length / wordCount
    if (density >= 0.01 && density <= 0.03) score += 20
  })

  // Structure score
  if (content.includes("\n\n")) score += 20 // Paragraphs
  if (content.length > 500) score += 10 // Sufficient length

  return Math.min(score, 100)
}

// Extract keywords from content
function extractContentKeywords(content: string): string[] {
  const words = content.toLowerCase().match(/\b\w{4,}\b/g) || []
  const frequency: { [key: string]: number } = {}

  words.forEach((word) => {
    if (!["this", "that", "with", "from", "they", "have", "been", "will", "more", "than"].includes(word)) {
      frequency[word] = (frequency[word] || 0) + 1
    }
  })

  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word)
}

// Simple sentiment analysis
function analyzeSentiment(content: string): "positive" | "neutral" | "negative" {
  const positiveWords = ["breakthrough", "innovation", "advancement", "improvement", "success", "growth", "opportunity"]
  const negativeWords = ["challenge", "threat", "problem", "decline", "failure", "risk", "concern"]

  const words = content.toLowerCase().split(" ")
  const positiveCount = words.filter((word) => positiveWords.includes(word)).length
  const negativeCount = words.filter((word) => negativeWords.includes(word)).length

  if (positiveCount > negativeCount) return "positive"
  if (negativeCount > positiveCount) return "negative"
  return "neutral"
}
