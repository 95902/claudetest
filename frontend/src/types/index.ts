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

// API Response types
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

export interface ApiSuccess<T = any> {
  message?: string
  data?: T
}
