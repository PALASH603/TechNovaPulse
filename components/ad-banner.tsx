import { Card, CardContent } from "@/components/ui/card"

interface AdBannerProps {
  type?: "banner" | "square" | "sidebar"
  darkMode?: boolean
}

export default function AdBanner({ type = "banner", darkMode = false }: AdBannerProps) {
  const adContent = {
    banner: {
      title: "Premium Advertisement Space",
      description: "Google AdSense Ready - High CTR Placement",
      gradient: "from-blue-500 to-purple-600",
    },
    square: {
      title: "Sponsored Content",
      description: "Native Ad Integration Available",
      gradient: "from-green-400 to-blue-500",
    },
    sidebar: {
      title: "Affiliate Products",
      description: "Tech Product Recommendations",
      gradient: "from-purple-500 to-pink-500",
    },
  }

  const content = adContent[type]

  return (
    <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
      <CardContent className="p-6 text-center">
        <div className={`bg-gradient-to-r ${content.gradient} text-white p-6 rounded-lg`}>
          <h3 className="font-semibold mb-2">{content.title}</h3>
          <p className="text-sm opacity-90">{content.description}</p>
          <div className="mt-4 text-xs opacity-75">728x90 • 300x250 • Responsive</div>
        </div>
      </CardContent>
    </Card>
  )
}
