"use client"

import { useState } from "react"
import Image from "next/image"

interface ImageWithFallbackProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  title?: string
  category?: string
}

export default function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className = "",
  title = "",
  category = "tech",
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Fallback images in order of preference
  const fallbackImages = [
    `https://picsum.photos/seed/${title.substring(0, 10)}/800/400`,
    `https://via.placeholder.com/800x400/2563eb/ffffff?text=${encodeURIComponent(title.substring(0, 20))}`,
    `https://dummyimage.com/800x400/374151/ffffff&text=${encodeURIComponent("AI News")}`,
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFJIE5ld3MgSHViPC90ZXh0Pjwvc3ZnPg==",
  ]

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)

    // Try next fallback image
    const currentIndex = fallbackImages.indexOf(imgSrc)
    const nextIndex = currentIndex + 1

    if (nextIndex < fallbackImages.length) {
      console.log(`🔄 Trying fallback ${nextIndex + 1}:`, fallbackImages[nextIndex])
      setImgSrc(fallbackImages[nextIndex])
      setIsLoading(true)
      setHasError(false)
    } else {
      console.log("❌ All fallbacks failed, using final SVG")
      setImgSrc(fallbackImages[fallbackImages.length - 1])
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
    console.log("✅ Image loaded successfully:", imgSrc.substring(0, 50))
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-500 text-sm">Loading image...</div>
        </div>
      )}

      <Image
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        unoptimized={imgSrc.includes("placeholder") || imgSrc.includes("dummyimage") || imgSrc.startsWith("data:")}
        priority={false}
      />

      {hasError && !isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <div className="text-white text-center p-4">
            <div className="text-lg font-bold mb-2">AI News Hub</div>
            <div className="text-sm opacity-90">{category.toUpperCase()}</div>
          </div>
        </div>
      )}
    </div>
  )
}
