import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ChatSession from "@/models/ChatSession"
import ChatbotEngine from "@/lib/ai/chatbot-engine"

const chatbotEngine = new ChatbotEngine()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, sessionId, language = 'en', conversationHistory = [] } = body

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: "Message and sessionId are required" },
        { status: 400 }
      )
    }

    await connectDB()

    // Initialize chatbot context with the specified language
    await chatbotEngine.initializeContext(language)

    // Create readable stream for streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Save user message first
          const userMessage = {
            role: "user" as const,
            content: message,
            timestamp: new Date(),
            language,
            isVoice: body.isVoice || false
          }

          let chatSession = await ChatSession.findOne({ sessionId })
          if (!chatSession) {
            chatSession = new ChatSession({
              sessionId,
              userId: body.userId,
              messages: [userMessage],
              language,
              metadata: {
                userAgent: request.headers.get('user-agent'),
                ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
              }
            })
          } else {
            chatSession.messages.push(userMessage)
            chatSession.language = language
            chatSession.updatedAt = new Date()
          }
          await chatSession.save()

          // Generate streaming response
          const responseStream = await chatbotEngine.generateStreamResponse(message, conversationHistory)
          let fullResponse = ""

          for await (const chunk of responseStream) {
            fullResponse += chunk
            const data = JSON.stringify({ chunk, type: 'chunk' })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }

          // Save complete assistant message
          const assistantMessage = {
            role: "assistant" as const,
            content: fullResponse,
            timestamp: new Date(),
            language
          }

          chatSession.messages.push(assistantMessage)
          await chatSession.save()

          // Send completion signal
          const completionData = JSON.stringify({ 
            type: 'complete', 
            fullResponse,
            messageId: assistantMessage.timestamp.getTime().toString()
          })
          controller.enqueue(encoder.encode(`data: ${completionData}\n\n`))
          
          controller.close()
        } catch (error) {
          console.error("Streaming error:", error)
          const errorData = JSON.stringify({ 
            type: 'error', 
            error: 'Failed to generate response' 
          })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error("Chatbot streaming API error:", error)
    return NextResponse.json(
      { error: "Failed to process streaming chat message" },
      { status: 500 }
    )
  }
}
