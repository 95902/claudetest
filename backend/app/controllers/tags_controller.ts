import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class TagsController {
  /**
   * Get all tags with usage count
   */
  async index({ response }: HttpContext) {
    const tags = await db
      .from('tags')
      .select('tags.*')
      .leftJoin('taggables', 'tags.id', 'taggables.tag_id')
      .groupBy('tags.id')
      .count('taggables.id as usage_count')
      .orderBy('usage_count', 'desc')

    return response.ok({ data: tags })
  }

  /**
   * Get tags for a specific resource
   */
  async show({ request, response }: HttpContext) {
    const taggableType = request.input('taggableType')
    const taggableId = request.input('taggableId')

    if (!taggableType || !taggableId) {
      return response.badRequest({
        message: 'taggableType and taggableId are required',
      })
    }

    const tags = await db
      .from('tags')
      .innerJoin('taggables', 'tags.id', 'taggables.tag_id')
      .where('taggables.taggable_type', taggableType)
      .where('taggables.taggable_id', taggableId)
      .select('tags.*')

    return response.ok({ data: tags })
  }

  /**
   * Attach tags to a resource (auth required)
   */
  async attach({ request, response, auth }: HttpContext) {
    await auth.authenticate()

    const taggableType = request.input('taggableType')
    const taggableId = request.input('taggableId')
    const tagNames = request.input('tags') as string[]

    if (!taggableType || !taggableId || !Array.isArray(tagNames)) {
      return response.badRequest({
        message: 'taggableType, taggableId, and tags array are required',
      })
    }

    // Create or get existing tags
    const tagIds: number[] = []
    for (const name of tagNames) {
      const [tag] = await db
        .table('tags')
        .insert({ name: name.toLowerCase().trim(), slug: name.toLowerCase().trim() })
        .onConflict('slug')
        .ignore()
        .returning('id')

      if (tag) {
        tagIds.push(tag.id)
      } else {
        // Tag already exists, get its ID
        const existingTag = await db.from('tags').where('slug', name.toLowerCase().trim()).first()
        if (existingTag) {
          tagIds.push(existingTag.id)
        }
      }
    }

    // Attach tags to resource
    const taggables = tagIds.map((tagId) => ({
      tag_id: tagId,
      taggable_type: taggableType,
      taggable_id: taggableId,
    }))

    await db.table('taggables').insert(taggables).onConflict(['tag_id', 'taggable_type', 'taggable_id']).ignore()

    return response.ok({ message: 'Tags attached successfully' })
  }

  /**
   * Detach tags from a resource (auth required)
   */
  async detach({ request, response, auth }: HttpContext) {
    await auth.authenticate()

    const taggableType = request.input('taggableType')
    const taggableId = request.input('taggableId')
    const tagIds = request.input('tagIds') as number[]

    if (!taggableType || !taggableId) {
      return response.badRequest({
        message: 'taggableType and taggableId are required',
      })
    }

    const query = db
      .from('taggables')
      .where('taggable_type', taggableType)
      .where('taggable_id', taggableId)

    if (tagIds && tagIds.length > 0) {
      query.whereIn('tag_id', tagIds)
    }

    await query.delete()

    return response.ok({ message: 'Tags detached successfully' })
  }
}
