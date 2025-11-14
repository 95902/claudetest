import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Tool from '#models/tool'

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
    const normalUser = users[1]

    // Create AI tools
    await Tool.createMany([
      // LLMs & APIs
      {
        name: 'ChatGPT',
        slug: 'chatgpt',
        description:
          'ChatGPT is an advanced conversational AI powered by GPT-4, capable of understanding and generating human-like text. It excels at code assistance, content creation, and problem-solving across various domains.',
        category: 'LLM',
        url: 'https://chat.openai.com',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
        pricing: 'freemium',
        features: [
          'Text generation',
          'Code assistance',
          'Image analysis (GPT-4V)',
          'Web browsing',
          'File uploads',
        ],
        pros: [
          'Very powerful and versatile',
          'Great for coding tasks',
          'Large context window',
          'Regular updates',
        ],
        cons: ['Can be expensive for heavy use', 'Rate limits on free tier', 'Not always factual'],
        userId: adminUser.id,
        averageRating: 4.8,
        ratingsCount: 1247,
        viewsCount: 15234,
      },
      {
        name: 'Claude',
        slug: 'claude',
        description:
          'Claude is an AI assistant by Anthropic with an extended context window of up to 200K tokens. It excels at long-form content analysis, coding, and maintaining coherent conversations over extended interactions.',
        category: 'LLM',
        url: 'https://claude.ai',
        logoUrl: null,
        pricing: 'freemium',
        features: [
          'Extended 200K context window',
          'Code analysis',
          'Document processing',
          'Ethical AI principles',
          'Vision capabilities',
        ],
        pros: [
          'Massive context window',
          'Great for document analysis',
          'Strong safety guardrails',
          'Excellent coding abilities',
        ],
        cons: ['Slower than GPT-4', 'Less widely integrated', 'Can be overly cautious'],
        userId: adminUser.id,
        averageRating: 4.7,
        ratingsCount: 892,
        viewsCount: 12456,
      },
      {
        name: 'Gemini',
        slug: 'gemini',
        description:
          "Google's most capable AI model, Gemini is a multimodal AI that can understand and process text, images, video, audio, and code. It powers Google's AI features across their ecosystem.",
        category: 'LLM',
        url: 'https://gemini.google.com',
        logoUrl: null,
        pricing: 'freemium',
        features: [
          'Multimodal understanding',
          'Google integration',
          'Real-time information',
          'Code execution',
          'Large context window',
        ],
        pros: [
          'Free tier is generous',
          'Great Google Workspace integration',
          'Strong multimodal capabilities',
          'Access to real-time info',
        ],
        cons: ['Privacy concerns', 'Inconsistent quality', 'Less developer-friendly API'],
        userId: normalUser.id,
        averageRating: 4.4,
        ratingsCount: 634,
        viewsCount: 9821,
      },

      // Code Assistants
      {
        name: 'GitHub Copilot',
        slug: 'github-copilot',
        description:
          'AI-powered code completion tool developed by GitHub and OpenAI. It suggests entire lines or blocks of code as you type, learning from billions of lines of public code.',
        category: 'Code Assistant',
        url: 'https://github.com/features/copilot',
        logoUrl: null,
        pricing: 'paid',
        features: [
          'Code suggestions',
          'Multi-language support',
          'IDE integration',
          'Test generation',
          'Code explanation',
        ],
        pros: [
          'Excellent IDE integration',
          'Very accurate suggestions',
          'Supports many languages',
          'Great for boilerplate',
        ],
        cons: ['Subscription required', 'Can suggest outdated patterns', 'Privacy concerns'],
        githubRepo: 'https://github.com/github/copilot-docs',
        userId: adminUser.id,
        averageRating: 4.6,
        ratingsCount: 2103,
        viewsCount: 23456,
      },
      {
        name: 'Cursor',
        slug: 'cursor',
        description:
          'AI-first code editor built on VS Code. Cursor integrates AI deeply into your coding workflow with features like AI chat, codebase understanding, and intelligent refactoring.',
        category: 'Code Assistant',
        url: 'https://cursor.sh',
        logoUrl: null,
        pricing: 'freemium',
        features: [
          'AI chat in editor',
          'Codebase understanding',
          'Multi-file edits',
          'Terminal integration',
          'VS Code compatible',
        ],
        pros: [
          'Best-in-class codebase understanding',
          'Natural language edits',
          'VS Code extensions work',
          'Fast and responsive',
        ],
        cons: ['Relatively new', 'Premium features are expensive', 'Learning curve'],
        userId: adminUser.id,
        averageRating: 4.9,
        ratingsCount: 1567,
        viewsCount: 18932,
      },
      {
        name: 'Cody',
        slug: 'cody',
        description:
          'AI coding assistant by Sourcegraph that understands your entire codebase. Uses context from your code to provide accurate suggestions and answers.',
        category: 'Code Assistant',
        url: 'https://sourcegraph.com/cody',
        logoUrl: null,
        pricing: 'freemium',
        features: [
          'Codebase-aware AI',
          'Multiple LLM support',
          'IDE plugins',
          'Code search integration',
          'Self-hosted option',
        ],
        pros: [
          'Understands large codebases',
          'Works with multiple LLMs',
          'Enterprise-friendly',
          'Good privacy controls',
        ],
        cons: ['Smaller user base', 'Some features require Sourcegraph', 'Less polished UI'],
        githubRepo: 'https://github.com/sourcegraph/cody',
        userId: normalUser.id,
        averageRating: 4.5,
        ratingsCount: 423,
        viewsCount: 5678,
      },

      // Image Generation
      {
        name: 'Midjourney',
        slug: 'midjourney',
        description:
          'State-of-the-art AI image generation tool accessible through Discord. Creates stunning, artistic images from text descriptions with exceptional quality and creativity.',
        category: 'Image Generation',
        url: 'https://www.midjourney.com',
        logoUrl: null,
        pricing: 'paid',
        features: [
          'Text-to-image generation',
          'Style variety',
          'High resolution upscaling',
          'Variations and remixing',
          'Community gallery',
        ],
        pros: [
          'Exceptional image quality',
          'Artistic and creative',
          'Active community',
          'Regular updates',
        ],
        cons: [
          'Discord-only interface',
          'No free tier',
          'Limited commercial rights on basic plan',
          'Public by default',
        ],
        userId: adminUser.id,
        averageRating: 4.8,
        ratingsCount: 3421,
        viewsCount: 34567,
      },
      {
        name: 'DALL-E 3',
        slug: 'dall-e-3',
        description:
          'OpenAI\'s latest image generation model with improved prompt understanding and coherence. Integrated into ChatGPT Plus and available via API.',
        category: 'Image Generation',
        url: 'https://openai.com/dall-e-3',
        logoUrl: null,
        pricing: 'paid',
        features: [
          'Advanced prompt understanding',
          'Text in images',
          'ChatGPT integration',
          'API access',
          'Safety features',
        ],
        pros: [
          'Great prompt adherence',
          'Easy to use via ChatGPT',
          'Good at text rendering',
          'API available',
        ],
        cons: ['Expensive per image', 'Less artistic than Midjourney', 'Content restrictions'],
        userId: adminUser.id,
        averageRating: 4.5,
        ratingsCount: 1876,
        viewsCount: 19234,
      },
      {
        name: 'Stable Diffusion',
        slug: 'stable-diffusion',
        description:
          'Open-source image generation model that can run locally. Offers maximum control and customization through various UIs and extensive community models.',
        category: 'Image Generation',
        url: 'https://stability.ai/stable-diffusion',
        logoUrl: null,
        pricing: 'free',
        features: [
          'Open source',
          'Runs locally',
          'Extensive model library',
          'ControlNet support',
          'LoRA fine-tuning',
        ],
        pros: ['Free and open source', 'Full control', 'Active community', 'No usage limits'],
        cons: ['Requires technical knowledge', 'Needs powerful GPU', 'Setup complexity'],
        githubRepo: 'https://github.com/Stability-AI/stablediffusion',
        userId: normalUser.id,
        averageRating: 4.6,
        ratingsCount: 2134,
        viewsCount: 28901,
      },

      // Frameworks & Libraries
      {
        name: 'LangChain',
        slug: 'langchain',
        description:
          'Comprehensive framework for developing applications powered by language models. Provides modular components for chaining LLM calls, managing prompts, and integrating with various data sources.',
        category: 'Framework',
        url: 'https://langchain.com',
        logoUrl: null,
        pricing: 'free',
        features: [
          'LLM chains',
          'Prompt templates',
          'Memory management',
          'Vector store integration',
          'Agent framework',
        ],
        pros: [
          'Comprehensive toolkit',
          'Active development',
          'Great documentation',
          'Large ecosystem',
        ],
        cons: ['Can be complex', 'Frequent breaking changes', 'Steep learning curve'],
        githubRepo: 'https://github.com/langchain-ai/langchain',
        userId: adminUser.id,
        averageRating: 4.4,
        ratingsCount: 891,
        viewsCount: 12345,
      },
      {
        name: 'LlamaIndex',
        slug: 'llamaindex',
        description:
          'Data framework for building LLM applications with focus on RAG (Retrieval-Augmented Generation). Simplifies connecting LLMs to external data sources.',
        category: 'Framework',
        url: 'https://www.llamaindex.ai',
        logoUrl: null,
        pricing: 'free',
        features: [
          'Data connectors',
          'Index structures',
          'Query engines',
          'RAG pipelines',
          'Evaluation tools',
        ],
        pros: [
          'Excellent for RAG',
          'Easy data integration',
          'Well documented',
          'Production-ready',
        ],
        cons: ['Narrower scope than LangChain', 'Python-focused', 'Resource intensive'],
        githubRepo: 'https://github.com/run-llama/llama_index',
        userId: normalUser.id,
        averageRating: 4.5,
        ratingsCount: 567,
        viewsCount: 8901,
      },

      // Vector Databases
      {
        name: 'Pinecone',
        slug: 'pinecone',
        description:
          'Fully managed vector database designed for machine learning applications. Provides fast similarity search at scale with minimal configuration.',
        category: 'Vector Database',
        url: 'https://www.pinecone.io',
        logoUrl: null,
        pricing: 'freemium',
        features: [
          'Managed service',
          'Real-time updates',
          'Metadata filtering',
          'Hybrid search',
          'High availability',
        ],
        pros: ['Easy to use', 'Scalable', 'Good free tier', 'Reliable performance'],
        cons: ['Can be expensive at scale', 'Vendor lock-in', 'Limited customization'],
        userId: adminUser.id,
        averageRating: 4.3,
        ratingsCount: 432,
        viewsCount: 6789,
      },
      {
        name: 'Weaviate',
        slug: 'weaviate',
        description:
          'Open-source vector database with built-in vectorization modules. Supports multiple vector search algorithms and can be self-hosted or cloud-managed.',
        category: 'Vector Database',
        url: 'https://weaviate.io',
        logoUrl: null,
        pricing: 'freemium',
        features: [
          'Open source',
          'Built-in vectorization',
          'GraphQL API',
          'Multi-tenancy',
          'Hybrid search',
        ],
        pros: ['Open source', 'Flexible deployment', 'Feature-rich', 'Good documentation'],
        cons: ['Setup complexity', 'Smaller community', 'Performance tuning needed'],
        githubRepo: 'https://github.com/weaviate/weaviate',
        userId: normalUser.id,
        averageRating: 4.4,
        ratingsCount: 298,
        viewsCount: 4567,
      },

      // Audio/Voice
      {
        name: 'ElevenLabs',
        slug: 'elevenlabs',
        description:
          'Advanced AI voice generation platform with highly realistic text-to-speech capabilities. Supports voice cloning and multilingual generation.',
        category: 'Audio Generation',
        url: 'https://elevenlabs.io',
        logoUrl: null,
        pricing: 'freemium',
        features: [
          'Text-to-speech',
          'Voice cloning',
          'Multilingual support',
          'API access',
          'Voice library',
        ],
        pros: [
          'Exceptional voice quality',
          'Natural sounding',
          'Easy to use',
          'Great for content creation',
        ],
        cons: ['Can be expensive', 'Ethical concerns with cloning', 'Limited free tier'],
        userId: adminUser.id,
        averageRating: 4.7,
        ratingsCount: 1234,
        viewsCount: 15678,
      },

      // Video Generation
      {
        name: 'Runway',
        slug: 'runway',
        description:
          'AI-powered creative suite for video editing and generation. Offers tools for video generation, editing, and special effects powered by AI.',
        category: 'Video Generation',
        url: 'https://runwayml.com',
        logoUrl: null,
        pricing: 'freemium',
        features: [
          'Text-to-video',
          'Video editing',
          'Green screen removal',
          'Motion tracking',
          'Style transfer',
        ],
        pros: ['Powerful video tools', 'User-friendly interface', 'Regular updates', 'Creative'],
        cons: ['Credit system can be limiting', 'Export quality on free tier', 'Learning curve'],
        userId: normalUser.id,
        averageRating: 4.5,
        ratingsCount: 876,
        viewsCount: 11234,
      },

      // No-Code Platforms
      {
        name: 'Zapier AI',
        slug: 'zapier-ai',
        description:
          'Automation platform enhanced with AI capabilities. Allows you to build AI-powered workflows without code, connecting thousands of apps.',
        category: 'No-Code Platform',
        url: 'https://zapier.com',
        logoUrl: null,
        pricing: 'freemium',
        features: [
          'AI automation',
          '5000+ app integrations',
          'Natural language workflows',
          'Chatbot builder',
          'Data transformation',
        ],
        pros: [
          'Huge app ecosystem',
          'Easy to use',
          'Reliable',
          'Good documentation',
        ],
        cons: [
          'Can get expensive',
          'Complex workflows need paid plan',
          'AI features still limited',
        ],
        userId: adminUser.id,
        averageRating: 4.4,
        ratingsCount: 2345,
        viewsCount: 23456,
      },
    ])

    console.log('✅ Database seeded successfully!')
    console.log('👤 Test Users:')
    console.log('   - Admin: admin@aitools.com / Admin123!')
    console.log('   - User: john@example.com / User123!')
    console.log(`🛠️  Created ${await Tool.query().count('* as total').first()} tools`)
  }
}
