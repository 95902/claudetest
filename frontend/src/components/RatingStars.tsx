import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { api } from '@/services/api'
import { useAuth } from '@/lib/auth-context'
import { useNavigate } from 'react-router-dom'
import type { CreateRatingData } from '@/types'

interface RatingStarsProps {
  rateableType: 'Tool' | 'Article' | 'AiModel'
  rateableId: number
  showReviewInput?: boolean
  onRatingSubmit?: () => void
}

export default function RatingStars({
  rateableType,
  rateableId,
  showReviewInput = false,
  onRatingSubmit,
}: RatingStarsProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [hoveredStar, setHoveredStar] = useState(0)
  const [selectedScore, setSelectedScore] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [showReview, setShowReview] = useState(false)

  // Get user's existing rating
  const { data: myRatingData } = useQuery({
    queryKey: ['myRating', rateableType, rateableId],
    queryFn: () => api.getMyRating(rateableType, rateableId),
    enabled: !!user,
    retry: false,
  })

  useEffect(() => {
    if (myRatingData?.data) {
      setSelectedScore(myRatingData.data.score)
      setReviewText(myRatingData.data.reviewText || '')
    }
  }, [myRatingData])

  // Submit rating mutation
  const submitMutation = useMutation({
    mutationFn: (data: CreateRatingData) => api.createRating(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRating', rateableType, rateableId] })
      queryClient.invalidateQueries({ queryKey: ['ratings', rateableType, rateableId] })
      queryClient.invalidateQueries({ queryKey: ['tool'] }) // Refresh tool data
      setShowReview(false)
      if (onRatingSubmit) onRatingSubmit()
    },
  })

  const handleStarClick = (score: number) => {
    if (!user) {
      navigate('/login')
      return
    }

    setSelectedScore(score)

    if (showReviewInput) {
      setShowReview(true)
    } else {
      // Submit immediately without review
      submitMutation.mutate({
        score,
        rateableType,
        rateableId,
      })
    }
  }

  const handleSubmitWithReview = () => {
    if (!user) {
      navigate('/login')
      return
    }

    submitMutation.mutate({
      score: selectedScore,
      reviewText: reviewText || undefined,
      rateableType,
      rateableId,
    })
  }

  const renderStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = hoveredStar ? star <= hoveredStar : star <= selectedScore
          return (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="cursor-pointer transition-transform hover:scale-110"
              disabled={submitMutation.isPending}
            >
              <Star
                className={`h-6 w-6 ${
                  isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            </button>
          )
        })}
        {selectedScore > 0 && (
          <span className="ml-2 text-sm text-muted-foreground">
            {selectedScore}/5
            {myRatingData?.data && ' (Your rating)'}
          </span>
        )}
      </div>
    )
  }

  if (showReview && selectedScore > 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Your Rating</label>
              {renderStars()}
            </div>
            <div>
              <label htmlFor="review" className="text-sm font-medium mb-2 block">
                Review (optional)
              </label>
              <textarea
                id="review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts about this tool..."
                className="w-full min-h-[100px] p-3 border rounded-md resize-y"
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {reviewText.length}/2000 characters
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitWithReview}
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? 'Submitting...' : 'Submit Rating'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowReview(false)
                  setSelectedScore(myRatingData?.data?.score || 0)
                  setReviewText(myRatingData?.data?.reviewText || '')
                }}
                disabled={submitMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return <div className="space-y-2">{renderStars()}</div>
}
