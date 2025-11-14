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
}

export const api = new ApiService()
export default api
