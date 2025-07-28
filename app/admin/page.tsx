"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AIStatusDashboard from "@/components/ai-status-dashboard"
import ImageSourcesStatus from "@/components/image-sources-status"
import { Settings, Zap, ImageIcon, Globe, RefreshCw } from "lucide-react"

export default function AdminDashboard() {
  const [isClearing, setIsClearing] = useState(false)

  const clearImageCache = async () => {
    setIsClearing(true)
    try {
      await fetch("/api/image-cache", { method: "DELETE" })
      alert("Image cache cleared successfully!")
    } catch (error) {
      alert("Failed to clear cache")
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">AI News Hub - Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your automated blogging system</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={clearImageCache} disabled={isClearing} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isClearing ? "animate-spin" : ""}`} />
            Clear Cache
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="ai-status" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>AI Status</span>
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center space-x-2">
            <ImageIcon className="h-4 w-4" />
            <span>Images</span>
          </TabsTrigger>
          <TabsTrigger value="global" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Global</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Auto Generation</span>
                    <span className="text-green-500">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Image Generation</span>
                    <span className="text-green-500">13 Sources</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RSS Feeds</span>
                    <span className="text-green-500">50+ Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Translation</span>
                    <span className="text-green-500">15 Languages</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Generation Speed</span>
                    <span>5-10 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Image Success Rate</span>
                    <span className="text-green-500">98%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Content Quality</span>
                    <span className="text-green-500">Professional</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SEO Score</span>
                    <span className="text-green-500">85/100</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Global Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>AI Providers</span>
                    <span>15+ Worldwide</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Image Sources</span>
                    <span>13 Global</span>
                  </div>
                  <div className="flex justify-between">
                    <span>News Sources</span>
                    <span>50+ RSS Feeds</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Languages</span>
                    <span>15+ Supported</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-status">
          <AIStatusDashboard />
        </TabsContent>

        <TabsContent value="images">
          <ImageSourcesStatus />
        </TabsContent>

        <TabsContent value="global">
          <Card>
            <CardHeader>
              <CardTitle>Global AI Integration</CardTitle>
              <p className="text-sm text-muted-foreground">Comprehensive worldwide AI services integration</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">🇺🇸 United States</h3>
                  <ul className="text-sm space-y-1">
                    <li>• HuggingFace (Text & Images)</li>
                    <li>• OpenAI Compatible APIs</li>
                    <li>• NASA Images</li>
                    <li>• Smithsonian Archives</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">🇨🇦 Canada</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Cohere AI (Text Generation)</li>
                    <li>• Burst by Shopify (Images)</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">🇩🇪 Germany</h3>
                  <ul className="text-sm space-y-1">
                    <li>• LibreTranslate (Translation)</li>
                    <li>• Pexels (Stock Photos)</li>
                    <li>• Pixabay (Free Images)</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">🇮🇹 Italy</h3>
                  <ul className="text-sm space-y-1">
                    <li>• MyMemory (Translation)</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">🇨🇳 China</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Baidu AI (Text Generation)</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">🇷🇺 Russia</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Yandex AI (Translation)</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">🌍 Global</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Pollinations AI (Images)</li>
                    <li>• Craiyon (DALL-E Mini)</li>
                    <li>• Wikimedia Commons</li>
                    <li>• Openverse (Creative Commons)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
