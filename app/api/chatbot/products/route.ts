import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ChatbotEngine from "@/lib/ai/chatbot-engine"

const chatbotEngine = new ChatbotEngine()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const limit = parseInt(searchParams.get('limit') || '10')

    await connectDB()

    if (query) {
      // Search products by query
      const products = await chatbotEngine.searchProducts(query, limit)
      return NextResponse.json({ products })
    }

    if (category || minPrice || maxPrice) {
      // Get product recommendations
      const priceRange = minPrice && maxPrice ? {
        min: parseFloat(minPrice),
        max: parseFloat(maxPrice)
      } : undefined

      const products = await chatbotEngine.getProductRecommendations(category || undefined, priceRange)
      return NextResponse.json({ products })
    }

    return NextResponse.json({ products: [] })

  } catch (error) {
    console.error("Product search API error:", error)
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    )
  }
}
