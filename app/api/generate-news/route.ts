import { NextResponse } from "next/server"

// Comprehensive list of free AI APIs worldwide
const AI_PROVIDERS = {
  huggingface: {
    url: "https://api-inference.huggingface.co/models/",
    models: [
      "microsoft/DialoGPT-large",
      "facebook/blenderbot-400M-distill",
      "google/flan-t5-large",
      "microsoft/GODEL-v1_1-large-seq2seq",
      "EleutherAI/gpt-neo-2.7B",
    ],
  },
  cohere: {
    url: "https://api.cohere.ai/v1/generate",
    key: "TRIAL", // Cohere offers free trial
  },
  ai21: {
    url: "https://api.ai21.com/studio/v1/j2-light/complete",
    // Free tier available
  },
  goose: {
    url: "https://api.goose.ai/v1/engines/gpt-neo-20b/completions",
    // Free credits available
  },
}

// Enhanced news topics with global coverage
const GLOBAL_NEWS_TOPICS = [
  // Technology
  "Artificial Intelligence breakthrough in healthcare",
  "Quantum computing advancement",
  "5G network expansion globally",
  "Blockchain technology adoption",
  "Metaverse platform development",
  "Autonomous vehicle testing",
  "Renewable energy technology",
  "Space exploration missions",
  "Robotics in manufacturing",
  "IoT smart city implementations",

  // Cybersecurity
  "New ransomware threat discovered",
  "Data privacy regulations update",
  "Cryptocurrency security measures",
  "Cloud security vulnerabilities",
  "Biometric authentication advances",
  "Zero-trust security framework",
  "Mobile app security concerns",
  "Enterprise cybersecurity solutions",

  // Mobile & Apps
  "Smartphone camera technology",
  "Mobile payment innovations",
  "App store policy changes",
  "Cross-platform development tools",
  "Mobile gaming advancements",
  "Wearable device integration",
  "Voice assistant improvements",
  "Mobile health applications",

  // Startups & Innovation
  "Tech startup funding rounds",
  "Innovation in fintech sector",
  "EdTech platform developments",
  "Sustainable technology solutions",
  "Digital transformation trends",
  "Remote work technology tools",
  "E-commerce platform updates",
  "Social media algorithm changes",
]

const CATEGORIES = ["Tech", "AI", "Mobile", "Security", "Innovation", "Startup", "Global"]

// Professional content generation with multiple AI fallbacks
async function generateWithHuggingFace(prompt: string, model: string) {
  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Using free inference API
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 500,
          temperature: 0.7,
          do_sample: true,
          top_p: 0.9,
        },
      }),
    })

    if (response.ok) {
      const result = await response.json()
      return result[0]?.generated_text || null
    }
  } catch (error) {
    console.error("HuggingFace API error:", error)
  }
  return null
}

async function generateWithCohere(prompt: string) {
  try {
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer TRIAL", // Free trial key
      },
      body: JSON.stringify({
        model: "command-light",
        prompt: prompt,
        max_tokens: 400,
        temperature: 0.7,
      }),
    })

    if (response.ok) {
      const result = await response.json()
      return result.generations[0]?.text || null
    }
  } catch (error) {
    console.error("Cohere API error:", error)
  }
  return null
}

// Enhanced content generation with professional quality
function generateProfessionalContent(topic: string, category: string): string {
  const templates = {
    Tech: [
      `The technology sector continues to evolve rapidly with ${topic.toLowerCase()}, representing a significant milestone in digital innovation. Industry leaders are investing heavily in this breakthrough technology, which promises to transform how businesses operate and consumers interact with digital platforms.

Recent developments have shown remarkable progress in implementation, with early adopters reporting substantial improvements in efficiency and user experience. Market analysts predict widespread adoption within the next 12-18 months, potentially disrupting traditional business models across multiple industries.

The implications extend beyond immediate applications, as this technology could serve as a foundation for future innovations. Research institutions worldwide are collaborating to explore additional use cases and optimize performance parameters.

Companies that embrace this technology early are likely to gain competitive advantages, while those that delay adoption may find themselves struggling to catch up in an increasingly digital marketplace.`,

      `Innovation in ${topic.toLowerCase()} has reached a critical inflection point, with breakthrough developments emerging from leading research facilities globally. This advancement addresses long-standing challenges in the technology sector and opens new possibilities for commercial applications.

The convergence of multiple technological trends has created an environment conducive to rapid progress in this field. Investment in research and development has increased by over 300% in the past year, indicating strong confidence from both private and public sectors.

Early implementations have demonstrated significant improvements in performance metrics, with some applications showing efficiency gains of up to 40%. These results have attracted attention from major technology companies, leading to strategic partnerships and acquisition discussions.

The global impact of this technology is expected to be substantial, with potential applications spanning healthcare, finance, education, and manufacturing sectors.`,
    ],

    AI: [
      `Artificial intelligence research has achieved a significant breakthrough with ${topic.toLowerCase()}, marking a new era in machine learning capabilities. This development represents years of collaborative research between leading AI institutions and demonstrates the rapid pace of advancement in the field.

The new approach addresses fundamental limitations in current AI systems, offering improved accuracy, reduced computational requirements, and enhanced interpretability. These improvements could accelerate AI adoption across industries that have been hesitant due to previous limitations.

Researchers have successfully demonstrated the technology's effectiveness across multiple domains, including natural language processing, computer vision, and predictive analytics. The results show consistent improvements over existing methods, with some benchmarks showing performance gains of 25-30%.

The implications for AI democratization are significant, as the reduced computational requirements could make advanced AI capabilities accessible to smaller organizations and developing markets. This could lead to a new wave of AI-powered innovations globally.`,

      `The field of artificial intelligence has witnessed a paradigm shift with the introduction of ${topic.toLowerCase()}, a development that could redefine how machines process and understand complex information. This breakthrough emerges from cutting-edge research in neural network architectures and represents a significant step toward more human-like AI reasoning.

Leading AI researchers have collaborated across continents to develop this technology, combining expertise from computer science, cognitive psychology, and neuroscience. The interdisciplinary approach has yielded insights that were previously unattainable through traditional AI research methods.

Initial testing has shown remarkable improvements in AI system performance, particularly in areas requiring contextual understanding and creative problem-solving. These capabilities could enable AI systems to tackle more complex real-world challenges that have remained beyond their reach.

The technology's potential applications span numerous sectors, from autonomous systems and robotics to personalized education and healthcare diagnostics. Industry experts predict this could be the catalyst for the next generation of AI-powered solutions.`,
    ],

    Security: [
      `Cybersecurity professionals worldwide are responding to emerging developments in ${topic.toLowerCase()}, which highlight the evolving nature of digital threats in our interconnected world. This discovery underscores the critical importance of maintaining robust security postures as technology continues to advance.

The cybersecurity landscape has become increasingly complex, with threat actors employing sophisticated techniques that challenge traditional defense mechanisms. Organizations must adapt their security strategies to address these evolving threats while maintaining operational efficiency.

Security researchers have identified several key factors contributing to this development, including the proliferation of connected devices, increased remote work adoption, and the growing sophistication of cybercriminal organizations. These factors have created new attack vectors that require innovative defensive approaches.

Industry leaders recommend implementing comprehensive security frameworks that combine advanced threat detection, employee training, and incident response capabilities. The focus should be on creating resilient systems that can adapt to emerging threats while protecting critical assets and data.`,

      `The cybersecurity community has identified significant developments related to ${topic.toLowerCase()}, prompting urgent discussions about defensive strategies and threat mitigation approaches. This situation demonstrates the dynamic nature of cybersecurity challenges in the digital age.

Cybersecurity experts from leading institutions have collaborated to analyze the implications and develop comprehensive response strategies. Their findings suggest that traditional security approaches may be insufficient to address the complexity of modern threats.

The discovery has led to increased investment in cybersecurity research and development, with both government agencies and private organizations allocating additional resources to threat intelligence and defensive technologies. This coordinated response reflects the critical importance of cybersecurity in maintaining digital infrastructure stability.

Organizations are advised to review their current security postures and implement enhanced monitoring capabilities. The emphasis should be on proactive threat detection and rapid response mechanisms that can adapt to evolving attack methodologies.`,
    ],
  }

  const categoryTemplates = templates[category as keyof typeof templates] || templates.Tech
  return categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)]
}

// Generate article with multiple AI providers as fallback
async function generateArticleWithAI(topic: string, category: string) {
  const prompt = `Write a professional news article about: ${topic}. Category: ${category}. Include technical details, market impact, and future implications. Make it engaging and informative for tech-savvy readers.`

  // Try multiple AI providers in order of preference
  let content = await generateWithHuggingFace(prompt, AI_PROVIDERS.huggingface.models[0])

  if (!content) {
    content = await generateWithCohere(prompt)
  }

  // Fallback to local generation if all APIs fail
  if (!content) {
    content = generateProfessionalContent(topic, category)
  }

  return content
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .substring(0, 60)
}

// Enhanced title generation
function generateProfessionalTitle(topic: string, category: string): string {
  const titleFormats = [
    `Breaking: ${topic} Revolutionizes ${category} Industry`,
    `${topic}: Game-Changing Innovation in ${category}`,
    `Industry Alert: ${topic} Transforms ${category} Landscape`,
    `Exclusive: ${topic} Breakthrough Signals New Era for ${category}`,
    `${topic} Development Disrupts Traditional ${category} Approaches`,
    `Major ${category} Advancement: ${topic} Shows Promising Results`,
    `${topic} Innovation Could Reshape ${category} Market Dynamics`,
    `Research Breakthrough: ${topic} Advances ${category} Capabilities`,
  ]

  return titleFormats[Math.floor(Math.random() * titleFormats.length)]
}

// Professional summary generation
function generateSummary(topic: string, category: string): string {
  const summaryTemplates = [
    `Latest breakthrough in ${topic.toLowerCase()} demonstrates significant potential for ${category.toLowerCase()} applications, with industry experts predicting widespread adoption and substantial market impact.`,
    `Revolutionary development in ${topic.toLowerCase()} technology addresses key challenges in the ${category.toLowerCase()} sector, offering improved performance and new capabilities for businesses and consumers.`,
    `Innovative approach to ${topic.toLowerCase()} shows promising results for ${category.toLowerCase()} industry, potentially solving long-standing technical limitations and opening new market opportunities.`,
    `Significant advancement in ${topic.toLowerCase()} represents a major milestone for ${category.toLowerCase()} technology development, with implications extending across multiple industry verticals.`,
    `Groundbreaking research in ${topic.toLowerCase()} reveals new possibilities for ${category.toLowerCase()} applications, attracting substantial investment and industry attention worldwide.`,
  ]

  return summaryTemplates[Math.floor(Math.random() * summaryTemplates.length)]
}

export async function POST() {
  try {
    // Select random topic and category
    const topic = GLOBAL_NEWS_TOPICS[Math.floor(Math.random() * GLOBAL_NEWS_TOPICS.length)]
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]

    // Generate professional title
    const title = generateProfessionalTitle(topic, category)

    // Generate professional summary
    const summary = generateSummary(topic, category)

    // Generate content using AI with fallbacks
    const content = await generateArticleWithAI(topic, category)

    // Generate comprehensive tags
    const topicKeywords = topic
      .toLowerCase()
      .split(" ")
      .filter((word) => word.length > 3)
    const baseTags = [category, "Technology", "Innovation", "News"]
    const additionalTags = [
      "AI",
      "Machine Learning",
      "Digital Transformation",
      "Industry 4.0",
      "Cybersecurity",
      "Cloud Computing",
      "IoT",
      "Blockchain",
      "Startup",
      "Research",
      "Development",
      "Global",
      "Market",
      "Investment",
    ]

    const tags = [
      ...baseTags,
      ...topicKeywords.slice(0, 2),
      ...additionalTags.filter(() => Math.random() > 0.7).slice(0, 3),
    ].slice(0, 8)

    const article = {
      id: Date.now().toString(),
      title,
      summary,
      content,
      category,
      imageUrl: "", // Will be generated by image API
      timestamp: new Date().toISOString(),
      slug: generateSlug(title),
      tags,
      keywords: topicKeywords.join(", "),
      readTime: Math.ceil(content.length / 1000) + " min read",
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error generating article:", error)
    return NextResponse.json({ error: "Failed to generate article" }, { status: 500 })
  }
}
