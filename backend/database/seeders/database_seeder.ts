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

    // Create Articles
    await Article.createMany([
      {
        title: 'The Rise of Multimodal AI: How GPT-4V is Changing Everything',
        slug: 'rise-of-multimodal-ai-gpt4v',
        content:
          'The introduction of GPT-4V (Vision) marks a significant milestone in AI development. This multimodal model can process both text and images, opening up new possibilities for AI applications...',
        excerpt:
          'GPT-4V brings vision capabilities to language models, enabling new use cases from image analysis to visual question answering.',
        sourceUrl: 'https://openai.com/research/gpt-4v',
        author: 'OpenAI Research Team',
        publishedAt: DateTime.now().minus({ days: 5 }),
        imageUrl: null,
        category: 'Research',
        userId: adminUser.id,
        viewsCount: 1234,
      },
      {
        title: 'Best Practices for Building RAG Applications in 2024',
        slug: 'best-practices-rag-applications-2024',
        content:
          'Retrieval-Augmented Generation (RAG) has become essential for building production-grade LLM applications. This guide covers the latest best practices including chunking strategies, embedding models selection, and retrieval optimization...',
        excerpt:
          'Learn how to build robust RAG applications with proper chunking, embeddings, and retrieval strategies.',
        sourceUrl: null,
        author: 'AI Engineering Team',
        publishedAt: DateTime.now().minus({ days: 12 }),
        imageUrl: null,
        category: 'Tutorial',
        userId: adminUser.id,
        viewsCount: 3421,
      },
      {
        title: 'Claude 3 Opus vs GPT-4: A Comprehensive Comparison',
        slug: 'claude-3-opus-vs-gpt4-comparison',
        content:
          'With the release of Claude 3 Opus, Anthropic has positioned itself as a serious competitor to OpenAI. We tested both models across various tasks including coding, reasoning, and creative writing...',
        excerpt:
          'An in-depth comparison of Claude 3 Opus and GPT-4 across multiple dimensions.',
        sourceUrl: null,
        author: 'John Doe',
        publishedAt: DateTime.now().minus({ days: 20 }),
        imageUrl: null,
        category: 'Comparison',
        userId: normalUser.id,
        viewsCount: 5678,
      },
      {
        title: 'Open Source LLMs: A Complete Guide for 2024',
        slug: 'open-source-llms-guide-2024',
        content:
          'The open-source LLM ecosystem has exploded in 2024. From Llama 3 to Mistral, developers now have access to powerful models they can run locally. This guide covers everything you need to know...',
        excerpt:
          'Explore the best open-source LLMs available today and learn how to use them effectively.',
        sourceUrl: null,
        author: 'AI Engineering Team',
        publishedAt: DateTime.now().minus({ days: 8 }),
        imageUrl: null,
        category: 'Guide',
        userId: adminUser.id,
        viewsCount: 2890,
      },
      {
        title: 'The Ethics of AI Voice Cloning: What Developers Need to Know',
        slug: 'ethics-ai-voice-cloning',
        content:
          'As AI voice cloning becomes more accessible through platforms like ElevenLabs, ethical concerns have come to the forefront. This article explores the implications and best practices...',
        excerpt:
          'Understanding the ethical implications of AI voice cloning technology and responsible usage.',
        sourceUrl: null,
        author: 'Ethics Committee',
        publishedAt: DateTime.now().minus({ days: 15 }),
        imageUrl: null,
        category: 'Ethics',
        userId: normalUser.id,
        viewsCount: 1567,
      },
    ])

    // Create AI Models
    await AiModel.createMany([
      {
        name: 'GPT-4 Turbo',
        provider: 'OpenAI',
        version: '1106-preview',
        modelType: 'LLM',
        contextWindow: 128000,
        parametersCount: 'Unknown (rumored ~1.7T)',
        pricing: {
          input: '$0.01 per 1K tokens',
          output: '$0.03 per 1K tokens',
        },
        capabilities: {
          text: true,
          code: true,
          vision: true,
          functionCalling: true,
          json: true,
        },
        benchmarkScores: {
          mmlu: 86.4,
          humanEval: 67.0,
          gsm8k: 92.0,
        },
        releaseDate: DateTime.fromISO('2023-11-06'),
        documentationUrl: 'https://platform.openai.com/docs/models/gpt-4-turbo',
        status: 'active',
      },
      {
        name: 'Claude 3 Opus',
        provider: 'Anthropic',
        version: '20240229',
        modelType: 'LLM',
        contextWindow: 200000,
        parametersCount: 'Unknown',
        pricing: {
          input: '$0.015 per 1K tokens',
          output: '$0.075 per 1K tokens',
        },
        capabilities: {
          text: true,
          code: true,
          vision: true,
          analysis: true,
        },
        benchmarkScores: {
          mmlu: 86.8,
          humanEval: 84.9,
          gsm8k: 95.0,
        },
        releaseDate: DateTime.fromISO('2024-03-04'),
        documentationUrl: 'https://docs.anthropic.com/claude/docs',
        status: 'active',
      },
      {
        name: 'Gemini 1.5 Pro',
        provider: 'Google',
        version: '1.5',
        modelType: 'LLM',
        contextWindow: 1000000,
        parametersCount: 'Unknown',
        pricing: {
          input: '$0.0035 per 1K tokens',
          output: '$0.0105 per 1K tokens',
        },
        capabilities: {
          text: true,
          code: true,
          vision: true,
          audio: true,
          video: true,
        },
        benchmarkScores: {
          mmlu: 85.9,
          humanEval: 71.9,
          gsm8k: 91.7,
        },
        releaseDate: DateTime.fromISO('2024-02-15'),
        documentationUrl: 'https://ai.google.dev/docs',
        status: 'active',
      },
      {
        name: 'Llama 3 70B',
        provider: 'Meta',
        version: '3.0',
        modelType: 'LLM',
        contextWindow: 8192,
        parametersCount: '70B',
        pricing: {
          note: 'Open source - free to use',
        },
        capabilities: {
          text: true,
          code: true,
          reasoning: true,
        },
        benchmarkScores: {
          mmlu: 79.5,
          humanEval: 81.7,
          gsm8k: 93.0,
        },
        releaseDate: DateTime.fromISO('2024-04-18'),
        documentationUrl: 'https://llama.meta.com/docs/',
        status: 'active',
      },
      {
        name: 'Mistral Large',
        provider: 'Mistral AI',
        version: '1.0',
        modelType: 'LLM',
        contextWindow: 32000,
        parametersCount: 'Unknown',
        pricing: {
          input: '$0.008 per 1K tokens',
          output: '$0.024 per 1K tokens',
        },
        capabilities: {
          text: true,
          code: true,
          reasoning: true,
          functionCalling: true,
        },
        benchmarkScores: {
          mmlu: 81.2,
          humanEval: 45.1,
          gsm8k: 78.0,
        },
        releaseDate: DateTime.fromISO('2024-02-26'),
        documentationUrl: 'https://docs.mistral.ai/',
        status: 'active',
      },
    ])

    console.log('✅ Database seeded successfully!')
    console.log('👤 Test Users:')
    console.log('   - Admin: admin@aitools.com / Admin123!')
    console.log('   - User: john@example.com / User123!')
    console.log(`🛠️  Created ${(await Tool.query().count('* as total').first())?.total} tools`)
    console.log(`📰 Created ${(await Article.query().count('* as total').first())?.total} articles`)
    console.log(`🤖 Created ${(await AiModel.query().count('* as total').first())?.total} AI models`)
  }
}
