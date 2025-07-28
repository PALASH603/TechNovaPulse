"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, ImageIcon, Globe, Zap, TrendingUp, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react"

interface AIProvider {
  name: string
  type: "text" | "image" | "translation"
  status: "active" | "limited" | "offline"
  usage: number
  location: string
}

const AI_PROVIDERS: AIProvider[] = [
  { name: "HuggingFace", type: "text", status: "active", usage: 85, location: "Global" },
  { name: "Cohere", type: "text", status: "active", usage: 45, location: "Canada" },
  { name: "Pollinations AI", type: "image", status: "active", usage: 92, location: "Global" },
  { name: "Craiyon", type: "image", status: "limited", usage: 78, location: "Global" },
  { name: "Unsplash", type: "image", status: "active", usage: 34, location: "Global" },
  { name: "MyMemory", type: "translation", status: "active", usage: 23, location: "Italy" },
  { name: "LibreTranslate", type: "translation", status: "active", usage: 67, location: "Germany" },
]

export default function AIStatusDashboard() {
  const [providers, setProviders] = useState<AIProvider[]>(AI_PROVIDERS)
  const [totalArticles, setTotalArticles] = useState(0)
  const [todayArticles, setTodayArticles] = useState(0)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setProviders((prev) =>
        prev.map((provider) => ({
          ...provider,
          usage: Math.max(0, Math.min(100, provider.usage + (Math.random() - 0.5) * 10)),
        })),
      )
    }, 5000)

    // Load article stats
    const stored = localStorage.getItem("blog-articles")
    if (stored) {
      const articles = JSON.parse(stored)
      setTotalArticles(articles.length)

      const today = new Date().toDateString()
      const todayCount = articles.filter((article: any) => new Date(article.timestamp).toDateString() === today).length
      setTodayArticles(todayCount)
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
      case "text":
        return <Brain className="h-4 w-4" />
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "translation":
        return <Globe className="h-4 w-4" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Stats Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalArticles}</div>
          <p className="text-xs text-muted-foreground">+{todayArticles} today</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI Providers</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{providers.filter((p) => p.status === "active").length}</div>
          <p className="text-xs text-muted-foreground">of {providers.length} active</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Generation Rate</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5-10</div>
          <p className="text-xs text-muted-foreground">minutes per article</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Global Coverage</CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">15+</div>
          <p className="text-xs text-muted-foreground">languages supported</p>
        </CardContent>
      </Card>

      {/* AI Providers Status */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>AI Providers Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((provider) => (
              <div key={provider.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(provider.type)}
                  <div>
                    <div className="font-medium">{provider.name}</div>
                    <div className="text-sm text-muted-foreground">{provider.location}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-sm font-medium">{provider.usage}%</div>
                    <Progress value={provider.usage} className="w-16 h-2" />
                  </div>
                  {getStatusIcon(provider.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
