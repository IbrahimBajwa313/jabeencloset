import { NextRequest, NextResponse } from "next/server"
import ChatbotEngine from "@/lib/ai/chatbot-engine"

const chatbotEngine = new ChatbotEngine()

export async function GET(request: NextRequest) {
  try {
    // Check if Ollama model is available
    const modelAvailable = await chatbotEngine.checkModelAvailability()
    
    return NextResponse.json({
      status: "online",
      modelAvailable,
      features: {
        textChat: true,
        voiceInput: true,
        voiceOutput: true,
        multiLanguage: true,
        productSearch: true,
        recommendations: true
      },
      supportedLanguages: [
        'en-US', 'es-ES', 'fr-FR', 'de-DE', 
        'ar-SA', 'zh-CN', 'ja-JP', 'ko-KR'
      ]
    })

  } catch (error) {
    console.error("Chatbot status check error:", error)
    return NextResponse.json({
      status: "error",
      modelAvailable: false,
      error: "Failed to check chatbot status"
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'pullModel') {
      await chatbotEngine.pullModel()
      return NextResponse.json({ message: "Model pulled successfully" })
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    )

  } catch (error) {
    console.error("Chatbot action error:", error)
    return NextResponse.json(
      { error: "Failed to execute action" },
      { status: 500 }
    )
  }
}
