import mongoose, { type Document, Schema } from "mongoose"

export interface IFAQ extends Document {
  question: string
  answer: string
  category: string
  keywords: string[]
  language: string
  isActive: boolean
  priority: number
  createdAt: Date
  updatedAt: Date
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, required: true },
    keywords: [{ type: String }],
    language: { type: String, default: "en" },
    isActive: { type: Boolean, default: true },
    priority: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
)

// Index for search functionality
FAQSchema.index({ question: "text", answer: "text", keywords: "text" })

export default mongoose.models.FAQ || mongoose.model<IFAQ>("FAQ", FAQSchema)
