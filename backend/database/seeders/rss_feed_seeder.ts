import { BaseSeeder } from '@adonisjs/lucid/seeders'
import RssFeed from '#models/rss_feed'

export default class extends BaseSeeder {
  async run() {
    // Seed AI company RSS feeds
    await RssFeed.updateOrCreateMany('url', [
      // === Tech Companies - AI Model Developers ===
      {
        name: 'OpenAI Blog',
        url: 'https://openai.com/blog/rss/',
        category: 'Tech Company',
        description: 'Official blog from OpenAI - creators of GPT, DALL-E, Whisper, and more',
        language: 'en',
        isActive: true,
        iconUrl: 'https://openai.com/favicon.ico',
      },
      {
        name: 'Anthropic News',
        url: 'https://www.anthropic.com/news/rss',
        category: 'Tech Company',
        description: 'Latest news from Anthropic - creators of Claude AI',
        language: 'en',
        isActive: true,
        iconUrl: 'https://www.anthropic.com/favicon.ico',
      },
      {
        name: 'Google AI Blog',
        url: 'https://ai.googleblog.com/feeds/posts/default',
        category: 'Tech Company',
        description: 'Research and updates from Google AI - Gemini, PaLM, and more',
        language: 'en',
        isActive: true,
        iconUrl: 'https://www.google.com/favicon.ico',
      },
      {
        name: 'DeepMind',
        url: 'https://deepmind.google/blog/rss.xml',
        category: 'Tech Company',
        description: 'DeepMind research and breakthroughs in AI',
        language: 'en',
        isActive: true,
        iconUrl: 'https://deepmind.google/favicon.ico',
      },
      {
        name: 'Microsoft AI Blog',
        url: 'https://blogs.microsoft.com/ai/feed/',
        category: 'Tech Company',
        description: 'AI innovations and news from Microsoft',
        language: 'en',
        isActive: true,
        iconUrl: 'https://blogs.microsoft.com/favicon.ico',
      },
      {
        name: 'Meta AI Blog',
        url: 'https://ai.meta.com/blog/rss/',
        category: 'Tech Company',
        description: 'AI research from Meta - Llama, SAM, and more',
        language: 'en',
        isActive: true,
        iconUrl: 'https://ai.meta.com/favicon.ico',
      },
      {
        name: 'Mistral AI Blog',
        url: 'https://mistral.ai/news/rss/',
        category: 'Tech Company',
        description: 'News and updates from Mistral AI',
        language: 'en',
        isActive: true,
        iconUrl: 'https://mistral.ai/favicon.ico',
      },
      {
        name: 'Cohere Blog',
        url: 'https://cohere.com/blog/rss.xml',
        category: 'Tech Company',
        description: 'Enterprise AI platform updates from Cohere',
        language: 'en',
        isActive: true,
        iconUrl: 'https://cohere.com/favicon.ico',
      },
      {
        name: 'Stability AI Blog',
        url: 'https://stability.ai/blog/rss',
        category: 'Tech Company',
        description: 'Latest from Stability AI - Stable Diffusion and more',
        language: 'en',
        isActive: true,
        iconUrl: 'https://stability.ai/favicon.ico',
      },

      // === French Tech Media ===
      {
        name: 'Actu IA',
        url: 'https://www.actuia.com/feed/',
        category: 'French Media',
        description: "L'actualité de l'intelligence artificielle en français",
        language: 'fr',
        isActive: true,
        iconUrl: 'https://www.actuia.com/favicon.ico',
      },
      {
        name: '01net - Intelligence Artificielle',
        url: 'https://www.01net.com/feed/',
        category: 'French Media',
        description: 'Actualités tech et IA de 01net',
        language: 'fr',
        isActive: true,
        iconUrl: 'https://www.01net.com/favicon.ico',
      },
      {
        name: 'Blog du Modérateur',
        url: 'https://www.blogdumoderateur.com/feed/',
        category: 'French Media',
        description: 'Actualités web, social media et IA',
        language: 'fr',
        isActive: true,
        iconUrl: 'https://www.blogdumoderateur.com/favicon.ico',
      },
      {
        name: 'Clubic IA',
        url: 'https://www.clubic.com/feed/',
        category: 'French Media',
        description: 'News tech et intelligence artificielle par Clubic',
        language: 'fr',
        isActive: true,
        iconUrl: 'https://www.clubic.com/favicon.ico',
      },
    ])

    const feedsCount = await RssFeed.query().count('* as total').first()
    console.log(`✅ RSS Feeds seeded successfully!`)
    console.log(`📡 Total feeds: ${feedsCount?.$extras.total || 0}`)
    console.log(`   - Tech Companies: 9 (OpenAI, Anthropic, Google AI, DeepMind, Microsoft, Meta, Mistral, Cohere, Stability AI)`)
    console.log(`   - French Media: 4 (Actu IA, 01net, Blog du Modérateur, Clubic)`)
  }
}
