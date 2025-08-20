import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import FAQ from "@/models/FAQ"

export async function GET() {
  try {
    await connectDB()
    const faqs = await FAQ.find({}).sort({ priority: -1, createdAt: -1 })
    return NextResponse.json(faqs)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const faq = new FAQ(body)
    await faq.save()
    return NextResponse.json(faq, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 })
  }
}
