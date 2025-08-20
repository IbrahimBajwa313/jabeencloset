import mongoose, { type Document, Schema } from "mongoose"

export interface IChatbotKnowledge extends Document {
  title: string
  content: string
  type: "instruction" | "policy" | "guide" | "general"
  category: string
  keywords: string[]
  language: string
  isActive: boolean
  priority: number
  createdAt: Date
  updatedAt: Date
}

const ChatbotKnowledgeSchema = new Schema<IChatbotKnowledge>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["instruction", "policy", "guide", "general"],
      default: "general"
    },
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
ChatbotKnowledgeSchema.index({ title: "text", content: "text", keywords: "text" })

export default mongoose.models.ChatbotKnowledge || mongoose.model<IChatbotKnowledge>("ChatbotKnowledge", ChatbotKnowledgeSchema)
