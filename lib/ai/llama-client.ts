import { exec, spawn } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface LlamaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class LlamaClient {
  private modelPath: string;
  private executablePath: string;

  constructor() {
    // Common paths where Llama 2 might be installed
    this.executablePath = this.findLlamaExecutable();
    this.modelPath = this.findLlamaModel();
  }

  private findLlamaExecutable(): string {
    // Common paths for llama executable
    const possiblePaths = [
      'llama',
      'llama.exe',
      'C:\\llama\\llama.exe',
      'C:\\llama\\main.exe',
      'C:\\Program Files\\llama\\llama.exe',
      '.\\llama.exe',
      '.\\main.exe'
    ];
    return 'llama'; // Default, will be validated
  }

  private findLlamaModel(): string {
    // Common model file names and paths
    const possiblePaths = [
      'llama-2-7b-chat.gguf',
      'llama-2-7b-chat.q4_0.gguf',
      'C:\\llama\\models\\llama-2-7b-chat.gguf',
      'C:\\llama\\llama-2-7b-chat.gguf',
      '.\\models\\llama-2-7b-chat.gguf'
    ];
    return possiblePaths[0]; // Default
  }

  async chat(messages: LlamaMessage[]): Promise<AsyncGenerator<string, void, unknown>> {
    return this.generateLlamaResponse(messages);
  }

  private async *generateLlamaResponse(messages: LlamaMessage[]): AsyncGenerator<string, void, unknown> {
    try {
      const prompt = this.formatMessagesForLlama(messages);
      
      // Use simple command execution for compatibility
      const command = `${this.executablePath} -m "${this.modelPath}" -p "${prompt}" -n 512 --temp 0.7`;
      
      try {
        const { stdout } = await execAsync(command, { timeout: 30000 });
        
        // Stream the response word by word for better UX
        const words = stdout.trim().split(' ');
        for (const word of words) {
          if (word.trim()) {
            yield word + ' ';
            // Small delay to simulate streaming
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        }
      } catch (error) {
        console.warn('Llama execution failed, using fallback response');
        yield* this.getFallbackResponse(messages);
      }
    } catch (error) {
      console.error('Error in Llama client:', error);
      yield* this.getFallbackResponse(messages);
    }
  }

  private formatMessagesForLlama(messages: LlamaMessage[]): string {
    // Format messages for Llama 2 chat format
    let prompt = '';
    
    for (const message of messages) {
      if (message.role === 'system') {
        prompt += `System: ${message.content}\n\n`;
      } else if (message.role === 'user') {
        prompt += `Human: ${message.content}\n\n`;
      } else if (message.role === 'assistant') {
        prompt += `Assistant: ${message.content}\n\n`;
      }
    }
    
    prompt += 'Assistant: ';
    return prompt.replace(/"/g, '\\"'); // Escape quotes for command line
  }

  private async *getFallbackResponse(messages: LlamaMessage[]): AsyncGenerator<string, void, unknown> {
    const lastMessage = messages[messages.length - 1];
    const userInput = lastMessage?.content?.toLowerCase() || '';
    
    // Simple keyword-based responses as fallback
    let response = '';
    
    if (userInput.includes('price') || userInput.includes('cost')) {
      response = 'I can help you with pricing information. Please let me know which product you\'re interested in.';
    } else if (userInput.includes('product') || userInput.includes('item')) {
      response = 'I\'d be happy to help you find the perfect product. What are you looking for?';
    } else if (userInput.includes('shipping') || userInput.includes('delivery')) {
      response = 'We offer fast shipping options. Standard delivery takes 3-5 business days.';
    } else if (userInput.includes('return') || userInput.includes('refund')) {
      response = 'We have a 30-day return policy. You can return items in original condition for a full refund.';
    } else {
      response = 'Thank you for your message. How can I assist you with your shopping today?';
    }
    
    // Stream the fallback response
    const words = response.split(' ');
    for (const word of words) {
      yield word + ' ';
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async generateResponse(prompt: string, systemPrompt?: string): Promise<string> {
    const messages: LlamaMessage[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    let fullResponse = '';
    const responseGenerator = await this.chat(messages);
    
    for await (const chunk of responseGenerator) {
      fullResponse += chunk;
    }
    
    return fullResponse.trim();
  }

  async generateStreamResponse(prompt: string, systemPrompt?: string): Promise<AsyncIterable<string>> {
    const messages: LlamaMessage[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    return await this.chat(messages);
  }

  async checkModelAvailability(): Promise<boolean> {
    return await this.isAvailable();
  }

  async isAvailable(): Promise<boolean> {
    try {
      await execAsync(`${this.executablePath} --help`, { timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }
}
