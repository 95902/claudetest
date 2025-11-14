import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/services/api'
import { useAuth } from '@/lib/auth-context'
import { useNavigate } from 'react-router-dom'

interface BookmarkButtonProps {
  bookmarkableType: 'Tool' | 'Article' | 'AiModel'
  bookmarkableId: number
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  showLabel?: boolean
}

export default function BookmarkButton({
  bookmarkableType,
  bookmarkableId,
  variant = 'outline',
  size = 'default',
  showLabel = false,
}: BookmarkButtonProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Check if bookmarked
  const { data: bookmarkData } = useQuery({
    queryKey: ['bookmark', bookmarkableType, bookmarkableId],
    queryFn: () => api.checkBookmark(bookmarkableType, bookmarkableId),
    enabled: !!user,
  })

  useEffect(() => {
    if (bookmarkData?.data) {
      setIsBookmarked(bookmarkData.data.isBookmarked)
    }
  }, [bookmarkData])

  // Toggle bookmark mutation
  const toggleMutation = useMutation({
    mutationFn: () => api.toggleBookmark(bookmarkableType, bookmarkableId),
    onSuccess: (data) => {
      setIsBookmarked(data.isBookmarked)
      // Invalidate bookmark queries
      queryClient.invalidateQueries({
        queryKey: ['bookmark', bookmarkableType, bookmarkableId],
      })
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
    },
  })

  const handleClick = () => {
    if (!user) {
      navigate('/login')
      return
    }
    toggleMutation.mutate()
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={toggleMutation.isPending}
      className="gap-2"
    >
      <Bookmark
        className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`}
        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      />
      {showLabel && (isBookmarked ? 'Bookmarked' : 'Bookmark')}
    </Button>
  )
}
