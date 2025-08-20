import { Ollama } from 'ollama'

class OllamaClient {
  private ollama: Ollama
  private model: string

  constructor(model: string = 'gpt-oss:20b') {
    this.ollama = new Ollama({ host: 'http://localhost:11434' })
    this.model = model
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

      const response = await this.ollama.chat({
        model: this.model,
        messages,
        stream: false,
      })

      return response.message.content
    } catch (error) {
      console.error('Ollama generation error:', error)
      throw new Error('Failed to generate response from local LLM')
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

      const response = await this.ollama.chat({
        model: this.model,
        messages,
        stream: true,
      })

      return this.streamToAsyncIterable(response)
    } catch (error) {
      console.error('Ollama streaming error:', error)
      throw new Error('Failed to generate streaming response from local LLM')
    }
  }

  private async* streamToAsyncIterable(stream: any): AsyncIterable<string> {
    for await (const chunk of stream) {
      if (chunk.message?.content) {
        yield chunk.message.content
      }
    }
  }

  async checkModelAvailability(): Promise<boolean> {
    try {
      const models = await this.ollama.list()
      return models.models.some(m => m.name.includes(this.model.split(':')[0]))
    } catch (error) {
      console.error('Failed to check model availability:', error)
      return false
    }
  }

  async pullModel(): Promise<void> {
    try {
      console.log(`Pulling model: ${this.model}`)
      await this.ollama.pull({ model: this.model })
      console.log(`Model ${this.model} pulled successfully`)
    } catch (error) {
      console.error('Failed to pull model:', error)
      throw new Error(`Failed to pull model: ${this.model}`)
    }
  }

  setModel(model: string): void {
    this.model = model
  }

  getModel(): string {
    return this.model
  }
}

export default OllamaClient
