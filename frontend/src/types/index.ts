// User types
export interface User {
  id: number
  username: string
  email: string
  fullName: string | null
  role: 'user' | 'moderator' | 'admin'
  preferences: Record<string, any> | null
  createdAt: string
}

export interface AuthResponse {
  message: string
  user: User
  token: {
    type: string
    value: string
    expiresAt: string | null
  }
}

export interface LoginCredentials {
  uid: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  password_confirmation: string
  fullName?: string
}

// Tool types
export interface Tool {
  id: number
  name: string
  slug: string
  description: string
  category: string
  url: string
  logoUrl: string | null
  pricing: 'free' | 'freemium' | 'paid'
  features: string[] | null
  pros: string[] | null
  cons: string[] | null
  githubRepo: string | null
  userId: number | null
  averageRating: number
  ratingsCount: number
  viewsCount: number
  createdAt: string
  updatedAt: string
  user?: User
}

export interface CreateToolData {
  name: string
  description: string
  category: string
  url: string
  logoUrl?: string
  pricing: 'free' | 'freemium' | 'paid'
  features?: string[]
  pros?: string[]
  cons?: string[]
  githubRepo?: string
}

export interface UpdateToolData extends Partial<CreateToolData> {}

export interface ToolsListResponse {
  data: Tool[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
    first_page: number
    first_page_url: string
    last_page_url: string
    next_page_url: string | null
    previous_page_url: string | null
  }
}

export interface ToolFilters {
  page?: number
  limit?: number
  category?: string
  pricing?: string
  search?: string
  sortBy?: 'createdAt' | 'name' | 'averageRating' | 'viewsCount'
  sortOrder?: 'asc' | 'desc'
}

// Comment types
export interface Comment {
  id: number
  content: string
  userId: number
  commentableType: string
  commentableId: number
  parentId: number | null
  isEdited: boolean
  editedAt: string | null
  createdAt: string
  updatedAt: string
  user?: User
}

export interface CreateCommentData {
  content: string
  commentableType: 'Tool' | 'Article' | 'AiModel'
  commentableId: number
  parentId?: number
}

export interface UpdateCommentData {
  content: string
}

// Rating types
export interface Rating {
  id: number
  userId: number
  rateableType: string
  rateableId: number
  score: number
  reviewText: string | null
  createdAt: string
  updatedAt: string
  user?: User
}

export interface CreateRatingData {
  score: number
  reviewText?: string
  rateableType: 'Tool' | 'Article' | 'AiModel'
  rateableId: number
}

export interface UpdateRatingData {
  score: number
  reviewText?: string
}

// Bookmark types
export interface Bookmark {
  id: number
  userId: number
  bookmarkableType: string
  bookmarkableId: number
  createdAt: string
  updatedAt: string
}

export interface BookmarkCheckResponse {
  isBookmarked: boolean
  bookmark: Bookmark | null
}

export interface BookmarkToggleResponse {
  message: string
  isBookmarked: boolean
  data?: Bookmark
}

// API Response types
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

export interface ApiSuccess<T = any> {
  message?: string
  data?: T
  user?: User
}

// Article types
export interface Article {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string | null
  sourceUrl: string | null
  author: string | null
  publishedAt: string | null
  imageUrl: string | null
  category: string | null
  userId: number | null
  viewsCount: number
  createdAt: string
  updatedAt: string
  user?: User
}

export interface CreateArticleData {
  title: string
  slug: string
  content: string
  excerpt?: string
  sourceUrl?: string
  author?: string
  publishedAt?: string
  imageUrl?: string
  category?: string
}

export interface UpdateArticleData extends Partial<CreateArticleData> {}

export interface ArticlesListResponse {
  data: Article[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
    first_page: number
    first_page_url: string
    last_page_url: string
    next_page_url: string | null
    previous_page_url: string | null
  }
}

export interface ArticleFilters {
  page?: number
  limit?: number
  category?: string
  search?: string
}

// AI Model types
export interface AiModel {
  id: number
  name: string
  provider: string
  version: string | null
  modelType: string
  contextWindow: number | null
  parametersCount: string | null
  pricing: Record<string, any> | null
  capabilities: Record<string, any> | null
  benchmarkScores: Record<string, any> | null
  releaseDate: string | null
  documentationUrl: string | null
  status: 'active' | 'deprecated'
  createdAt: string
  updatedAt: string
}

export interface CreateAiModelData {
  name: string
  provider: string
  version?: string
  modelType: string
  contextWindow?: number
  parametersCount?: string
  pricing?: Record<string, any>
  capabilities?: Record<string, any>
  benchmarkScores?: Record<string, any>
  releaseDate?: string
  documentationUrl?: string
  status?: 'active' | 'deprecated'
}

export interface UpdateAiModelData extends Partial<CreateAiModelData> {}

export interface AiModelsListResponse {
  data: AiModel[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
    first_page: number
    first_page_url: string
    last_page_url: string
    next_page_url: string | null
    previous_page_url: string | null
  }
}

export interface AiModelFilters {
  page?: number
  limit?: number
  provider?: string
  modelType?: string
  status?: 'active' | 'deprecated'
  search?: string
}

// Tag types
export interface Tag {
  id: number
  name: string
  slug: string
  createdAt: string
  updatedAt: string
  usage_count?: number
}
