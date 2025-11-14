import vine from '@vinejs/vine'

/**
 * Validator for user registration
 */
export const registerValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(50)
      .regex(/^[a-zA-Z0-9_-]+$/)
      .unique(async (db, value) => {
        const user = await db.from('users').where('username', value).first()
        return !user
      }),
    email: vine
      .string()
      .trim()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    password: vine
      .string()
      .minLength(8)
      .maxLength(255)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .confirmed(),
    fullName: vine.string().trim().minLength(2).maxLength(255).optional(),
  })
)

/**
 * Validator for user login
 */
export const loginValidator = vine.compile(
  vine.object({
    uid: vine.string().trim(), // Can be email or username
    password: vine.string(),
  })
)

/**
 * Validator for updating user profile
 */
export const updateProfileValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(255).optional(),
    preferences: vine.object({}).optional(),
  })
)
