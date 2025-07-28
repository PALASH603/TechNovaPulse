"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, Moon, Sun } from "lucide-react"
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

export default function ArticlePage() {
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    loadArticle()
  }, [params.slug])

  const loadArticle = () => {
    const stored = localStorage.getItem("blog-articles")
    if (stored) {
      const articles: Article[] = JSON.parse(stored)
      const foundArticle = articles.find((a) => a.slug === params.slug)
      setArticle(foundArticle || null)

      if (foundArticle) {
        // Find related articles
        const related = articles
          .filter((a) => a.id !== foundArticle.id && a.category === foundArticle.category)
          .slice(0, 3)
        setRelatedArticles(related)
      }
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const shareArticle = () => {
    if (navigator.share && article) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Article URL copied to clipboard!")
    }
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Article not found</p>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <header
        className={`sticky top-0 z-50 border-b ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
            </Link>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={shareArticle}>
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Badge className="bg-blue-500">{article.category}</Badge>
            <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {formatTimestamp(article.timestamp)}
            </span>
            {article.imageProvider && (
              <Badge variant="secondary" className="text-xs">
                Image: {article.imageProvider}
              </Badge>
            )}
          </div>

          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>{article.title}</h1>

          <p className={`text-xl leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{article.summary}</p>
        </div>

        {/* Featured Image */}
        <div className="mb-8">
          <ImageWithFallback
            src={article.imageUrl || "/placeholder.svg"}
            alt={article.title}
            width={800}
            height={400}
            className="w-full h-64 md:h-96 object-cover rounded-lg"
            title={article.title}
            category={article.category}
          />
        </div>

        {/* Ad Banner */}
        <Card className={`mb-8 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <CardContent className="p-6 text-center">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Advertisement</h3>
              <p className="text-sm">Premium ad placement - High engagement zone</p>
            </div>
          </CardContent>
        </Card>

        {/* Article Content */}
        <div className={`prose prose-lg max-w-none mb-8 ${darkMode ? "prose-invert" : ""}`}>
          <div className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            {article.content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>Related Articles</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Card
                  key={relatedArticle.id}
                  className={`hover:shadow-lg transition-shadow duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}
                >
                  <ImageWithFallback
                    src={relatedArticle.imageUrl || "/placeholder.svg"}
                    alt={relatedArticle.title}
                    width={300}
                    height={150}
                    className="w-full h-32 object-cover rounded-t-lg"
                    title={relatedArticle.title}
                    category={relatedArticle.category}
                  />

                  <CardContent className="p-4">
                    <h3 className={`font-semibold mb-2 line-clamp-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {relatedArticle.title}
                    </h3>
                    <p className={`text-sm mb-3 line-clamp-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {relatedArticle.summary}
                    </p>
                    <Link href={`/article/${relatedArticle.slug}`}>
                      <Button size="sm" className="w-full">
                        Read More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
