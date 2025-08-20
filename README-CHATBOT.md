# AI-Powered E-commerce Chatbot System

## Overview
This is a complete AI-powered chatbot system with voice and text capabilities, built using open-source LLMs and modern web technologies.

## Features
- **Text & Voice Interaction**: Supports both text input and voice input in multiple languages
- **Multilingual Support**: Works with English, Spanish, French, German, Arabic, Chinese, Japanese, and Korean
- **Product Knowledge**: Dynamic access to product database, categories, prices, and availability
- **Admin Management**: Full admin panel for managing FAQs and knowledge base
- **Real-time Chat**: Instant responses with conversation history
- **Speech-to-Text & Text-to-Speech**: Built-in voice capabilities using Web Speech API
- **Flexible AI**: Multiple AI providers with automatic fallback (works without API keys)

## Tech Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **AI Engine**: Multi-provider (OpenAI GPT-3.5, Hugging Face, or Fallback AI)
- **Voice**: Web Speech API
- **UI Components**: Radix UI, shadcn/ui

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables (Optional)
Add to your `.env.local` file:
```
MONGODB_URI=your_mongodb_connection_string

# Optional: For enhanced AI responses (choose one)
OPENAI_API_KEY=your_openai_api_key
# OR
HUGGINGFACE_API_KEY=your_huggingface_api_key

# If no API keys provided, fallback AI will be used (works offline)
```

### 3. Seed Sample Data
```bash
node scripts/seed-chatbot-data.js
node scripts/seed-urdu-data.js
```

### 4. Start Development Server
```bash
npm run dev
```

**Note**: The chatbot works immediately without any AI API keys using the built-in fallback system!

## Usage

### Admin Panel
Visit `/admin/chatbot` to manage:
- **FAQs**: Add frequently asked questions and answers
- **Knowledge Base**: Add store policies, guides, and instructions
- **Categories**: Organize content by type and priority
- **Languages**: Support multiple languages

### Chatbot Widget
The chatbot widget appears on all pages with:
- **Chat Interface**: Text-based conversation
- **Voice Input**: Click microphone to speak
- **Voice Output**: AI responses can be spoken aloud
- **Language Selection**: Switch between supported languages
- **Settings**: Customize voice and display options

### API Endpoints
- `POST /api/chatbot/chat` - Send chat messages
- `POST /api/chatbot/stream` - Streaming chat responses
- `GET /api/chatbot/products` - Search products
- `GET /api/chatbot/status` - Check system status

## Chatbot Capabilities

### Product Queries
- "Show me red dresses under $100"
- "What's the best selling product?"
- "Do you have any electronics on sale?"

### Store Information
- "What are your shipping options?"
- "What's your return policy?"
- "Do you ship internationally?"

### Voice Commands
- Click microphone and speak naturally
- Supports multiple languages
- Auto-detection of language

### Multilingual Support
The chatbot automatically:
- Detects user language
- Responds in the same language
- Maintains context across languages
- Supports voice in multiple languages

## Architecture

### Components
- `ChatbotWidget`: Main chat interface
- `SpeechService`: Voice input/output handling
- `ChatbotEngine`: AI response generation
- `OllamaClient`: Local LLM integration

### Database Models
- `FAQ`: Frequently asked questions
- `ChatbotKnowledge`: Store policies and guides
- `ChatSession`: Conversation history
- `Product`: Product information
- `Category`: Product categories

### AI Processing Flow
1. User input (text/voice) → Speech-to-Text
2. Message processing → Context building
3. LLM generation → Response creation
4. Text-to-Speech → Voice output

## Customization

### Styling
The chatbot uses your existing color scheme:
- Primary color: `#F56565` (coral-pink)
- Supports light/dark themes
- Responsive design

### Voice Settings
- Adjustable speech rate, pitch, volume
- Language-specific voices
- Auto-speak toggle

### Position & Behavior
- Configurable widget position
- Minimizable interface
- Persistent conversations

## Performance

### Optimization Features
- Local LLM processing (no external API calls)
- Conversation context limiting
- Efficient database queries
- Streaming responses for better UX

### Monitoring
- Chat session tracking
- Response time monitoring
- Error logging and handling

## Security & Privacy

### Data Protection
- All AI processing happens locally
- No data sent to external services
- Conversation encryption in database
- User privacy maintained

### Access Control
- Admin panel requires authentication
- API rate limiting
- Input validation and sanitization

## Troubleshooting

### Common Issues
1. **Ollama not running**: Start Ollama service
2. **Model not found**: Run `ollama pull llama3.1:8b`
3. **Voice not working**: Check browser permissions
4. **Database errors**: Verify MongoDB connection

### Support
For technical support, check:
- Browser console for errors
- Network tab for API failures
- Ollama logs for AI issues
- MongoDB logs for database problems

## Future Enhancements
- Integration with more LLM providers
- Advanced analytics dashboard
- Custom training data upload
- Multi-modal support (images)
- Integration with customer support systems
