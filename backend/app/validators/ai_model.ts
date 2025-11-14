import vine from '@vinejs/vine'

export const createAiModelValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    provider: vine.string().trim().minLength(2).maxLength(255),
    version: vine.string().trim().maxLength(100).nullable().optional(),
    modelType: vine.string().trim().minLength(2).maxLength(100),
    contextWindow: vine.number().positive().nullable().optional(),
    parametersCount: vine.string().trim().maxLength(100).nullable().optional(),
    pricing: vine.any().nullable().optional(),
    capabilities: vine.any().nullable().optional(),
    benchmarkScores: vine.any().nullable().optional(),
    releaseDate: vine.date().nullable().optional(),
    documentationUrl: vine.string().url().nullable().optional(),
    status: vine.enum(['active', 'deprecated']).optional(),
  })
)

export const updateAiModelValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255).optional(),
    provider: vine.string().trim().minLength(2).maxLength(255).optional(),
    version: vine.string().trim().maxLength(100).nullable().optional(),
    modelType: vine.string().trim().minLength(2).maxLength(100).optional(),
    contextWindow: vine.number().positive().nullable().optional(),
    parametersCount: vine.string().trim().maxLength(100).nullable().optional(),
    pricing: vine.any().nullable().optional(),
    capabilities: vine.any().nullable().optional(),
    benchmarkScores: vine.any().nullable().optional(),
    releaseDate: vine.date().nullable().optional(),
    documentationUrl: vine.string().url().nullable().optional(),
    status: vine.enum(['active', 'deprecated']).optional(),
  })
)