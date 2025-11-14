import vine from '@vinejs/vine'

export const createRatingValidator = vine.compile(
  vine.object({
    score: vine.number().min(1).max(5),
    reviewText: vine.string().trim().minLength(1).maxLength(2000).nullable().optional(),
    rateableType: vine.enum(['Tool', 'Article', 'AiModel']),
    rateableId: vine.number().positive(),
  })
)

export const updateRatingValidator = vine.compile(
  vine.object({
    score: vine.number().min(1).max(5),
    reviewText: vine.string().trim().minLength(1).maxLength(2000).nullable().optional(),
  })
)