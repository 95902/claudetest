import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MessageSquare, Edit2, Trash2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { api } from '@/services/api'
import { useAuth } from '@/lib/auth-context'
import { useNavigate } from 'react-router-dom'
import type { Comment, CreateCommentData, UpdateCommentData } from '@/types'

interface CommentSectionProps {
  commentableType: 'Tool' | 'Article' | 'AiModel'
  commentableId: number
}

interface CommentItemProps {
  comment: Comment
  onEdit: (id: number, content: string) => void
  onDelete: (id: number) => void
  currentUserId?: number
}

function CommentItem({ comment, onEdit, onDelete, currentUserId }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)

  const handleSaveEdit = () => {
    onEdit(comment.id, editContent)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditContent(comment.content)
    setIsEditing(false)
  }

  const isOwner = currentUserId === comment.userId
  const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-medium text-sm">{comment.user?.username || 'Anonymous'}</p>
            <p className="text-xs text-muted-foreground">
              {formattedDate}
              {comment.isEdited && <span className="ml-1">(edited)</span>}
            </p>
          </div>
          {isOwner && !isEditing && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(comment.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[80px] p-2 border rounded-md resize-y text-sm"
              maxLength={5000}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveEdit}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-foreground whitespace-pre-wrap">{comment.content}</p>
        )}
      </CardContent>
    </Card>
  )
}

export default function CommentSection({
  commentableType,
  commentableId,
}: CommentSectionProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [newComment, setNewComment] = useState('')
  const [showCommentBox, setShowCommentBox] = useState(false)

  // Fetch comments
  const { data: commentsData, isLoading } = useQuery({
    queryKey: ['comments', commentableType, commentableId],
    queryFn: () => api.getComments(commentableType, commentableId, null),
  })

  const comments = commentsData?.data || []

  // Create comment mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateCommentData) => api.createComment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', commentableType, commentableId],
      })
      setNewComment('')
      setShowCommentBox(false)
    },
  })

  // Update comment mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCommentData }) =>
      api.updateComment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', commentableType, commentableId],
      })
    },
  })

  // Delete comment mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', commentableType, commentableId],
      })
    },
  })

  const handleSubmitComment = () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (!newComment.trim()) return

    createMutation.mutate({
      content: newComment,
      commentableType,
      commentableId,
    })
  }

  const handleEditComment = (id: number, content: string) => {
    updateMutation.mutate({ id, data: { content } })
  }

  const handleDeleteComment = (id: number) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleAddCommentClick = () => {
    if (!user) {
      navigate('/login')
      return
    }
    setShowCommentBox(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length})
        </h3>
        {!showCommentBox && (
          <Button variant="outline" size="sm" onClick={handleAddCommentClick}>
            Add Comment
          </Button>
        )}
      </div>

      {showCommentBox && (
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full min-h-[100px] p-3 border rounded-md resize-y"
                maxLength={5000}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {newComment.length}/5000 characters
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || createMutation.isPending}
                    size="sm"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    {createMutation.isPending ? 'Posting...' : 'Post Comment'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowCommentBox(false)
                      setNewComment('')
                    }}
                    disabled={createMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="text-center text-muted-foreground py-8">Loading comments...</div>
      )}

      {!isLoading && comments.length === 0 && !showCommentBox && (
        <div className="text-center text-muted-foreground py-8">
          <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}

      <div className="space-y-2">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
            currentUserId={user?.id}
          />
        ))}
      </div>
    </div>
  )
}
