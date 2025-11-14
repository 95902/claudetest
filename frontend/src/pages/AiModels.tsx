import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@/services/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Brain, Calendar, ExternalLink } from 'lucide-react'

export default function AiModelsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [provider, setProvider] = useState('')
  const [modelType, setModelType] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['aiModels', page, search, provider, modelType],
    queryFn: () =>
      api.getAiModels({
        page,
        limit: 12,
        search: search || undefined,
        provider: provider || undefined,
        modelType: modelType || undefined,
        status: 'active',
      }),
  })

  const models = data?.data || []
  const meta = data?.meta

  const providers = ['OpenAI', 'Anthropic', 'Google', 'Meta', 'Mistral AI']
  const modelTypes = ['LLM', 'Vision', 'Audio', 'Embedding']

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">AI Models Catalog</h1>
        <p className="text-muted-foreground">
          Explore and compare the latest AI models with detailed specifications
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search AI models..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium mb-2">Provider</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={provider === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setProvider('')}
              >
                All
              </Button>
              {providers.map((p) => (
                <Button
                  key={p}
                  variant={provider === p ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setProvider(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Type</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={modelType === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setModelType('')}
              >
                All
              </Button>
              {modelTypes.map((type) => (
                <Button
                  key={type}
                  variant={modelType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setModelType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Models Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-24 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : models.length === 0 ? (
        <div className="text-center py-16">
          <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground text-lg">No AI models found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model) => (
              <Card key={model.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {model.provider}
                        </Badge>
                        <h3 className="font-semibold text-lg">{model.name}</h3>
                        {model.version && (
                          <p className="text-xs text-muted-foreground">v{model.version}</p>
                        )}
                      </div>
                      {model.status === 'deprecated' && (
                        <Badge variant="destructive">Deprecated</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge>{model.modelType}</Badge>
                    </div>

                    <div className="space-y-1 text-sm">
                      {model.contextWindow && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Context:</span>
                          <span className="font-medium">
                            {model.contextWindow.toLocaleString()} tokens
                          </span>
                        </div>
                      )}
                      {model.parametersCount && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Parameters:</span>
                          <span className="font-medium">{model.parametersCount}</span>
                        </div>
                      )}
                      {model.releaseDate && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Released:
                          </span>
                          <span className="font-medium">
                            {new Date(model.releaseDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {model.benchmarkScores && Object.keys(model.benchmarkScores).length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-xs font-medium mb-1">Benchmarks:</p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          {Object.entries(model.benchmarkScores).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <div className="text-muted-foreground uppercase">{key}</div>
                              <div className="font-semibold">{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button variant="default" size="sm" className="flex-1" asChild>
                        <Link to={`/ai-models/${model.id}`}>View Details</Link>
                      </Button>
                      {model.documentationUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={model.documentationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Page {meta.current_page} of {meta.last_page}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === meta.last_page}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
