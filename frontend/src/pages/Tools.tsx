import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'
import { ToolCard } from '@/components/tools/ToolCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { ToolFilters } from '@/types'

const CATEGORIES = [
  'All',
  'LLM',
  'Code Assistant',
  'Image Generation',
  'Video Generation',
  'Audio Generation',
  'Framework',
  'Vector Database',
  'No-Code Platform',
  'Dev Tool',
  'MLOps',
]

const PRICING_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'freemium', label: 'Freemium' },
  { value: 'paid', label: 'Paid' },
]

export default function ToolsPage() {
  const [filters, setFilters] = useState<ToolFilters>({
    page: 1,
    limit: 20,
    sortBy: 'viewsCount',
    sortOrder: 'desc',
  })
  const [search, setSearch] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['tools', filters],
    queryFn: () => api.getTools(filters),
  })

  const handleCategoryClick = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: category === 'All' ? undefined : category,
      page: 1,
    }))
  }

  const handlePricingClick = (pricing: string) => {
    setFilters((prev) => ({
      ...prev,
      pricing: pricing || undefined,
      page: 1,
    }))
  }

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: search || undefined,
      page: 1,
    }))
  }

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">AI Tools Directory</h1>
        <p className="text-muted-foreground">
          Discover the best AI tools for developers and creators
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 flex gap-2">
        <Input
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="max-w-md"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Categories:</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <Badge
                key={category}
                variant={
                  (category === 'All' && !filters.category) ||
                  filters.category === category
                    ? 'default'
                    : 'outline'
                }
                className="cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-2">Pricing:</p>
          <div className="flex gap-2">
            {PRICING_OPTIONS.map((option) => (
              <Badge
                key={option.value}
                variant={
                  (option.value === '' && !filters.pricing) ||
                  filters.pricing === option.value
                    ? 'default'
                    : 'outline'
                }
                className="cursor-pointer"
                onClick={() => handlePricingClick(option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading tools...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-destructive">Error loading tools. Please try again.</p>
        </div>
      )}

      {data && (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            Found {data.meta.total} tools
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {data.data.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          {/* Pagination */}
          {data.meta.last_page > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(filters.page! - 1)}
                disabled={filters.page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {filters.page} of {data.meta.last_page}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(filters.page! + 1)}
                disabled={filters.page === data.meta.last_page}
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
