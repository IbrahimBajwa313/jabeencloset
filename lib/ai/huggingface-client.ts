// Free Hugging Face Inference API Client - No installation required
class HuggingFaceClient {
  private apiKey: string
  private model: string
  private baseUrl: string

  constructor(apiKey?: string, model: string = 'microsoft/DialoGPT-medium') {
    this.apiKey = apiKey || process.env.HUGGINGFACE_API_KEY || ''
    this.model = model
    this.baseUrl = 'https://api-inference.huggingface.co/models'
  }

  async generateResponse(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      // Combine system prompt and user prompt
      const fullPrompt = systemPrompt 
        ? `${systemPrompt}\n\nUser: ${prompt}\nAssistant:`
        : `User: ${prompt}\nAssistant:`

      const response = await fetch(`${this.baseUrl}/${this.model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            do_sample: true,
            return_full_text: false
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (Array.isArray(data) && data[0]?.generated_text) {
        return data[0].generated_text.trim()
      }
      
      return 'I apologize, but I am having trouble generating a response right now.'
    } catch (error) {
      console.error('Hugging Face generation error:', error)
      
      // Fallback response based on language detection
      if (this.detectUrdu(prompt)) {
        return 'معذرت، میں اس وقت جواب نہیں دے سکتا۔ براہ کرم بعد میں کوشش کریں۔'
      }
      return 'I apologize, but I am having trouble generating a response right now. Please try again later.'
    }
  }

  async generateStreamResponse(prompt: string, systemPrompt?: string): Promise<AsyncIterable<string>> {
    // For simplicity, we'll return the full response as a single chunk
    // Hugging Face Inference API doesn't support streaming in the free tier
    const response = await this.generateResponse(prompt, systemPrompt)
    return this.createAsyncIterable(response)
  }

  private async* createAsyncIterable(text: string): AsyncIterable<string> {
    // Split response into chunks for streaming effect
    const words = text.split(' ')
    for (let i = 0; i < words.length; i += 3) {
      const chunk = words.slice(i, i + 3).join(' ') + ' '
      yield chunk
      // Small delay to simulate streaming
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  private detectUrdu(text: string): boolean {
    const urduPattern = /[\u0600-\u06FF\u0750-\u077F]/
    return urduPattern.test(text)
  }

  async checkModelAvailability(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: 'Hello',
          parameters: { max_new_tokens: 10 }
        })
      })
      return response.ok
    } catch (error) {
      console.error('Failed to check Hugging Face availability:', error)
      return false
    }
  }

  setModel(model: string): void {
    this.model = model
  }

  getModel(): string {
    return this.model
  }
}

export default HuggingFaceClient
