import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator } from '#validators/auth_validator'
import db from '@adonisjs/lucid/services/db'
import string from '@poppinss/utils/string'
import { DateTime } from 'luxon'

/**
 * Helper function to create access token manually
 * This bypasses the @adonisjs/auth bug with expires_at calculation
 */
async function createManualAccessToken(user: User) {
  const tokenValue = string.generateRandom(64)
  const tokenHash = string.hash(tokenValue)

  const [tokenRow] = await db
    .table('auth_access_tokens')
    .insert({
      tokenable_id: user.id,
      type: 'auth_token',
      name: null,
      hash: tokenHash,
      abilities: JSON.stringify(['*']),
      expires_at: null,
      created_at: DateTime.now().toSQL(),
      updated_at: DateTime.now().toSQL(),
    })
    .returning('*')

  return {
    value: tokenValue,
    expiresAt: null,
    tokenRow,
  }
}

export default class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register({ request, response }: HttpContext) {
    try {
      // Validate request data
      const data = await request.validateUsing(registerValidator)

      // Create user with default role
      const user = await User.create({
        username: data.username,
        email: data.email,
        password: data.password,
        fullName: data.fullName || null,
        role: 'user',
        preferences: null,
      })

      // Generate access token (manual creation to avoid expires_at bug)
      const token = await createManualAccessToken(user)

      return response.created({
        message: 'User registered successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
        token: {
          type: 'bearer',
          value: token.value,
          expiresAt: token.expiresAt,
        },
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: 'Validation failed',
          errors: error.messages,
        })
      }
      throw error
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login({ request, response }: HttpContext) {
    try {
      // Validate request data
      const { uid, password } = await request.validateUsing(loginValidator)

      // Verify credentials
      const user = await User.verifyCredentials(uid, password)

      // Generate access token
      const token = await User.accessTokens.create(user, ['*'])

      return response.ok({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
        token: {
          type: 'bearer',
          value: token.value!.release(),
          expiresAt: token.expiresAt,
        },
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: 'Validation failed',
          errors: error.messages,
        })
      }

      // Invalid credentials
      return response.unauthorized({
        message: 'Invalid credentials',
      })
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  async logout({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const token = auth.user?.currentAccessToken

    if (token) {
      await User.accessTokens.delete(user, token.identifier)
    }

    return response.ok({
      message: 'Logout successful',
    })
  }

  /**
   * Get authenticated user
   * GET /api/auth/me
   */
  async me({ auth, response }: HttpContext) {
    await auth.check()

    const user = auth.getUserOrFail()

    return response.ok({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        preferences: user.preferences,
        createdAt: user.createdAt,
      },
    })
  }

  /**
   * Update user profile
   * PUT /api/auth/profile
   */
  async updateProfile({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const data = request.only(['fullName', 'preferences'])

    if (data.fullName !== undefined) {
      user.fullName = data.fullName
    }

    if (data.preferences !== undefined) {
      user.preferences = data.preferences
    }

    await user.save()

    return response.ok({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        preferences: user.preferences,
      },
    })
  }
}
