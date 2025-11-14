import axios, { type AxiosInstance } from 'axios'
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  Tool,
  CreateToolData,
  UpdateToolData,
  ToolsListResponse,
  ToolFilters,
  ApiSuccess,
  Comment,
  CreateCommentData,
  UpdateCommentData,
  Rating,
  CreateRatingData,
  UpdateRatingData,
  Bookmark,
  BookmarkCheckResponse,
  BookmarkToggleResponse,
  Article,
  CreateArticleData,
  UpdateArticleData,
  ArticlesListResponse,
  ArticleFilters,
  AiModel,
  CreateAiModelData,
  UpdateAiModelData,
  AiModelsListResponse,
  AiModelFilters,
  Tag,
  AdminStats,
  UsersListResponse,
  RecentActivity,
  ModerationQueue,
  RssFeed,
  RssArticle,
  RssFeedsListResponse,
  RssArticlesListResponse,
  RssArticleFilters,
  CreateRssFeedData,
  UpdateRssFeedData,
} from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add auth token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Handle token expiration
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Authentication
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/api/auth/register', data)
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token.value)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/api/auth/login', credentials)
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token.value)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  }

  async logout(): Promise<void> {
    await this.client.post('/api/auth/logout')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  async getMe(): Promise<{ user: User }> {
    const response = await this.client.get<{ user: User }>('/api/auth/me')
    localStorage.setItem('user', JSON.stringify(response.data.user))
    return response.data
  }

  async updateProfile(data: Partial<User>): Promise<ApiSuccess<User>> {
    const response = await this.client.put<ApiSuccess<User>>('/api/auth/profile', data)
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  }

  // Tools
  async getTools(filters?: ToolFilters): Promise<ToolsListResponse> {
    const response = await this.client.get<ToolsListResponse>('/api/tools', {
      params: filters,
    })
    return response.data
  }

  async getTool(idOrSlug: string | number): Promise<ApiSuccess<Tool>> {
    const response = await this.client.get<ApiSuccess<Tool>>(`/api/tools/${idOrSlug}`)
    return response.data
  }

  async createTool(data: CreateToolData): Promise<ApiSuccess<Tool>> {
    const response = await this.client.post<ApiSuccess<Tool>>('/api/tools', data)
    return response.data
  }

  async updateTool(id: number, data: UpdateToolData): Promise<ApiSuccess<Tool>> {
    const response = await this.client.put<ApiSuccess<Tool>>(`/api/tools/${id}`, data)
    return response.data
  }

  async deleteTool(id: number): Promise<ApiSuccess> {
    const response = await this.client.delete<ApiSuccess>(`/api/tools/${id}`)
    return response.data
  }

  async searchTools(query: string, limit = 10): Promise<ApiSuccess<Tool[]>> {
    const response = await this.client.get<ApiSuccess<Tool[]>>('/api/tools/search', {
      params: { q: query, limit },
    })
    return response.data
  }

  // Helper: Get current user from localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  // Helper: Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token')
  }

  // Helper: Get auth token
  getToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  // Comments
  async getComments(
    commentableType: string,
    commentableId: number,
    parentId?: number | null
  ): Promise<ApiSuccess<Comment[]>> {
    const response = await this.client.get<ApiSuccess<Comment[]>>('/api/comments', {
      params: { commentableType, commentableId, parentId },
    })
    return response.data
  }

  async createComment(data: CreateCommentData): Promise<ApiSuccess<Comment>> {
    const response = await this.client.post<ApiSuccess<Comment>>('/api/comments', data)
    return response.data
  }

  async updateComment(id: number, data: UpdateCommentData): Promise<ApiSuccess<Comment>> {
    const response = await this.client.put<ApiSuccess<Comment>>(`/api/comments/${id}`, data)
    return response.data
  }

  async deleteComment(id: number): Promise<void> {
    await this.client.delete(`/api/comments/${id}`)
  }

  // Ratings
  async getRatings(rateableType: string, rateableId: number): Promise<ApiSuccess<Rating[]>> {
    const response = await this.client.get<ApiSuccess<Rating[]>>('/api/ratings', {
      params: { rateableType, rateableId },
    })
    return response.data
  }

  async getMyRating(rateableType: string, rateableId: number): Promise<ApiSuccess<Rating>> {
    const response = await this.client.get<ApiSuccess<Rating>>('/api/ratings/me', {
      params: { rateableType, rateableId },
    })
    return response.data
  }

  async createRating(data: CreateRatingData): Promise<ApiSuccess<Rating>> {
    const response = await this.client.post<ApiSuccess<Rating>>('/api/ratings', data)
    return response.data
  }

  async updateRating(id: number, data: UpdateRatingData): Promise<ApiSuccess<Rating>> {
    const response = await this.client.put<ApiSuccess<Rating>>(`/api/ratings/${id}`, data)
    return response.data
  }

  async deleteRating(id: number): Promise<void> {
    await this.client.delete(`/api/ratings/${id}`)
  }

  // Bookmarks
  async getMyBookmarks(bookmarkableType?: string): Promise<ApiSuccess<Bookmark[]>> {
    const response = await this.client.get<ApiSuccess<Bookmark[]>>('/api/bookmarks', {
      params: { bookmarkableType },
    })
    return response.data
  }

  async checkBookmark(
    bookmarkableType: string,
    bookmarkableId: number
  ): Promise<ApiSuccess<BookmarkCheckResponse>> {
    const response = await this.client.get<ApiSuccess<BookmarkCheckResponse>>(
      '/api/bookmarks/check',
      {
        params: { bookmarkableType, bookmarkableId },
      }
    )
    return response.data
  }

  async toggleBookmark(
    bookmarkableType: string,
    bookmarkableId: number
  ): Promise<BookmarkToggleResponse> {
    const response = await this.client.post<BookmarkToggleResponse>('/api/bookmarks/toggle', {
      bookmarkableType,
      bookmarkableId,
    })
    return response.data
  }

  async deleteBookmark(id: number): Promise<void> {
    await this.client.delete(`/api/bookmarks/${id}`)
  }

  // Articles
  async getArticles(filters?: ArticleFilters): Promise<ArticlesListResponse> {
    const response = await this.client.get<ArticlesListResponse>('/api/articles', {
      params: filters,
    })
    return response.data
  }

  async getArticle(idOrSlug: string | number): Promise<ApiSuccess<Article>> {
    const response = await this.client.get<ApiSuccess<Article>>(`/api/articles/${idOrSlug}`)
    return response.data
  }

  async createArticle(data: CreateArticleData): Promise<ApiSuccess<Article>> {
    const response = await this.client.post<ApiSuccess<Article>>('/api/articles', data)
    return response.data
  }

  async updateArticle(id: number, data: UpdateArticleData): Promise<ApiSuccess<Article>> {
    const response = await this.client.put<ApiSuccess<Article>>(`/api/articles/${id}`, data)
    return response.data
  }

  async deleteArticle(id: number): Promise<void> {
    await this.client.delete(`/api/articles/${id}`)
  }

  // AI Models
  async getAiModels(filters?: AiModelFilters): Promise<AiModelsListResponse> {
    const response = await this.client.get<AiModelsListResponse>('/api/ai-models', {
      params: filters,
    })
    return response.data
  }

  async getAiModel(id: number): Promise<ApiSuccess<AiModel>> {
    const response = await this.client.get<ApiSuccess<AiModel>>(`/api/ai-models/${id}`)
    return response.data
  }

  async createAiModel(data: CreateAiModelData): Promise<ApiSuccess<AiModel>> {
    const response = await this.client.post<ApiSuccess<AiModel>>('/api/ai-models', data)
    return response.data
  }

  async updateAiModel(id: number, data: UpdateAiModelData): Promise<ApiSuccess<AiModel>> {
    const response = await this.client.put<ApiSuccess<AiModel>>(`/api/ai-models/${id}`, data)
    return response.data
  }

  async deleteAiModel(id: number): Promise<void> {
    await this.client.delete(`/api/ai-models/${id}`)
  }

  // Tags
  async getTags(): Promise<ApiSuccess<Tag[]>> {
    const response = await this.client.get<ApiSuccess<Tag[]>>('/api/tags')
    return response.data
  }

  async getResourceTags(
    taggableType: string,
    taggableId: number
  ): Promise<ApiSuccess<Tag[]>> {
    const response = await this.client.get<ApiSuccess<Tag[]>>('/api/tags/resource', {
      params: { taggableType, taggableId },
    })
    return response.data
  }

  async attachTags(
    taggableType: string,
    taggableId: number,
    tags: string[]
  ): Promise<ApiSuccess> {
    const response = await this.client.post<ApiSuccess>('/api/tags/attach', {
      taggableType,
      taggableId,
      tags,
    })
    return response.data
  }

  async detachTags(
    taggableType: string,
    taggableId: number,
    tagIds?: number[]
  ): Promise<ApiSuccess> {
    const response = await this.client.post<ApiSuccess>('/api/tags/detach', {
      taggableType,
      taggableId,
      tagIds,
    })
    return response.data
  }

  // Admin
  async getAdminStats(): Promise<ApiSuccess<AdminStats>> {
    const response = await this.client.get<ApiSuccess<AdminStats>>('/api/admin/stats')
    return response.data
  }

  async getUsers(params?: {
    page?: number
    limit?: number
    role?: string
    search?: string
  }): Promise<UsersListResponse> {
    const response = await this.client.get<UsersListResponse>('/api/admin/users', { params })
    return response.data
  }

  async updateUserRole(userId: number, role: string): Promise<ApiSuccess<User>> {
    const response = await this.client.put<ApiSuccess<User>>(`/api/admin/users/${userId}/role`, {
      role,
    })
    return response.data
  }

  async deleteUser(userId: number): Promise<ApiSuccess> {
    const response = await this.client.delete<ApiSuccess>(`/api/admin/users/${userId}`)
    return response.data
  }

  async getRecentActivity(limit?: number): Promise<ApiSuccess<RecentActivity>> {
    const response = await this.client.get<ApiSuccess<RecentActivity>>('/api/admin/activity', {
      params: { limit },
    })
    return response.data
  }

  async getModerationQueue(type?: string): Promise<ApiSuccess<ModerationQueue>> {
    const response = await this.client.get<ApiSuccess<ModerationQueue>>('/api/admin/moderation', {
      params: { type },
    })
    return response.data
  }

  // RSS Feeds
  async getRssFeeds(params?: { page?: number; limit?: number; category?: string; is_active?: boolean }): Promise<RssFeedsListResponse> {
    const response = await this.client.get<RssFeedsListResponse>('/api/rss-feeds', { params })
    return response.data
  }

  async getRssFeed(id: number): Promise<{ feed: RssFeed; articles: RssArticlesListResponse }> {
    const response = await this.client.get<{ feed: RssFeed; articles: RssArticlesListResponse }>(`/api/rss-feeds/${id}`)
    return response.data
  }

  async createRssFeed(data: CreateRssFeedData): Promise<ApiSuccess<RssFeed>> {
    const response = await this.client.post<ApiSuccess<RssFeed>>('/api/rss-feeds', data)
    return response.data
  }

  async updateRssFeed(id: number, data: UpdateRssFeedData): Promise<ApiSuccess<RssFeed>> {
    const response = await this.client.put<ApiSuccess<RssFeed>>(`/api/rss-feeds/${id}`, data)
    return response.data
  }

  async deleteRssFeed(id: number): Promise<ApiSuccess> {
    const response = await this.client.delete<ApiSuccess>(`/api/rss-feeds/${id}`)
    return response.data
  }

  async fetchRssFeed(id: number): Promise<ApiSuccess<{ feed: RssFeed; newArticlesCount: number }>> {
    const response = await this.client.post<ApiSuccess<{ feed: RssFeed; newArticlesCount: number }>>(`/api/rss-feeds/${id}/fetch`)
    return response.data
  }

  async fetchAllRssFeeds(): Promise<ApiSuccess<{ results: any[]; totalNewArticles: number }>> {
    const response = await this.client.post<ApiSuccess<{ results: any[]; totalNewArticles: number }>>('/api/rss-feeds/fetch-all')
    return response.data
  }

  // RSS Articles
  async getRssArticles(filters?: RssArticleFilters): Promise<RssArticlesListResponse> {
    const response = await this.client.get<RssArticlesListResponse>('/api/rss-feeds/articles', { params: filters })
    return response.data
  }

  async markRssArticleAsRead(id: number): Promise<ApiSuccess<RssArticle>> {
    const response = await this.client.put<ApiSuccess<RssArticle>>(`/api/rss-feeds/articles/${id}/read`)
    return response.data
  }

  async toggleRssArticleBookmark(id: number): Promise<ApiSuccess<RssArticle>> {
    const response = await this.client.post<ApiSuccess<RssArticle>>(`/api/rss-feeds/articles/${id}/bookmark`)
    return response.data
  }
}

export const api = new ApiService()
export default api
