import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Tool } from '@/types'
import { ExternalLink, Star, Eye, ChevronRight } from 'lucide-react'

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  const pricingColors = {
    free: 'bg-green-500/10 text-green-700 border-green-200',
    freemium: 'bg-blue-500/10 text-blue-700 border-blue-200',
    paid: 'bg-orange-500/10 text-orange-700 border-orange-200',
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{tool.name}</CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">{tool.category}</Badge>
              <Badge className={pricingColors[tool.pricing]}>
                {tool.pricing}
              </Badge>
            </div>
          </div>
          {tool.logoUrl && (
            <img
              src={tool.logoUrl}
              alt={`${tool.name} logo`}
              className="w-12 h-12 rounded object-contain"
            />
          )}
        </div>
      </CardHeader>

      <CardContent>
        <CardDescription className="line-clamp-3 text-sm">
          {tool.description}
        </CardDescription>

        {tool.features && tool.features.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              Key Features:
            </p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              {tool.features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-1">•</span>
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3 mt-auto">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {tool.averageRating.toFixed(1)} ({tool.ratingsCount})
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {tool.viewsCount}
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link to={`/tools/${tool.slug}`}>
              View Details
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href={tool.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
