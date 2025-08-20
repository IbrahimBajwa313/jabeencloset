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

    // Generate response using the chatbot engine
    const response = await chatbotEngine.generateResponse(message, conversationHistory)

    // Save the conversation to database
    const userMessage = {
      role: "user" as const,
      content: message,
      timestamp: new Date(),
      language,
      isVoice: body.isVoice || false
    }

    const assistantMessage = {
      role: "assistant" as const,
      content: response,
      timestamp: new Date(),
      language
    }

    // Find or create chat session
    let chatSession = await ChatSession.findOne({ sessionId })
    
    if (!chatSession) {
      chatSession = new ChatSession({
        sessionId,
        userId: body.userId,
        messages: [userMessage, assistantMessage],
        language,
        metadata: {
          userAgent: request.headers.get('user-agent'),
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
        }
      })
    } else {
      chatSession.messages.push(userMessage, assistantMessage)
      chatSession.language = language
      chatSession.updatedAt = new Date()
    }

    await chatSession.save()

    return NextResponse.json({
      response,
      sessionId,
      messageId: assistantMessage.timestamp.getTime().toString()
    })

  } catch (error) {
    console.error("Chatbot API error:", error)
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: "SessionId is required" },
        { status: 400 }
      )
    }

    await connectDB()

    const chatSession = await ChatSession.findOne({ sessionId })
    
    if (!chatSession) {
      return NextResponse.json(
        { messages: [], sessionId },
        { status: 200 }
      )
    }

    return NextResponse.json({
      messages: chatSession.messages,
      sessionId: chatSession.sessionId,
      language: chatSession.language
    })

  } catch (error) {
    console.error("Get chat history error:", error)
    return NextResponse.json(
      { error: "Failed to get chat history" },
      { status: 500 }
    )
  }
}
