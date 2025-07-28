"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Moon, Sun, Search, TrendingUp, Globe, Smartphone, Shield, Cpu, RefreshCw } from "lucide-react"
import Link from "next/link"
import ImageWithFallback from "@/components/image-with-fallback"

interface Article {
  id: string
  title: string
  summary: string
  content: string
  category: string
  imageUrl: string
  timestamp: string
  slug: string
  tags: string[]
  imageProvider?: string
}

const categories = [
  { name: "All", icon: Globe, color: "bg-blue-500" },
  { name: "Tech", icon: Cpu, color: "bg-green-500" },
  { name: "AI", icon: TrendingUp, color: "bg-purple-500" },
  { name: "Mobile", icon: Smartphone, color: "bg-orange-500" },
  { name: "Security", icon: Shield, color: "bg-red-500" },
]

export default function BlogHomePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    loadArticles()
    // Auto-generate articles every 5-10 minutes
    const interval = setInterval(
      () => {
        generateNewArticle()
      },
      Math.random() * (10 - 5) * 60 * 1000 + 5 * 60 * 1000,
    ) // 5-10 minutes

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    filterArticles()
  }, [articles, selectedCategory, searchTerm])

  const loadArticles = () => {
    const stored = localStorage.getItem("blog-articles")
    if (stored) {
      const parsedArticles = JSON.parse(stored)
      setArticles(parsedArticles)
    } else {
      // Initialize with sample articles with guaranteed images
      initializeSampleArticles()
    }
  }

  const initializeSampleArticles = () => {
    const sampleArticles = [
      {
        id: "1",
        title: "Revolutionary AI Breakthrough in Natural Language Processing",
        summary:
          "Scientists develop new AI model that understands context better than ever before, marking a significant milestone in machine learning.",
        content:
          "A groundbreaking advancement in artificial intelligence has emerged from leading research institutions...",
        category: "AI",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
        timestamp: new Date().toISOString(),
        slug: "ai-breakthrough-nlp",
        tags: ["AI", "Machine Learning", "NLP", "Technology"],
        imageProvider: "Curated Unsplash",
      },
      {
        id: "2",
        title: "New Smartphone Security Features Protect Against Cyber Threats",
        summary:
          "Latest mobile security updates introduce advanced encryption and biometric authentication to safeguard user data.",
        content:
          "Mobile security has taken a significant leap forward with the introduction of new protective measures...",
        category: "Security",
        imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
        timestamp: new Date(Date.now() - 300000).toISOString(),
        slug: "smartphone-security-features",
        tags: ["Security", "Mobile", "Encryption", "Privacy"],
        imageProvider: "Curated Unsplash",
      },
      {
        id: "3",
        title: "Tech Startups Revolutionize Remote Work Solutions",
        summary:
          "Innovative companies are developing cutting-edge tools to enhance productivity and collaboration in distributed teams.",
        content: "The remote work revolution has sparked a wave of innovation in workplace technology...",
        category: "Tech",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
        timestamp: new Date(Date.now() - 600000).toISOString(),
        slug: "remote-work-tech-solutions",
        tags: ["Startup", "Remote Work", "Productivity", "Innovation"],
        imageProvider: "Curated Unsplash",
      },
    ]

    setArticles(sampleArticles)
    localStorage.setItem("blog-articles", JSON.stringify(sampleArticles))
  }

  const generateNewArticle = async () => {
    if (isGenerating) return
    setIsGenerating(true)

    try {
      console.log("🚀 Starting article generation...")

      // Generate article content
      const response = await fetch("/api/generate-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        const newArticle = await response.json()
        console.log("📝 Article generated:", newArticle.title)

        // Generate image with guaranteed fallback
        console.log("🎨 Generating guaranteed image...")
        const imageResponse = await fetch("/api/fetch-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newArticle.title,
            summary: newArticle.summary,
            category: newArticle.category,
          }),
        })

        if (imageResponse.ok) {
          const imageData = await imageResponse.json()
          newArticle.imageUrl = imageData.imageUrl
          newArticle.imageProvider = imageData.provider
          console.log("🖼️ Image generated:", imageData.provider)
        } else {
          // Guaranteed fallback
          newArticle.imageUrl = `https://via.placeholder.com/800x400/2563eb/ffffff?text=${encodeURIComponent(newArticle.title.substring(0, 20))}`
          newArticle.imageProvider = "Guaranteed Fallback"
          console.log("⚠️ Using guaranteed fallback image")
        }

        const updatedArticles = [newArticle, ...articles].slice(0, 50)
        setArticles(updatedArticles)
        localStorage.setItem("blog-articles", JSON.stringify(updatedArticles))

        console.log("✅ Article published successfully!")
      }
    } catch (error) {
      console.error("❌ Failed to generate article:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const regenerateImages = async () => {
    console.log("🔄 Regenerating all images...")

    const updatedArticles = await Promise.all(
      articles.map(async (article) => {
        try {
          const imageResponse = await fetch("/api/fetch-images", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: article.title,
              summary: article.summary,
              category: article.category,
            }),
          })

          if (imageResponse.ok) {
            const imageData = await imageResponse.json()
            return {
              ...article,
              imageUrl: imageData.imageUrl,
              imageProvider: imageData.provider,
            }
          }
        } catch (error) {
          console.error("Failed to regenerate image for:", article.title)
        }

        return article
      }),
    )

    setArticles(updatedArticles)
    localStorage.setItem("blog-articles", JSON.stringify(updatedArticles))
    console.log("✅ All images regenerated!")
  }

  const filterArticles = () => {
    let filtered = articles

    if (selectedCategory !== "All") {
      filtered = filtered.filter((article) => article.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredArticles(filtered)
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <header
        className={`sticky top-0 z-50 border-b ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>AI News Hub</h1>
              {isGenerating && (
                <Badge variant="secondary" className="animate-pulse">
                  Generating...
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <Button variant="outline" onClick={regenerateImages}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Fix Images
              </Button>

              <Button onClick={generateNewArticle} disabled={isGenerating}>
                Generate Article
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Ad Banner */}
      <div className={`border-b ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="container mx-auto px-4 py-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg text-center">
            <p className="text-sm">Advertisement Space - Google AdSense Integration Ready</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.name)}
                className="flex items-center space-x-2"
              >
                <IconComponent className="h-4 w-4" />
                <span>{category.name}</span>
              </Button>
            )
          })}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <div key={article.id}>
              <Card
                className={`h-full hover:shadow-lg transition-shadow duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}
              >
                <div className="relative">
                  <ImageWithFallback
                    src={article.imageUrl || "/placeholder.svg"}
                    alt={article.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                    title={article.title}
                    category={article.category}
                  />
                  <Badge
                    className={`absolute top-2 left-2 ${
                      categories.find((cat) => cat.name === article.category)?.color || "bg-gray-500"
                    }`}
                  >
                    {article.category}
                  </Badge>
                  {article.imageProvider && (
                    <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                      {article.imageProvider}
                    </Badge>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className={`text-lg line-clamp-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {article.title}
                  </CardTitle>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {formatTimestamp(article.timestamp)}
                  </p>
                </CardHeader>

                <CardContent>
                  <p className={`text-sm mb-4 line-clamp-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {article.summary}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Link href={`/article/${article.slug}`}>
                    <Button className="w-full">Read More</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Ad placement every 3rd article */}
              {(index + 1) % 3 === 0 && (
                <Card className={`mt-6 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-lg">
                      <h3 className="font-semibold mb-2">Sponsored Content</h3>
                      <p className="text-sm">Your advertisement could be here - Premium placement available</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              No articles found. Try adjusting your search or category filter.
            </p>
            <Button onClick={generateNewArticle} className="mt-4">
              Generate First Article
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={`border-t mt-12 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              © 2024 AI News Hub - Powered by AI • Auto-updated every 5-10 minutes • Images always guaranteed
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
