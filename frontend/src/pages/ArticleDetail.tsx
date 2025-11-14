import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Calendar, User, Eye, ExternalLink } from 'lucide-react'
import BookmarkButton from '@/components/BookmarkButton'
import RatingStars from '@/components/RatingStars'
import CommentSection from '@/components/CommentSection'

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  const { data, isLoading, error } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => api.getArticle(slug!),
    enabled: !!slug,
  })

  const article = data?.data

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-12 w-2/3 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Article not found</h2>
        <p className="text-muted-foreground mb-4">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/articles">Browse All Articles</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back button */}
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/articles">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Articles
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {article.category && (
              <Badge variant="outline" className="mb-3">
                {article.category}
              </Badge>
            )}
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

            {article.excerpt && (
              <p className="text-lg text-muted-foreground mb-4">{article.excerpt}</p>
            )}

            <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
              {article.author && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{article.author}</span>
                </div>
              )}
              {article.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{article.viewsCount} views</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <BookmarkButton
              bookmarkableType="Article"
              bookmarkableId={article.id}
              variant="outline"
            />
            {article.sourceUrl && (
              <Button variant="outline" asChild>
                <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Source
                </a>
              </Button>
            )}
          </div>
        </div>

        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
        )}
      </div>

      {/* Content */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="prose prose-slate max-w-none">
            <div className="whitespace-pre-wrap">{article.content}</div>
          </div>

          {article.user && (
            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Published by <span className="font-medium">{article.user.username}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rating Section */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Rate this Article</h3>
          <RatingStars
            rateableType="Article"
            rateableId={article.id}
            showReviewInput={true}
          />
        </CardContent>
      </Card>

      {/* Comments Section */}
      <CommentSection commentableType="Article" commentableId={article.id} />
    </div>
  )
}
