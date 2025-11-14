import type { HttpContext } from '@adonisjs/core/http'
import Tool from '#models/tool'
import { createToolValidator, updateToolValidator } from '#validators/tool_validator'
import string from '@adonisjs/core/helpers/string'

export default class ToolsController {
  /**
   * Get list of tools with pagination and filters
   * GET /api/tools
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const category = request.input('category')
    const pricing = request.input('pricing')
    const search = request.input('search')
    const sortBy = request.input('sortBy', 'createdAt') // createdAt, name, averageRating, viewsCount
    const sortOrder = request.input('sortOrder', 'desc') // asc, desc

    const query = Tool.query().preload('user')

    // Apply filters
    if (category) {
      query.where('category', category)
    }

    if (pricing) {
      query.where('pricing', pricing)
    }

    // Search in name, description
    if (search) {
      query.where((builder) => {
        builder.whereILike('name', `%${search}%`).orWhereILike('description', `%${search}%`)
      })
    }

    // Apply sorting
    const validSortFields = ['createdAt', 'name', 'averageRating', 'viewsCount']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt'
    query.orderBy(sortField, sortOrder === 'asc' ? 'asc' : 'desc')

    // Paginate
    const tools = await query.paginate(page, limit)

    return response.ok({
      data: tools.all(),
      meta: tools.getMeta(),
    })
  }

  /**
   * Get single tool by ID or slug
   * GET /api/tools/:id
   */
  async show({ params, response }: HttpContext) {
    try {
      let tool: Tool

      // Check if param is a number (ID) or string (slug)
      if (isNaN(Number(params.id))) {
        tool = await Tool.query().where('slug', params.id).preload('user').firstOrFail()
      } else {
        tool = await Tool.query().where('id', params.id).preload('user').firstOrFail()
      }

      // Increment view count
      tool.viewsCount += 1
      await tool.save()

      return response.ok({
        data: tool,
      })
    } catch (error) {
      return response.notFound({
        message: 'Tool not found',
      })
    }
  }

  /**
   * Create a new tool
   * POST /api/tools
   */
  async store({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()

      // Validate request data
      const data = await request.validateUsing(createToolValidator)

      // Generate slug from name
      const slug = string.slug(data.name, { lower: true })

      // Check if slug already exists
      const existingTool = await Tool.query().where('slug', slug).first()
      if (existingTool) {
        return response.conflict({
          message: 'A tool with this name already exists',
        })
      }

      // Create tool
      const tool = await Tool.create({
        name: data.name,
        slug,
        description: data.description,
        category: data.category,
        url: data.url,
        logoUrl: data.logoUrl || null,
        pricing: data.pricing,
        features: data.features || null,
        pros: data.pros || null,
        cons: data.cons || null,
        githubRepo: data.githubRepo || null,
        userId: user.id,
        averageRating: 0,
        ratingsCount: 0,
        viewsCount: 0,
      })

      await tool.load('user')

      return response.created({
        message: 'Tool created successfully',
        data: tool,
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
   * Update a tool
   * PUT /api/tools/:id
   */
  async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()

      // Find tool
      const tool = await Tool.findOrFail(params.id)

      // Check permissions (only owner or admin can update)
      if (tool.userId !== user.id && user.role !== 'admin') {
        return response.forbidden({
          message: 'You do not have permission to update this tool',
        })
      }

      // Validate request data
      const data = await request.validateUsing(updateToolValidator)

      // Update slug if name changed
      if (data.name && data.name !== tool.name) {
        const newSlug = string.slug(data.name, { lower: true })

        // Check if new slug already exists
        const existingTool = await Tool.query()
          .where('slug', newSlug)
          .whereNot('id', tool.id)
          .first()

        if (existingTool) {
          return response.conflict({
            message: 'A tool with this name already exists',
          })
        }

        tool.slug = newSlug
      }

      // Update fields
      if (data.name !== undefined) tool.name = data.name
      if (data.description !== undefined) tool.description = data.description
      if (data.category !== undefined) tool.category = data.category
      if (data.url !== undefined) tool.url = data.url
      if (data.logoUrl !== undefined) tool.logoUrl = data.logoUrl
      if (data.pricing !== undefined) tool.pricing = data.pricing
      if (data.features !== undefined) tool.features = data.features
      if (data.pros !== undefined) tool.pros = data.pros
      if (data.cons !== undefined) tool.cons = data.cons
      if (data.githubRepo !== undefined) tool.githubRepo = data.githubRepo

      await tool.save()
      await tool.load('user')

      return response.ok({
        message: 'Tool updated successfully',
        data: tool,
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: 'Validation failed',
          errors: error.messages,
        })
      }

      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: 'Tool not found',
        })
      }

      throw error
    }
  }

  /**
   * Delete a tool
   * DELETE /api/tools/:id
   */
  async destroy({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()

      // Find tool
      const tool = await Tool.findOrFail(params.id)

      // Check permissions (only owner or admin can delete)
      if (tool.userId !== user.id && user.role !== 'admin') {
        return response.forbidden({
          message: 'You do not have permission to delete this tool',
        })
      }

      await tool.delete()

      return response.ok({
        message: 'Tool deleted successfully',
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: 'Tool not found',
        })
      }

      throw error
    }
  }

  /**
   * Search tools with full-text search
   * GET /api/tools/search
   */
  async search({ request, response }: HttpContext) {
    const query = request.input('q', '')
    const limit = request.input('limit', 10)

    if (!query) {
      return response.badRequest({
        message: 'Search query is required',
      })
    }

    const tools = await Tool.query()
      .where((builder) => {
        builder
          .whereILike('name', `%${query}%`)
          .orWhereILike('description', `%${query}%`)
          .orWhereILike('category', `%${query}%`)
      })
      .limit(limit)
      .orderBy('viewsCount', 'desc')

    return response.ok({
      data: tools,
    })
  }
}
