import mongoose, { type Document, Schema } from "mongoose"

export interface IChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  language?: string
  isVoice?: boolean
}

export interface IChatSession extends Document {
  sessionId: string
  userId?: string
  messages: IChatMessage[]
  language: string
  isActive: boolean
  metadata: {
    userAgent?: string
    ip?: string
    location?: string
  }
  createdAt: Date
  updatedAt: Date
}

const ChatMessageSchema = new Schema<IChatMessage>({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  language: { type: String },
  isVoice: { type: Boolean, default: false },
})

const ChatSessionSchema = new Schema<IChatSession>(
  {
    sessionId: { type: String, required: true, unique: true },
    userId: { type: String },
    messages: [ChatMessageSchema],
    language: { type: String, default: "en" },
    isActive: { type: Boolean, default: true },
    metadata: {
      userAgent: { type: String },
      ip: { type: String },
      location: { type: String },
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.ChatSession || mongoose.model<IChatSession>("ChatSession", ChatSessionSchema)
