import type { HttpContext } from '@adonisjs/core/http'
import AiModel from '#models/ai_model'
import { createAiModelValidator, updateAiModelValidator } from '#validators/ai_model'

export default class AiModelsController {
  /**
   * Get all AI models with pagination and filters
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 12)
    const provider = request.input('provider')
    const modelType = request.input('modelType')
    const status = request.input('status', 'active')
    const search = request.input('search')

    const query = AiModel.query()

    if (provider) {
      query.where('provider', provider)
    }

    if (modelType) {
      query.where('model_type', modelType)
    }

    if (status) {
      query.where('status', status)
    }

    if (search) {
      query.where((subQuery) => {
        subQuery.whereILike('name', `%${search}%`).orWhereILike('provider', `%${search}%`)
      })
    }

    query.orderBy('release_date', 'desc')

    const models = await query.paginate(page, limit)

    return response.ok({
      data: models.all(),
      meta: models.getMeta(),
    })
  }

  /**
   * Get single AI model by ID
   */
  async show({ params, response }: HttpContext) {
    const model = await AiModel.findOrFail(params.id)
    return response.ok({ data: model })
  }

  /**
   * Create new AI model (auth required, admin only)
   */
  async store({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()

    // Only admins can create AI models
    if (user.role !== 'admin') {
      return response.forbidden({
        message: 'Only administrators can create AI models',
      })
    }

    const data = await request.validateUsing(createAiModelValidator)

    const model = await AiModel.create({
      ...data,
      status: data.status || 'active',
    })

    return response.created({ data: model })
  }

  /**
   * Update AI model (admin only)
   */
  async update({ request, response, auth, params }: HttpContext) {
    const user = await auth.authenticate()

    // Only admins can update AI models
    if (user.role !== 'admin') {
      return response.forbidden({
        message: 'Only administrators can update AI models',
      })
    }

    const model = await AiModel.findOrFail(params.id)
    const data = await request.validateUsing(updateAiModelValidator)

    model.merge(data)
    await model.save()

    return response.ok({ data: model })
  }

  /**
   * Delete AI model (admin only)
   */
  async destroy({ response, auth, params }: HttpContext) {
    const user = await auth.authenticate()

    // Only admins can delete AI models
    if (user.role !== 'admin') {
      return response.forbidden({
        message: 'Only administrators can delete AI models',
      })
    }

    const model = await AiModel.findOrFail(params.id)
    await model.delete()

    return response.noContent()
  }
}
