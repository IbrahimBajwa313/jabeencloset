import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ChatbotKnowledge from "@/models/ChatbotKnowledge"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await request.json()
    const knowledge = await ChatbotKnowledge.findByIdAndUpdate(params.id, body, { new: true })
    if (!knowledge) {
      return NextResponse.json({ error: "Knowledge not found" }, { status: 404 })
    }
    return NextResponse.json(knowledge)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update knowledge" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const knowledge = await ChatbotKnowledge.findByIdAndDelete(params.id)
    if (!knowledge) {
      return NextResponse.json({ error: "Knowledge not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Knowledge deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete knowledge" }, { status: 500 })
  }
}
