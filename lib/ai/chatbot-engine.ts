import FallbackAIClient from './fallback-client'
import GroqClient from './groq-client'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'
import Category from '@/models/Category'
import FAQ from '@/models/FAQ'
import ChatbotKnowledge from '@/models/ChatbotKnowledge'

interface ChatContext {
  products: any[]
  categories: any[]
  faqs: any[]
  knowledge: any[]
  userLanguage: string
}

class ChatbotEngine {
  private aiClient: GroqClient | FallbackAIClient
  private context: ChatContext | null = null
  private aiClientInitialized: boolean = false

  constructor() {
    // Initialize with fallback client first, then try to upgrade
    this.aiClient = new FallbackAIClient()
    this.initializeAIClient()
  }

  private async initializeAIClient() {
    if (this.aiClientInitialized) return

    try {
      // Try Groq (cloud) first
      const groqClient = new GroqClient()
      const isGroqAvailable = await groqClient.checkModelAvailability()
      
      if (isGroqAvailable) {
        this.aiClient = groqClient
        console.log('Using Groq (cloud)')
      } else {
        console.log('Groq not available, using Fallback AI')
      }
      
      this.aiClientInitialized = true
    } catch (error) {
      console.warn('AI client initialization failed, using fallback:', error)
      this.aiClientInitialized = true
    }
  }

  async initializeContext(language: string = 'en'): Promise<void> {
    try {
      await connectDB()
      
      const [products, categories, faqs, knowledge] = await Promise.all([
        Product.find({ status: 'active' }).populate('category').limit(50),
        Category.find({ isActive: true }),
        FAQ.find({ isActive: true, language }),
        ChatbotKnowledge.find({ isActive: true, language })
      ])

      this.context = {
        products,
        categories,
        faqs,
        knowledge,
        userLanguage: language
      }
    } catch (error) {
      console.error('Failed to initialize chatbot context:', error)
      throw new Error('Failed to initialize chatbot context')
    }
  }

  private buildSystemPrompt(): string {
    if (!this.context) {
      return "You are a helpful e-commerce assistant."
    }

    const { products, categories, faqs, knowledge, userLanguage } = this.context

    const languageInstructions = {
      'ur-PK': 'اردو میں جواب دیں اور مہذب، مددگار اور دوستانہ انداز اپنائیں۔',
      'ar-SA': 'أجب باللغة العربية وكن مهذباً ومفيداً وودوداً.',
      'es-ES': 'Responde en español y sé cortés, útil y amigable.',
      'fr-FR': 'Répondez en français et soyez poli, utile et amical.',
      'de-DE': 'Antworten Sie auf Deutsch und seien Sie höflich, hilfreich und freundlich.',
      'zh-CN': '用中文回答，要礼貌、有帮助和友好。',
      'ja-JP': '日本語で答え、丁寧で親切で友好的であること。',
      'ko-KR': '한국어로 답변하고 정중하고 도움이 되며 친근하게 대하세요.',
      'en-US': 'Respond in English and be polite, helpful, and friendly.'
    }

    const currentLanguageInstruction = languageInstructions[userLanguage as keyof typeof languageInstructions] || languageInstructions['en-US']

    return `You are an intelligent e-commerce assistant for Jabeen Closet online store. Your role is to help customers with their shopping needs, answer questions, and provide excellent customer service.

LANGUAGE INSTRUCTION: ${currentLanguageInstruction}

STORE INFORMATION:
Categories: ${categories.map(c => `${c.name} (${c.description || 'No description'})`).join(', ')}

Available Products (showing top products):
${products.slice(0, 20).map(p => 
  `- ${p.name}: $${p.price} (Category: ${p.category?.name || 'Unknown'}) - ${p.description.substring(0, 100)}...`
).join('\n')}

FREQUENTLY ASKED QUESTIONS:
${faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')}

STORE POLICIES & KNOWLEDGE:
${knowledge.map(k => `${k.title}: ${k.content}`).join('\n\n')}

INSTRUCTIONS:
1. ALWAYS respond in the same language as the customer's message, if the message is in roman English but clearly Urdu, respond in Urdu and always use Rs. instead of $.
2. For Urdu messages, respond completely in Urdu using proper Urdu grammar and vocabulary
3. Be friendly, helpful, and professional in the customer's preferred language
4. Answer questions about products, prices, availability, and store policies
5. Recommend products based on customer needs and budget
6. If asked about specific products, provide accurate information from the data base
7. For questions not covered in the knowledge base, provide general helpful guidance
8. Always try to be helpful and guide customers toward making informed decisions
9. If you don't know something specific, admit it and suggest contacting customer service
10. Keep responses concise but informative
11. Use culturally appropriate greetings and expressions for each language

URDU SPECIFIC GUIDELINES:
- Use respectful forms like "آپ" instead of "تم"
- Include appropriate Islamic greetings when suitable
- Use proper Urdu business terminology
- Be culturally sensitive to Pakistani customs

Remember: You have access to real-time product and store information. Always provide accurate, up-to-date information based on the data provided and respond in the customer's language.`
  }

  async generateResponse(userMessage: string, conversationHistory: any[] = []): Promise<string> {
    try {
      if (!this.context) {
        await this.initializeContext()
      }

      // Ensure AI client is initialized
      await this.initializeAIClient()

      const systemPrompt = this.buildSystemPrompt()
      
      // Build conversation context
      let conversationContext = ''
      if (conversationHistory.length > 0) {
        conversationContext = '\n\nPrevious conversation:\n' + 
          conversationHistory.slice(-6).map(msg => 
            `${msg.role === 'user' ? 'Customer' : 'Assistant'}: ${msg.content}`
          ).join('\n')
      }

      const fullPrompt = userMessage + conversationContext

      const response = await this.aiClient.generateResponse(fullPrompt, systemPrompt)
      return response
    } catch (error) {
      console.error('Chatbot response generation error:', error)
      return "I apologize, but I'm having trouble processing your request right now. Please try again or contact our customer service team for assistance."
    }
  }

  async generateStreamResponse(userMessage: string, conversationHistory: any[] = []): Promise<AsyncIterable<string>> {
    try {
      if (!this.context) {
        await this.initializeContext()
      }

      // Ensure AI client is initialized
      await this.initializeAIClient()

      const systemPrompt = this.buildSystemPrompt()
      
      // Build conversation context
      let conversationContext = ''
      if (conversationHistory.length > 0) {
        conversationContext = '\n\nPrevious conversation:\n' + 
          conversationHistory.slice(-6).map(msg => 
            `${msg.role === 'user' ? 'Customer' : 'Assistant'}: ${msg.content}`
          ).join('\n')
      }

      const fullPrompt = userMessage + conversationContext

      return await this.aiClient.generateStreamResponse(fullPrompt, systemPrompt)
    } catch (error) {
      console.error('Chatbot streaming response error:', error)
      throw error
    }
  }

  async searchProducts(query: string, limit: number = 10): Promise<any[]> {
    try {
      await connectDB()
      
      const products = await Product.find({
        $and: [
          { status: 'active' },
          {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } },
              { tags: { $in: [new RegExp(query, 'i')] } }
            ]
          }
        ]
      })
      .populate('category')
      .limit(limit)

      return products
    } catch (error) {
      console.error('Product search error:', error)
      return []
    }
  }

  async getProductRecommendations(category?: string, priceRange?: { min: number, max: number }): Promise<any[]> {
    try {
      await connectDB()
      
      let query: any = { status: 'active' }
      
      if (category) {
        const categoryDoc = await Category.findOne({ name: { $regex: category, $options: 'i' } })
        if (categoryDoc) {
          query.category = categoryDoc._id
        }
      }
      
      if (priceRange) {
        query.price = { $gte: priceRange.min, $lte: priceRange.max }
      }

      const products = await Product.find(query)
        .populate('category')
        .sort({ rating: -1, reviewCount: -1 })
        .limit(5)

      return products
    } catch (error) {
      console.error('Product recommendation error:', error)
      return []
    }
  }

  async checkModelAvailability(): Promise<boolean> {
    await this.initializeAIClient()
    return await this.aiClient.checkModelAvailability()
  }

  async pullModel(): Promise<void> {
    // Not needed for new AI clients
    console.log('Model pulling not required for current AI provider')
  }

  setLanguage(language: string): void {
    if (this.context) {
      this.context.userLanguage = language
    }
  }
}

export default ChatbotEngine
