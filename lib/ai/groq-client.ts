// Free Groq API Client - Fast and reliable for deployment
class GroqClient {
  private apiKey: string
  private model: string
  private baseUrl: string

  constructor(apiKey?: string, model: string = 'llama3-8b-8192') {
    this.apiKey = apiKey || process.env.GROQ_API_KEY || ''
    this.model = model
    this.baseUrl = 'https://api.groq.com/openai/v1'
    console.log('Groq Client initialized with model:', this.model)
    console.log('API Key status:', this.apiKey ? `Present (${this.apiKey.substring(0, 10)}...)` : 'Missing')
    console.log('Environment:', process.env.NODE_ENV)
    console.log('All env vars containing GROQ:', Object.keys(process.env).filter(key => key.includes('GROQ')))
  }

  async generateResponse(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      const messages = []
      
      if (systemPrompt) {
        messages.push({
          role: 'system',
          content: systemPrompt
        })
      }
      
      messages.push({
        role: 'user',
        content: prompt
      })

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          max_tokens: 300,
          temperature: 0.7,
          stream: false
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Groq API Error:', response.status, errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.choices && data.choices[0]?.message?.content) {
        return data.choices[0].message.content.trim()
      }
      
      return 'I apologize, but I am having trouble generating a response right now.'
    } catch (error) {
      console.error('Groq generation error:', error)
      
      // Fallback response based on language detection
      if (this.detectUrdu(prompt)) {
        return 'معذرت، میں اس وقت جواب نہیں دے سکتا۔ براہ کرم بعد میں کوشش کریں۔'
      }
      return 'I apologize, but I am having trouble generating a response right now. Please try again later.'
    }
  }

  async generateStreamResponse(prompt: string, systemPrompt?: string): Promise<AsyncIterable<string>> {
    try {
      const messages = []
      
      if (systemPrompt) {
        messages.push({
          role: 'system',
          content: systemPrompt
        })
      }
      
      messages.push({
        role: 'user',
        content: prompt
      })

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          max_tokens: 300,
          temperature: 0.7,
          stream: true
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return this.parseStreamResponse(response)
    } catch (error) {
      console.error('Groq streaming error:', error)
      // Fallback to non-streaming
      const response = await this.generateResponse(prompt, systemPrompt)
      return this.createAsyncIterable(response)
    }
  }

  private async* parseStreamResponse(response: Response): AsyncIterable<string> {
    const reader = response.body?.getReader()
    if (!reader) return

    const decoder = new TextDecoder()
    
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') return

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content
              if (content) {
                yield content
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  private async* createAsyncIterable(text: string): AsyncIterable<string> {
    // Split response into chunks for streaming effect
    const words = text.split(' ')
    for (let i = 0; i < words.length; i += 3) {
      const chunk = words.slice(i, i + 3).join(' ') + ' '
      yield chunk
      // Small delay to simulate streaming
      await new Promise(resolve => setTimeout(resolve, 50))
    }
  }

  private detectUrdu(text: string): boolean {
    const urduPattern = /[\u0600-\u06FF\u0750-\u077F]/
    return urduPattern.test(text)
  }

  async checkModelAvailability(): Promise<boolean> {
    try {
      console.log('Checking Groq availability with API key:', this.apiKey ? 'Present' : 'Missing')
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 10
        })
      })
      
      console.log('Groq API Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Groq API Error:', errorText)
      }
      
      return response.ok
    } catch (error) {
      console.error('Failed to check Groq availability:', error)
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

export default GroqClient
