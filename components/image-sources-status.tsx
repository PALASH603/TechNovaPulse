"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ImageIcon, Zap, Globe, Cpu, CheckCircle, AlertCircle, XCircle } from "lucide-react"

interface ImageSource {
  name: string
  type: "ai" | "stock" | "government" | "creative_commons"
  location: string
  status: "active" | "limited" | "offline"
  usage: number
  quality: "high" | "medium" | "low"
  free: boolean
}

const IMAGE_SOURCES: ImageSource[] = [
  // AI Generators
  { name: "Pollinations AI", type: "ai", location: "Global", status: "active", usage: 92, quality: "high", free: true },
  {
    name: "Craiyon (DALL-E Mini)",
    type: "ai",
    location: "Global",
    status: "active",
    usage: 78,
    quality: "medium",
    free: true,
  },
  {
    name: "HuggingFace Diffusion",
    type: "ai",
    location: "Global",
    status: "active",
    usage: 65,
    quality: "high",
    free: true,
  },
  { name: "DeepAI", type: "ai", location: "USA", status: "limited", usage: 45, quality: "medium", free: true },

  // Stock Photo APIs
  { name: "Unsplash", type: "stock", location: "Global", status: "active", usage: 88, quality: "high", free: true },
  { name: "Pexels", type: "stock", location: "Germany", status: "active", usage: 76, quality: "high", free: true },
  { name: "Pixabay", type: "stock", location: "Germany", status: "active", usage: 82, quality: "medium", free: true },
  {
    name: "Burst (Shopify)",
    type: "stock",
    location: "Canada",
    status: "active",
    usage: 34,
    quality: "medium",
    free: true,
  },

  // Government Sources
  {
    name: "NASA Images",
    type: "government",
    location: "USA",
    status: "active",
    usage: 23,
    quality: "high",
    free: true,
  },
  {
    name: "Smithsonian",
    type: "government",
    location: "USA",
    status: "active",
    usage: 12,
    quality: "high",
    free: true,
  },

  // Creative Commons
  {
    name: "Wikimedia Commons",
    type: "creative_commons",
    location: "Global",
    status: "active",
    usage: 56,
    quality: "high",
    free: true,
  },
  {
    name: "Openverse",
    type: "creative_commons",
    location: "Global",
    status: "active",
    usage: 43,
    quality: "medium",
    free: true,
  },
  {
    name: "Europeana",
    type: "creative_commons",
    location: "Europe",
    status: "active",
    usage: 18,
    quality: "medium",
    free: true,
  },
]

export default function ImageSourcesStatus() {
  const [sources, setSources] = useState<ImageSource[]>(IMAGE_SOURCES)
  const [totalImages, setTotalImages] = useState(0)
  const [todayImages, setTodayImages] = useState(0)

  useEffect(() => {
    // Simulate real-time usage updates
    const interval = setInterval(() => {
      setSources((prev) =>
        prev.map((source) => ({
          ...source,
          usage: Math.max(0, Math.min(100, source.usage + (Math.random() - 0.5) * 5)),
        })),
      )
    }, 10000)

    // Load image generation stats
    const stored = localStorage.getItem("blog-articles")
    if (stored) {
      const articles = JSON.parse(stored)
      setTotalImages(articles.length)

      const today = new Date().toDateString()
      const todayCount = articles.filter((article: any) => new Date(article.timestamp).toDateString() === today).length
      setTodayImages(todayCount)
    }

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "limited":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "offline":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ai":
        return <Cpu className="h-4 w-4 text-purple-500" />
      case "stock":
        return <ImageIcon className="h-4 w-4 text-blue-500" />
      case "government":
        return <Globe className="h-4 w-4 text-green-500" />
      case "creative_commons":
        return <Zap className="h-4 w-4 text-orange-500" />
      default:
        return <ImageIcon className="h-4 w-4" />
    }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "high":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const activeCount = sources.filter((s) => s.status === "active").length
  const aiCount = sources.filter((s) => s.type === "ai" && s.status === "active").length
  const stockCount = sources.filter((s) => s.type === "stock" && s.status === "active").length

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sources</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-muted-foreground">of {sources.length} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Generators</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiCount}</div>
            <p className="text-xs text-muted-foreground">AI-powered sources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Photos</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockCount}</div>
            <p className="text-xs text-muted-foreground">Stock photo APIs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images Today</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayImages}</div>
            <p className="text-xs text-muted-foreground">generated today</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sources Status */}
      <Card>
        <CardHeader>
          <CardTitle>Image Sources Status</CardTitle>
          <p className="text-sm text-muted-foreground">
            Real-time status of all image generation and fetching sources worldwide
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map((source) => (
              <div key={source.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(source.type)}
                  <div>
                    <div className="font-medium flex items-center space-x-2">
                      <span>{source.name}</span>
                      {source.free && (
                        <Badge variant="secondary" className="text-xs">
                          FREE
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{source.location}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={`text-xs ${getQualityColor(source.quality)}`}>
                        {source.quality.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {source.type.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">{Math.round(source.usage)}%</div>
                    <Progress value={source.usage} className="w-16 h-2" />
                  </div>
                  {getStatusIcon(source.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Image Generation Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Image Generation Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <div className="font-medium">AI Image Generation</div>
                <div className="text-sm text-muted-foreground">Pollinations AI, Craiyon, HuggingFace Diffusion</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <div className="font-medium">Stock Photo Search</div>
                <div className="text-sm text-muted-foreground">Unsplash, Pexels, Pixabay keyword matching</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <div className="font-medium">Government & CC Sources</div>
                <div className="text-sm text-muted-foreground">NASA, Wikimedia, Openverse public domain</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-orange-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <div className="font-medium">Smart Fallbacks</div>
                <div className="text-sm text-muted-foreground">Custom placeholders with article context</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
