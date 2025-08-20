import OpenAI from 'openai'

class OpenAIClient {
  private openai: OpenAI
  private model: string

  constructor(apiKey?: string, model: string = 'gpt-3.5-turbo') {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY || 'your-api-key-here',
    })
    this.model = model
  }

  async generateResponse(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = []
      
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

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: 500,
        temperature: 0.7,
      })

      return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
    } catch (error) {
      console.error('OpenAI generation error:', error)
      throw new Error('Failed to generate response from OpenAI')
    }
  }

  async generateStreamResponse(prompt: string, systemPrompt?: string): Promise<AsyncIterable<string>> {
    try {
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = []
      
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

      const stream = await this.openai.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: 500,
        temperature: 0.7,
        stream: true,
      })

      return this.streamToAsyncIterable(stream)
    } catch (error) {
      console.error('OpenAI streaming error:', error)
      throw new Error('Failed to generate streaming response from OpenAI')
    }
  }

  private async* streamToAsyncIterable(stream: any): AsyncIterable<string> {
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        yield content
      }
    }
  }

  async checkModelAvailability(): Promise<boolean> {
    try {
      // Simple test to check if API key works
      await this.openai.models.list()
      return true
    } catch (error) {
      console.error('Failed to check OpenAI availability:', error)
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

export default OpenAIClient
