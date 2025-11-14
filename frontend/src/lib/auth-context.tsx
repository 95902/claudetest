import React, { createContext, useContext, useState, useEffect } from 'react'
import type { User } from '@/types'
import { api } from '@/services/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (uid: string, password: string) => Promise<void>
  register: (data: {
    username: string
    email: string
    password: string
    password_confirmation: string
    fullName?: string
  }) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        if (api.isAuthenticated()) {
          const { user: currentUser } = await api.getMe()
          setUser(currentUser)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        // Clear invalid token
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (uid: string, password: string) => {
    const response = await api.login({ uid, password })
    setUser(response.user)
  }

  const register = async (data: {
    username: string
    email: string
    password: string
    password_confirmation: string
    fullName?: string
  }) => {
    const response = await api.register(data)
    setUser(response.user)
  }

  const logout = async () => {
    await api.logout()
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
