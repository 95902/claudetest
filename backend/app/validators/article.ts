import vine from '@vinejs/vine'

export const createArticleValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(5).maxLength(255),
    slug: vine.string().trim().minLength(3).maxLength(255),
    content: vine.string().trim().minLength(10),
    excerpt: vine.string().trim().minLength(10).maxLength(500).nullable().optional(),
    sourceUrl: vine.string().url().nullable().optional(),
    author: vine.string().trim().maxLength(255).nullable().optional(),
    publishedAt: vine.date().nullable().optional(),
    imageUrl: vine.string().url().nullable().optional(),
    category: vine.string().trim().maxLength(100).nullable().optional(),
  })
)

export const updateArticleValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(5).maxLength(255).optional(),
    slug: vine.string().trim().minLength(3).maxLength(255).optional(),
    content: vine.string().trim().minLength(10).optional(),
    excerpt: vine.string().trim().minLength(10).maxLength(500).nullable().optional(),
    sourceUrl: vine.string().url().nullable().optional(),
    author: vine.string().trim().maxLength(255).nullable().optional(),
    publishedAt: vine.date().nullable().optional(),
    imageUrl: vine.string().url().nullable().optional(),
    category: vine.string().trim().maxLength(100).nullable().optional(),
  })
)