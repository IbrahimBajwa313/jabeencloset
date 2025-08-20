import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ChatbotKnowledge from "@/models/ChatbotKnowledge"

export async function GET() {
  try {
    await connectDB()
    const knowledge = await ChatbotKnowledge.find({}).sort({ priority: -1, createdAt: -1 })
    return NextResponse.json(knowledge)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch knowledge" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const knowledge = new ChatbotKnowledge(body)
    await knowledge.save()
    return NextResponse.json(knowledge, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create knowledge" }, { status: 500 })
  }
}
