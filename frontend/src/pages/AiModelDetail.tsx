import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Calendar, ExternalLink, Brain } from 'lucide-react'
import BookmarkButton from '@/components/BookmarkButton'
import RatingStars from '@/components/RatingStars'
import CommentSection from '@/components/CommentSection'

export default function AiModelDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, error } = useQuery({
    queryKey: ['aiModel', id],
    queryFn: () => api.getAiModel(Number(id!)),
    enabled: !!id,
  })

  const model = data?.data

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-12 w-2/3 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error || !model) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">AI Model not found</h2>
        <p className="text-muted-foreground mb-4">
          The AI model you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/ai-models">Browse All Models</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back button */}
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/ai-models">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to AI Models
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="outline">{model.provider}</Badge>
              <Badge>{model.modelType}</Badge>
              {model.status === 'deprecated' && (
                <Badge variant="destructive">Deprecated</Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold mb-2">{model.name}</h1>
            {model.version && (
              <p className="text-lg text-muted-foreground">Version {model.version}</p>
            )}
          </div>

          <div className="flex gap-2">
            <BookmarkButton
              bookmarkableType="AiModel"
              bookmarkableId={model.id}
              variant="outline"
            />
            {model.documentationUrl && (
              <Button variant="outline" asChild>
                <a
                  href={model.documentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Documentation
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Specifications */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-4">Specifications</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1">Provider</dt>
              <dd className="text-base">{model.provider}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1">Model Type</dt>
              <dd className="text-base">{model.modelType}</dd>
            </div>
            {model.contextWindow && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground mb-1">
                  Context Window
                </dt>
                <dd className="text-base">{model.contextWindow.toLocaleString()} tokens</dd>
              </div>
            )}
            {model.parametersCount && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground mb-1">
                  Parameters
                </dt>
                <dd className="text-base">{model.parametersCount}</dd>
              </div>
            )}
            {model.releaseDate && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Release Date
                </dt>
                <dd className="text-base">
                  {new Date(model.releaseDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1">Status</dt>
              <dd className="text-base capitalize">{model.status}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Pricing */}
      {model.pricing && Object.keys(model.pricing).length > 0 && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Pricing</h3>
            <dl className="space-y-2">
              {Object.entries(model.pricing).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <dt className="text-sm text-muted-foreground capitalize">{key}:</dt>
                  <dd className="text-sm font-medium">{String(value)}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      )}

      {/* Capabilities */}
      {model.capabilities && Object.keys(model.capabilities).length > 0 && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Capabilities</h3>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(model.capabilities).map(([key, value]) =>
                value ? (
                  <Badge key={key} variant="secondary">
                    {key}
                  </Badge>
                ) : null
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Benchmark Scores */}
      {model.benchmarkScores && Object.keys(model.benchmarkScores).length > 0 && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Benchmark Scores</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(model.benchmarkScores).map(([key, value]) => (
                <div key={key} className="text-center p-4 bg-accent rounded-lg">
                  <div className="text-sm text-muted-foreground uppercase mb-1">{key}</div>
                  <div className="text-2xl font-bold">{value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rating Section */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Rate this AI Model</h3>
          <RatingStars
            rateableType="AiModel"
            rateableId={model.id}
            showReviewInput={true}
          />
        </CardContent>
      </Card>

      {/* Comments Section */}
      <CommentSection commentableType="AiModel" commentableId={model.id} />
    </div>
  )
}
