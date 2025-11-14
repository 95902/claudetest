import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator } from '#validators/auth_validator'

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

      // Generate access token (no expiration)
      const token = await User.accessTokens.create(user)

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

      // Generate access token (no expiration)
      const token = await User.accessTokens.create(user)

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
