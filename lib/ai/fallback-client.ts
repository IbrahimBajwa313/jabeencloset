// Fallback AI Client - Works without any external APIs
class FallbackAIClient {
  private responses: { [key: string]: string[] }

  constructor() {
    this.responses = {
      // English responses
      'en': [
        "Thank you for your message! I'm here to help you with your shopping needs at Jabeen Closet.",
        "I'd be happy to assist you with product information, shipping details, or any questions about our store.",
        "Welcome to Jabeen Closet! How can I help you find the perfect products today?",
        "I'm your AI shopping assistant. Feel free to ask about our products, prices, or store policies.",
        "Great question! Let me help you with that. You can browse our categories or ask about specific items."
      ],
      // Urdu responses
      'ur': [
        "آپ کے پیغام کا شکریہ! میں جبین کلاسٹ میں آپ کی خریداری میں مدد کے لیے حاضر ہوں۔",
        "میں آپ کو پروڈکٹ کی معلومات، شپنگ کی تفصیلات، یا ہمارے اسٹور کے بارے میں کسی بھی سوال میں مدد کرنے میں خوش ہوں گا۔",
        "جبین کلاسٹ میں خوش آمدید! آج میں آپ کو بہترین پروڈکٹس تلاش کرنے میں کیسے مدد کر سکتا ہوں؟",
        "میں آپ کا AI شاپنگ اسسٹنٹ ہوں۔ ہمارے پروڈکٹس، قیمتوں، یا اسٹور کی پالیسیوں کے بارے میں بے جھجک پوچھیں۔",
        "بہترین سوال! میں اس میں آپ کی مدد کرتا ہوں۔ آپ ہماری کیٹگریز دیکھ سکتے ہیں یا مخصوص اشیاء کے بارے میں پوچھ سکتے ہیں۔"
      ],
      // Arabic responses
      'ar': [
        "شكراً لرسالتك! أنا هنا لمساعدتك في احتياجات التسوق في جبين كلوسيت.",
        "سأكون سعيداً لمساعدتك في معلومات المنتجات أو تفاصيل الشحن أو أي أسئلة حول متجرنا.",
        "أهلاً بك في جبين كلوسيت! كيف يمكنني مساعدتك في العثور على المنتجات المثالية اليوم؟"
      ]
    }
  }

  async generateResponse(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      // Detect language
      const language = this.detectLanguage(prompt)
      
      // Get appropriate responses for the language
      const languageResponses = this.responses[language] || this.responses['en']
      
      // Simple keyword-based responses
      const lowerPrompt = prompt.toLowerCase()
      
      // Shipping related
      if (this.containsKeywords(lowerPrompt, ['ship', 'delivery', 'شپنگ', 'ڈیلیوری', 'شحن'])) {
        if (language === 'ur') {
          return "ہم مختلف شپنگ آپشنز فراہم کرتے ہیں: معیاری شپنگ (5-7 دن) $5.99، ایکسپریس (2-3 دن) $12.99، اور راتوں رات $24.99۔ $50 سے زیادہ کے آرڈرز پر مفت شپنگ!"
        }
        return "We offer multiple shipping options: Standard (5-7 days) $5.99, Express (2-3 days) $12.99, and Overnight $24.99. Free shipping on orders over $50!"
      }
      
      // Return policy
      if (this.containsKeywords(lowerPrompt, ['return', 'refund', 'واپسی', 'رقم واپسی', 'إرجاع'])) {
        if (language === 'ur') {
          return "ہماری واپسی کی پالیسی: 30 دن کے اندر واپسی، اصل حالت میں ٹیگز کے ساتھ۔ خراب اشیاء کے لیے مفت واپسی شپنگ۔"
        }
        return "Our return policy: 30-day returns in original condition with tags. Free return shipping for defective items."
      }
      
      // Products
      if (this.containsKeywords(lowerPrompt, ['product', 'item', 'پروڈکٹ', 'سامان', 'منتج'])) {
        if (language === 'ur') {
          return "ہمارے پاس مختلف کیٹگریز میں بہترین پروڈکٹس ہیں۔ آپ کس قسم کی چیز تلاش کر رہے ہیں؟ کپڑے، الیکٹرانکس، یا کچھ اور؟"
        }
        return "We have amazing products across various categories. What type of items are you looking for? Clothing, electronics, or something else?"
      }
      
      // Price
      if (this.containsKeywords(lowerPrompt, ['price', 'cost', 'قیمت', 'رقم', 'سعر'])) {
        if (language === 'ur') {
          return "ہمارے پاس مختلف بجٹ کے لیے پروڈکٹس ہیں۔ آپ کا بجٹ کیا ہے؟ میں آپ کو بہترین آپشنز تجویز کر سکتا ہوں۔"
        }
        return "We have products for various budgets. What's your price range? I can suggest the best options for you."
      }
      
      // Greeting
      if (this.containsKeywords(lowerPrompt, ['hello', 'hi', 'سلام', 'ہیلو', 'مرحبا'])) {
        if (language === 'ur') {
          return "السلام علیکم! جبین کلاسٹ میں خوش آمدید۔ میں آپ کا AI شاپنگ اسسٹنٹ ہوں۔ آج میں آپ کی کیسے مدد کر سکتا ہوں؟"
        }
        return "Hello! Welcome to Jabeen Closet. I'm your AI shopping assistant. How can I help you today?"
      }
      
      // Default response
      const randomIndex = Math.floor(Math.random() * languageResponses.length)
      return languageResponses[randomIndex]
      
    } catch (error) {
      console.error('Fallback AI error:', error)
      return "I'm here to help! Please let me know what you're looking for."
    }
  }

  async generateStreamResponse(prompt: string, systemPrompt?: string): Promise<AsyncIterable<string>> {
    const response = await this.generateResponse(prompt, systemPrompt)
    return this.createAsyncIterable(response)
  }

  private async* createAsyncIterable(text: string): AsyncIterable<string> {
    const words = text.split(' ')
    for (let i = 0; i < words.length; i += 2) {
      const chunk = words.slice(i, i + 2).join(' ') + ' '
      yield chunk
      await new Promise(resolve => setTimeout(resolve, 50))
    }
  }

  private detectLanguage(text: string): string {
    const urduPattern = /[\u0600-\u06FF\u0750-\u077F]/
    const arabicWords = ['السلام', 'عليكم', 'شكرا', 'مرحبا']
    const urduWords = ['آپ', 'میں', 'ہے', 'سلام', 'شکریہ']
    
    if (urduPattern.test(text)) {
      const hasUrduWords = urduWords.some(word => text.includes(word))
      const hasArabicWords = arabicWords.some(word => text.includes(word))
      
      if (hasUrduWords || !hasArabicWords) {
        return 'ur'
      }
      return 'ar'
    }
    
    return 'en'
  }

  private containsKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword))
  }

  async checkModelAvailability(): Promise<boolean> {
    return true // Always available
  }

  setModel(model: string): void {
    // No-op for fallback
  }

  getModel(): string {
    return 'fallback-ai'
  }
}

export default FallbackAIClient
