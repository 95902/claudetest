import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Search,
  Calendar,
  User,
  ExternalLink,
  Rss,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  Circle,
} from 'lucide-react'
import { api } from '@/services/api'
import type { RssArticle } from '@/types'

export default function RssFeedsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedFeed, setSelectedFeed] = useState<number | null>(null)
  const [showOnlyUnread, setShowOnlyUnread] = useState(false)
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false)

  // Fetch RSS feeds
  const { data: feedsData, isLoading: feedsLoading } = useQuery({
    queryKey: ['rss-feeds'],
    queryFn: () => api.getRssFeeds({ limit: 100 }),
  })

  // Fetch RSS articles
  const { data: articlesData, isLoading: articlesLoading } = useQuery({
    queryKey: [
      'rss-articles',
      page,
      selectedFeed,
      showOnlyUnread,
      showOnlyBookmarked,
    ],
    queryFn: () =>
      api.getRssArticles({
        page,
        limit: 20,
        feed_id: selectedFeed || undefined,
        is_read: showOnlyUnread ? false : undefined,
        is_bookmarked: showOnlyBookmarked ? true : undefined,
      }),
  })

  const feeds = feedsData?.data || []
  const articles = articlesData?.data || []
  const meta = articlesData?.meta

  // Filter feeds by search
  const filteredFeeds = feeds.filter(
    (feed) =>
      feed.name.toLowerCase().includes(search.toLowerCase()) ||
      feed.category.toLowerCase().includes(search.toLowerCase())
  )

  // Group feeds by category
  const feedsByCategory = filteredFeeds.reduce(
    (acc, feed) => {
      if (!acc[feed.category]) {
        acc[feed.category] = []
      }
      acc[feed.category].push(feed)
      return acc
    },
    {} as Record<string, typeof feeds>
  )

  const handleMarkAsRead = async (articleId: number) => {
    try {
      await api.markRssArticleAsRead(articleId)
      // Invalidate queries to refetch data
      // queryClient.invalidateQueries(['rss-articles'])
    } catch (error) {
      console.error('Failed to mark article as read:', error)
    }
  }

  const handleToggleBookmark = async (articleId: number) => {
    try {
      await api.toggleRssArticleBookmark(articleId)
      // Invalidate queries to refetch data
      // queryClient.invalidateQueries(['rss-articles'])
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Rss className="w-10 h-10" />
          RSS Feeds
        </h1>
        <p className="text-muted-foreground">
          Stay updated with the latest AI news from top companies and media outlets
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Feeds List */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search feeds..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Filters</h3>
                  <div className="space-y-2">
                    <Button
                      variant={showOnlyUnread ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setShowOnlyUnread(!showOnlyUnread)}
                    >
                      <Circle className="w-4 h-4 mr-2" />
                      Unread Only
                    </Button>
                    <Button
                      variant={showOnlyBookmarked ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
                    >
                      <Bookmark className="w-4 h-4 mr-2" />
                      Bookmarked
                    </Button>
                  </div>
                </div>

                {feedsLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button
                      variant={selectedFeed === null ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedFeed(null)}
                    >
                      <Rss className="w-4 h-4 mr-2" />
                      All Feeds
                    </Button>

                    {Object.entries(feedsByCategory).map(([category, categoryFeeds]) => (
                      <div key={category}>
                        <h4 className="text-sm font-semibold mb-2 text-muted-foreground">
                          {category}
                        </h4>
                        <div className="space-y-1">
                          {categoryFeeds.map((feed) => (
                            <Button
                              key={feed.id}
                              variant={selectedFeed === feed.id ? 'default' : 'ghost'}
                              size="sm"
                              className="w-full justify-start text-left"
                              onClick={() => setSelectedFeed(feed.id)}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {feed.iconUrl && (
                                  <img
                                    src={feed.iconUrl}
                                    alt=""
                                    className="w-4 h-4 rounded"
                                  />
                                )}
                                <span className="truncate">{feed.name}</span>
                                {feed.articleCount > 0 && (
                                  <Badge variant="secondary" className="ml-auto">
                                    {feed.articleCount}
                                  </Badge>
                                )}
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Articles */}
        <div className="lg:col-span-3">
          {articlesLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16">
              <Rss className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">
                No articles found. Try fetching RSS feeds from the backend.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {articles.map((article: RssArticle) => (
                  <Card
                    key={article.id}
                    className={`hover:shadow-lg transition-shadow ${
                      article.isRead ? 'opacity-60' : ''
                    }`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        {article.imageUrl && (
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-32 h-32 object-cover rounded-md flex-shrink-0"
                          />
                        )}

                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              {article.feed && (
                                <div className="flex items-center gap-2 mb-2">
                                  {article.feed.iconUrl && (
                                    <img
                                      src={article.feed.iconUrl}
                                      alt=""
                                      className="w-4 h-4 rounded"
                                    />
                                  )}
                                  <Badge variant="outline">{article.feed.name}</Badge>
                                </div>
                              )}

                              <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                                {article.title}
                              </h3>

                              {article.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {article.description}
                                </p>
                              )}
                            </div>

                            <div className="flex gap-2 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMarkAsRead(article.id)}
                                title={article.isRead ? 'Read' : 'Mark as read'}
                              >
                                {article.isRead ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                  <Circle className="w-5 h-5" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleBookmark(article.id)}
                                title={
                                  article.isBookmarked
                                    ? 'Remove bookmark'
                                    : 'Bookmark article'
                                }
                              >
                                {article.isBookmarked ? (
                                  <BookmarkCheck className="w-5 h-5 text-blue-600" />
                                ) : (
                                  <Bookmark className="w-5 h-5" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {article.author && (
                                <div className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  <span>{article.author}</span>
                                </div>
                              )}
                              {article.publishedAt && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>
                                    {new Date(article.publishedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>

                            <Button variant="default" size="sm" asChild>
                              <a
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => handleMarkAsRead(article.id)}
                              >
                                Read Article
                                <ExternalLink className="w-4 h-4 ml-2" />
                              </a>
                            </Button>
                          </div>
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
      </div>
    </div>
  )
}
