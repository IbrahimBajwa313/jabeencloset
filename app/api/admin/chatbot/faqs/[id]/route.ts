import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import FAQ from "@/models/FAQ"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await request.json()
    const faq = await FAQ.findByIdAndUpdate(params.id, body, { new: true })
    if (!faq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 })
    }
    return NextResponse.json(faq)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const faq = await FAQ.findByIdAndDelete(params.id)
    if (!faq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "FAQ deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 })
  }
}
