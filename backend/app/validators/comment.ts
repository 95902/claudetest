import vine from '@vinejs/vine'

export const createCommentValidator = vine.compile(
  vine.object({
    content: vine.string().trim().minLength(1).maxLength(5000),
    commentableType: vine.enum(['Tool', 'Article', 'AiModel']),
    commentableId: vine.number().positive(),
    parentId: vine.number().positive().nullable().optional(),
  })
)

export const updateCommentValidator = vine.compile(
  vine.object({
    content: vine.string().trim().minLength(1).maxLength(5000),
  })
)