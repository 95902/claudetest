import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { ExternalLink, Star, Eye, Github, ArrowLeft, ThumbsUp, ThumbsDown } from 'lucide-react'

export default function ToolDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  const { data, isLoading, error } = useQuery({
    queryKey: ['tool', slug],
    queryFn: () => api.getTool(slug!),
    enabled: !!slug,
  })

  const tool = data?.data

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-12 w-2/3 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (error || !tool) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Tool not found</h2>
        <p className="text-muted-foreground mb-4">
          The tool you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/tools">Browse All Tools</Link>
        </Button>
      </div>
    )
  }

  const pricingColors = {
    free: 'bg-green-500/10 text-green-700 border-green-200',
    freemium: 'bg-blue-500/10 text-blue-700 border-blue-200',
    paid: 'bg-orange-500/10 text-orange-700 border-orange-200',
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/tools">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tools
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              {tool.logoUrl && (
                <img
                  src={tool.logoUrl}
                  alt={`${tool.name} logo`}
                  className="w-16 h-16 rounded object-contain"
                />
              )}
              <div>
                <h1 className="text-4xl font-bold mb-2">{tool.name}</h1>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">{tool.category}</Badge>
                  <Badge className={pricingColors[tool.pricing]}>
                    {tool.pricing}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-lg text-muted-foreground mb-6">{tool.description}</p>

        {/* Stats and actions */}
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{tool.averageRating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({tool.ratingsCount} ratings)</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{tool.viewsCount.toLocaleString()} views</span>
          </div>
          <div className="flex gap-2 ml-auto">
            {tool.githubRepo && (
              <Button variant="outline" asChild>
                <a href={tool.githubRepo} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </Button>
            )}
            <Button asChild>
              <a href={tool.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Website
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Content tabs */}
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {tool.features && tool.features.length > 0 && (
            <TabsTrigger value="features">Features</TabsTrigger>
          )}
          {((tool.pros && tool.pros.length > 0) || (tool.cons && tool.cons.length > 0)) && (
            <TabsTrigger value="pros-cons">Pros & Cons</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">About {tool.name}</h3>
              <p className="text-muted-foreground leading-relaxed">{tool.description}</p>

              {tool.user && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground">
                    Added by <span className="font-medium">{tool.user.username}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {tool.features && tool.features.length > 0 && (
          <TabsContent value="features">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {tool.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="bg-primary/10 rounded-full p-1 mr-3 mt-0.5">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {((tool.pros && tool.pros.length > 0) || (tool.cons && tool.cons.length > 0)) && (
          <TabsContent value="pros-cons">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tool.pros && tool.pros.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ThumbsUp className="w-5 h-5 text-green-600" />
                      <h3 className="text-xl font-semibold">Pros</h3>
                    </div>
                    <ul className="space-y-2">
                      {tool.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <span className="text-green-600 mr-2">+</span>
                          <span className="text-muted-foreground">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {tool.cons && tool.cons.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ThumbsDown className="w-5 h-5 text-orange-600" />
                      <h3 className="text-xl font-semibold">Cons</h3>
                    </div>
                    <ul className="space-y-2">
                      {tool.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <span className="text-orange-600 mr-2">-</span>
                          <span className="text-muted-foreground">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Additional info */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-medium text-muted-foreground mb-1">Category</dt>
              <dd>{tool.category}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground mb-1">Pricing Model</dt>
              <dd className="capitalize">{tool.pricing}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground mb-1">Website</dt>
              <dd>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  {new URL(tool.url).hostname}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </dd>
            </div>
            {tool.githubRepo && (
              <div>
                <dt className="font-medium text-muted-foreground mb-1">GitHub Repository</dt>
                <dd>
                  <a
                    href={tool.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    View on GitHub
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
