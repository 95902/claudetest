import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Tool from '#models/tool'
import Article from '#models/article'
import AiModel from '#models/ai_model'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    // Create test users
    const users = await User.createMany([
      {
        username: 'admin',
        email: 'admin@aitools.com',
        password: 'Admin123!',
        fullName: 'Admin User',
        role: 'admin',
      },
      {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'User123!',
        fullName: 'John Doe',
        role: 'user',
      },
    ])

    const adminUser = users[0]

    // Create AI tools (simplified without complex fields for now)
    const tools = await Tool.createMany([
      {
        name: 'ChatGPT',
        slug: 'chatgpt',
        description: 'ChatGPT is an advanced conversational AI powered by GPT-4, capable of understanding and generating human-like text.',
        category: 'LLM',
        url: 'https://chat.openai.com',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
        pricing: 'freemium',
        userId: adminUser.id,
        averageRating: 4.8,
        ratingsCount: 1247,
        viewsCount: 15234,
      },
      {
        name: 'Claude',
        slug: 'claude',
        description: 'Claude is an AI assistant by Anthropic with an extended context window of up to 200K tokens.',
        category: 'LLM',
        url: 'https://claude.ai',
        pricing: 'freemium',
        userId: adminUser.id,
        averageRating: 4.7,
        ratingsCount: 892,
        viewsCount: 12456,
      },
      {
        name: 'Gemini',
        slug: 'gemini',
        description: "Google's most capable AI model, a multimodal AI that can understand text, images, video, and code.",
        category: 'LLM',
        url: 'https://gemini.google.com',
        pricing: 'freemium',
        userId: adminUser.id,
        averageRating: 4.6,
        ratingsCount: 734,
        viewsCount: 9876,
      },
      {
        name: 'Midjourney',
        slug: 'midjourney',
        description: 'Midjourney is a powerful AI image generation tool that creates stunning artwork from text prompts.',
        category: 'Image Generation',
        url: 'https://midjourney.com',
        pricing: 'paid',
        userId: adminUser.id,
        averageRating: 4.9,
        ratingsCount: 2134,
        viewsCount: 18765,
      },
      {
        name: 'GitHub Copilot',
        slug: 'github-copilot',
        description: 'GitHub Copilot is an AI pair programmer that helps you write code faster with intelligent suggestions.',
        category: 'Code Assistant',
        url: 'https://github.com/features/copilot',
        pricing: 'paid',
        githubRepo: 'github/copilot',
        userId: adminUser.id,
        averageRating: 4.5,
        ratingsCount: 1567,
        viewsCount: 14321,
      },
    ])

    // Create articles
    const articles = await Article.createMany([
      {
        title: 'Getting Started with Large Language Models',
        slug: 'getting-started-with-llms',
        excerpt: 'A comprehensive guide to understanding and using LLMs in your projects.',
        content: '# Getting Started with LLMs\n\nLarge Language Models have revolutionized AI...',
        category: 'Tutorials',
        userId: adminUser.id,
        viewsCount: 3456,
      },
      {
        title: 'Comparing GPT-4 vs Claude vs Gemini',
        slug: 'gpt4-vs-claude-vs-gemini',
        excerpt: 'An in-depth comparison of the top 3 LLMs in 2024.',
        content: '# LLM Comparison\n\nLet\'s compare the leading AI models...',
        category: 'Reviews',
        userId: adminUser.id,
        viewsCount: 5432,
      },
      {
        title: 'Best Practices for AI Image Generation',
        slug: 'ai-image-generation-best-practices',
        excerpt: 'Tips and tricks for creating amazing AI-generated artwork.',
        content: '# AI Image Generation Guide\n\nCreating great AI art requires understanding prompts...',
        category: 'Guides',
        userId: adminUser.id,
        viewsCount: 4231,
      },
    ])

    // Create AI models
    const aiModels = await AiModel.createMany([
      {
        name: 'GPT-4',
        provider: 'OpenAI',
        version: 'turbo',
        modelType: 'LLM',
        contextWindow: 128000,
        parametersCount: 'Unknown',
        status: 'active',
        releaseDate: DateTime.fromISO('2023-03-14'),
        documentationUrl: 'https://platform.openai.com/docs/models/gpt-4',
      },
      {
        name: 'Claude 3 Opus',
        provider: 'Anthropic',
        version: '3',
        modelType: 'LLM',
        contextWindow: 200000,
        parametersCount: 'Unknown',
        status: 'active',
        releaseDate: DateTime.fromISO('2024-03-04'),
        documentationUrl: 'https://docs.anthropic.com/claude/docs',
      },
      {
        name: 'Gemini Pro',
        provider: 'Google',
        version: '1.5',
        modelType: 'Multimodal',
        contextWindow: 1000000,
        parametersCount: 'Unknown',
        status: 'active',
        releaseDate: DateTime.fromISO('2024-02-15'),
        documentationUrl: 'https://ai.google.dev/docs',
      },
      {
        name: 'DALL-E 3',
        provider: 'OpenAI',
        version: '3',
        modelType: 'Image',
        status: 'active',
        releaseDate: DateTime.fromISO('2023-10-01'),
        documentationUrl: 'https://platform.openai.com/docs/guides/images',
      },
      {
        name: 'Stable Diffusion XL',
        provider: 'Stability AI',
        version: '1.0',
        modelType: 'Image',
        status: 'active',
        releaseDate: DateTime.fromISO('2023-07-26'),
        documentationUrl: 'https://stability.ai/stablediffusion',
      },
    ])

    console.log('✅ Database seeded successfully!')
    console.log('👤 Test Users:')
    console.log('   - Admin: admin@aitools.com / Admin123!')
    console.log('   - User: john@example.com / User123!')
    console.log(`🛠️  Created ${tools.length} tools`)
    console.log(`📰 Created ${articles.length} articles`)
    console.log(`🤖 Created ${aiModels.length} AI models`)
  }
}
