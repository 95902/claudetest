import vine from '@vinejs/vine'

/**
 * Valid tool categories
 */
const TOOL_CATEGORIES = [
  'LLM',
  'Code Assistant',
  'Image Generation',
  'Video Generation',
  'Audio Generation',
  'Framework',
  'Vector Database',
  'No-Code Platform',
  'Dev Tool',
  'MLOps',
  'Testing',
  'Other',
] as const

/**
 * Validator for creating a tool
 */
export const createToolValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    description: vine.string().trim().minLength(10).maxLength(5000),
    category: vine.enum(TOOL_CATEGORIES),
    url: vine.string().url().maxLength(500),
    logoUrl: vine.string().url().maxLength(500).optional(),
    pricing: vine.enum(['free', 'freemium', 'paid']),
    features: vine.array(vine.string()).optional(),
    pros: vine.array(vine.string()).optional(),
    cons: vine.array(vine.string()).optional(),
    githubRepo: vine
      .string()
      .regex(/^https:\/\/github\.com\/[\w-]+\/[\w-]+$/)
      .optional(),
  })
)

/**
 * Validator for updating a tool
 */
export const updateToolValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255).optional(),
    description: vine.string().trim().minLength(10).maxLength(5000).optional(),
    category: vine.enum(TOOL_CATEGORIES).optional(),
    url: vine.string().url().maxLength(500).optional(),
    logoUrl: vine.string().url().maxLength(500).optional().nullable(),
    pricing: vine.enum(['free', 'freemium', 'paid']).optional(),
    features: vine.array(vine.string()).optional(),
    pros: vine.array(vine.string()).optional(),
    cons: vine.array(vine.string()).optional(),
    githubRepo: vine
      .string()
      .regex(/^https:\/\/github\.com\/[\w-]+\/[\w-]+$/)
      .optional()
      .nullable(),
  })
)
