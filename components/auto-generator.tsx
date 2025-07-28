"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, Settings, Clock } from "lucide-react"

interface AutoGeneratorProps {
  onGenerate: () => void
  isGenerating: boolean
}

export default function AutoGenerator({ onGenerate, isGenerating }: AutoGeneratorProps) {
  const [isAutoMode, setIsAutoMode] = useState(true)
  const [nextGeneration, setNextGeneration] = useState<Date | null>(null)
  const [timeUntilNext, setTimeUntilNext] = useState("")

  useEffect(() => {
    if (isAutoMode && !nextGeneration) {
      // Set next generation time (5-10 minutes from now)
      const minutes = Math.random() * (10 - 5) + 5
      const nextTime = new Date(Date.now() + minutes * 60 * 1000)
      setNextGeneration(nextTime)
    }

    const interval = setInterval(() => {
      if (nextGeneration) {
        const now = new Date()
        const diff = nextGeneration.getTime() - now.getTime()

        if (diff <= 0 && isAutoMode) {
          onGenerate()
          // Schedule next generation
          const minutes = Math.random() * (10 - 5) + 5
          setNextGeneration(new Date(Date.now() + minutes * 60 * 1000))
        } else if (diff > 0) {
          const minutes = Math.floor(diff / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)
          setTimeUntilNext(`${minutes}:${seconds.toString().padStart(2, "0")}`)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isAutoMode, nextGeneration, onGenerate])

  const toggleAutoMode = () => {
    setIsAutoMode(!isAutoMode)
    if (!isAutoMode) {
      // Starting auto mode - schedule next generation
      const minutes = Math.random() * (10 - 5) + 5
      setNextGeneration(new Date(Date.now() + minutes * 60 * 1000))
    } else {
      // Stopping auto mode
      setNextGeneration(null)
      setTimeUntilNext("")
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Auto-Generation Control</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant={isAutoMode ? "default" : "outline"}
              onClick={toggleAutoMode}
              className="flex items-center space-x-2"
            >
              {isAutoMode ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isAutoMode ? "Auto Mode ON" : "Auto Mode OFF"}</span>
            </Button>

            {isGenerating && (
              <Badge variant="secondary" className="animate-pulse">
                Generating Article...
              </Badge>
            )}
          </div>

          {isAutoMode && timeUntilNext && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Next article in: {timeUntilNext}</span>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p>
            Auto-generation creates new articles every 5-10 minutes using AI and trending topics. Articles include
            relevant images, SEO-optimized content, and proper categorization.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
