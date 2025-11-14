import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Users,
  Wrench,
  FileText,
  Brain,
  MessageSquare,
  Star,
  Shield,
  Trash2,
  Search,
  TrendingUp,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Link, Navigate } from 'react-router-dom'

export default function AdminDashboard() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'activity' | 'moderation'>(
    'stats'
  )

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8" />
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        </div>
        <p className="text-muted-foreground">
          Manage users, monitor platform statistics, and moderate content
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b">
        <Button
          variant={activeTab === 'stats' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('stats')}
          className="rounded-b-none"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Statistics
        </Button>
        <Button
          variant={activeTab === 'users' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('users')}
          className="rounded-b-none"
        >
          <Users className="w-4 h-4 mr-2" />
          Users
        </Button>
        <Button
          variant={activeTab === 'activity' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('activity')}
          className="rounded-b-none"
        >
          <FileText className="w-4 h-4 mr-2" />
          Activity
        </Button>
        <Button
          variant={activeTab === 'moderation' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('moderation')}
          className="rounded-b-none"
        >
          <Shield className="w-4 h-4 mr-2" />
          Moderation
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'stats' && <StatsTab />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'activity' && <ActivityTab />}
      {activeTab === 'moderation' && <ModerationTab />}
    </div>
  )
}

function StatsTab() {
  const { data, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => api.getAdminStats(),
  })

  const stats = data?.data

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      {/* User Stats */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold">{stats.users.total}</p>
                </div>
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Admins</p>
                  <p className="text-3xl font-bold">{stats.users.admins}</p>
                </div>
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Moderators</p>
                  <p className="text-3xl font-bold">{stats.users.moderators}</p>
                </div>
                <Shield className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Regular Users</p>
                  <p className="text-3xl font-bold">{stats.users.regular}</p>
                </div>
                <Users className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content Stats */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tools</p>
                  <p className="text-3xl font-bold">{stats.tools.total}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Avg Rating: {stats.tools.avgRating?.toFixed(1) || 'N/A'}
                  </p>
                </div>
                <Wrench className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Articles</p>
                  <p className="text-3xl font-bold">{stats.articles.total}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI Models</p>
                  <p className="text-3xl font-bold">{stats.aiModels.total}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.aiModels.active} active, {stats.aiModels.deprecated} deprecated
                  </p>
                </div>
                <Brain className="w-8 h-8 text-pink-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Engagement</p>
                  <p className="text-lg font-bold">{stats.engagement.comments} comments</p>
                  <p className="text-lg font-bold">{stats.engagement.ratings} ratings</p>
                </div>
                <div className="flex flex-col gap-1">
                  <MessageSquare className="w-6 h-6 text-blue-500" />
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tools by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.tools.byCategory.map((cat) => (
                <div key={cat.category} className="flex justify-between items-center">
                  <span className="text-sm">{cat.category}</span>
                  <Badge variant="outline">{cat.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Models by Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.aiModels.byProvider.map((prov) => (
                <div key={prov.provider} className="flex justify-between items-center">
                  <span className="text-sm">{prov.provider}</span>
                  <Badge variant="outline">{prov.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function UsersTab() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['adminUsers', page, search, roleFilter],
    queryFn: () =>
      api.getUsers({
        page,
        limit: 20,
        search: search || undefined,
        role: roleFilter || undefined,
      }),
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      api.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: (userId: number) => api.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
    },
  })

  const users = data?.data || []
  const meta = data?.meta

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="moderator">Moderator</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Username</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Role</th>
                      <th className="text-left py-3 px-4">Joined</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{user.id}</td>
                        <td className="py-3 px-4 font-medium">{user.username}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {user.email}
                        </td>
                        <td className="py-3 px-4">
                          <Select
                            value={user.role}
                            onValueChange={(role) =>
                              updateRoleMutation.mutate({ userId: user.id, role })
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (
                                confirm(
                                  `Are you sure you want to delete user "${user.username}"?`
                                )
                              ) {
                                deleteUserMutation.mutate(user.id)
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="flex justify-center gap-2">
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

function ActivityTab() {
  const { data, isLoading } = useQuery({
    queryKey: ['adminActivity'],
    queryFn: () => api.getRecentActivity(20),
  })

  const activity = data?.data

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!activity) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Recent Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Recent Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activity.tools.map((tool) => (
              <Link
                key={tool.id}
                to={`/tools/${tool.slug}`}
                className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="font-medium text-sm">{tool.name}</div>
                <div className="text-xs text-muted-foreground">
                  {tool.category} • {new Date(tool.createdAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Articles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Articles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activity.articles.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.slug}`}
                className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="font-medium text-sm line-clamp-2">{article.title}</div>
                <div className="text-xs text-muted-foreground">
                  {article.category} • {new Date(article.createdAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Recent Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activity.comments.map((comment) => (
              <div key={comment.id} className="p-3 rounded-lg border">
                <div className="text-sm line-clamp-2">{comment.content}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  by {comment.user?.username} •{' '}
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ModerationTab() {
  const [typeFilter, setTypeFilter] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['adminModeration', typeFilter],
    queryFn: () => api.getModerationQueue(typeFilter || undefined),
  })

  const queue = data?.data

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!queue) return null

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex gap-4">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="tools">Tools</SelectItem>
            <SelectItem value="articles">Articles</SelectItem>
            <SelectItem value="comments">Comments</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Moderation Queue */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tools */}
        {queue.tools && queue.tools.length > 0 && (
          <>
            {queue.tools.map((tool) => (
              <Card key={tool.id}>
                <CardContent className="pt-6">
                  <Badge className="mb-2">Tool</Badge>
                  <h3 className="font-semibold mb-2">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {tool.description}
                  </p>
                  <div className="text-xs text-muted-foreground mb-3">
                    by {tool.user?.username} •{' '}
                    {new Date(tool.createdAt).toLocaleDateString()}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/tools/${tool.slug}`}>Review</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {/* Articles */}
        {queue.articles && queue.articles.length > 0 && (
          <>
            {queue.articles.map((article) => (
              <Card key={article.id}>
                <CardContent className="pt-6">
                  <Badge className="mb-2">Article</Badge>
                  <h3 className="font-semibold mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {article.excerpt}
                  </p>
                  <div className="text-xs text-muted-foreground mb-3">
                    by {article.user?.username} •{' '}
                    {new Date(article.createdAt).toLocaleDateString()}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/articles/${article.slug}`}>Review</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {/* Comments */}
        {queue.comments && queue.comments.length > 0 && (
          <>
            {queue.comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="pt-6">
                  <Badge className="mb-2">Comment</Badge>
                  <p className="text-sm mb-3 line-clamp-4">{comment.content}</p>
                  <div className="text-xs text-muted-foreground">
                    by {comment.user?.username} •{' '}
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>

      {/* Empty state */}
      {(!queue.tools || queue.tools.length === 0) &&
        (!queue.articles || queue.articles.length === 0) &&
        (!queue.comments || queue.comments.length === 0) && (
          <div className="text-center py-16">
            <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground text-lg">No items in moderation queue</p>
          </div>
        )}
    </div>
  )
}
