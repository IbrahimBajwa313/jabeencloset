const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

// Try to load environment variables
try {
  require('dotenv').config({ path: '.env.local' })
} catch (error) {
  console.log('dotenv not found, trying to read .env.local manually')
}

// Manually read .env.local if dotenv fails
let MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  try {
    const envPath = path.join(__dirname, '..', '.env.local')
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8')
      const mongoMatch = envContent.match(/MONGODB_URI=(.+)/)
      if (mongoMatch) {
        MONGODB_URI = mongoMatch[1].trim()
      }
    }
  } catch (error) {
    console.log('Could not read .env.local file')
  }
}

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local')
  console.error('Example: MONGODB_URI=mongodb://localhost:27017/your-database')
  process.exit(1)
}

const sampleFAQs = [
  {
    question: "What are your shipping options?",
    answer: "We offer standard shipping (5-7 business days) for $5.99, express shipping (2-3 business days) for $12.99, and overnight shipping for $24.99. Free standard shipping on orders over $50.",
    category: "Shipping",
    keywords: ["shipping", "delivery", "fast", "overnight", "express", "standard"],
    language: "en",
    isActive: true,
    priority: 10
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns within 30 days of purchase. Items must be in original condition with tags attached. Return shipping is free for defective items, $7.99 for other returns.",
    category: "Returns",
    keywords: ["return", "refund", "exchange", "policy", "30 days"],
    language: "en",
    isActive: true,
    priority: 9
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship internationally to over 50 countries. International shipping starts at $15.99 and takes 7-14 business days. Customs fees may apply.",
    category: "Shipping",
    keywords: ["international", "worldwide", "global", "customs", "overseas"],
    language: "en",
    isActive: true,
    priority: 8
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and viewing order history.",
    category: "Orders",
    keywords: ["track", "tracking", "order status", "shipment", "delivery"],
    language: "en",
    isActive: true,
    priority: 9
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers.",
    category: "Payment",
    keywords: ["payment", "credit card", "paypal", "apple pay", "google pay"],
    language: "en",
    isActive: true,
    priority: 8
  },
  {
    question: "How do I find the right size?",
    answer: "Check our detailed size guide available on each product page. We also offer free exchanges if the size doesn't fit perfectly.",
    category: "Sizing",
    keywords: ["size", "sizing", "fit", "measurements", "guide"],
    language: "en",
    isActive: true,
    priority: 7
  }
]

const sampleKnowledge = [
  {
    title: "Store Hours and Contact Information",
    content: "Our customer service team is available Monday-Friday 9AM-6PM EST. You can reach us at support@jabeencloset.com or call 1-800-JABEEN-1. Live chat is available on our website during business hours.",
    type: "general",
    category: "Contact",
    keywords: ["hours", "contact", "support", "phone", "email", "chat"],
    language: "en",
    isActive: true,
    priority: 8
  },
  {
    title: "Product Care Instructions",
    content: "Most of our clothing items are machine washable in cold water. Always check the care label for specific instructions. We recommend air drying to maintain fabric quality and color.",
    type: "guide",
    category: "Care",
    keywords: ["care", "washing", "cleaning", "maintenance", "fabric"],
    language: "en",
    isActive: true,
    priority: 6
  },
  {
    title: "Loyalty Program Benefits",
    content: "Join our VIP program to earn points on every purchase! Earn 1 point per dollar spent. 100 points = $5 reward. VIP members get early access to sales and exclusive discounts.",
    type: "general",
    category: "Rewards",
    keywords: ["loyalty", "vip", "points", "rewards", "discounts", "exclusive"],
    language: "en",
    isActive: true,
    priority: 7
  },
  {
    title: "Gift Card Policy",
    content: "Gift cards are available in denominations from $25 to $500. They never expire and can be used online or in-store. Gift cards are non-refundable but can be transferred to another person.",
    type: "policy",
    category: "Gift Cards",
    keywords: ["gift card", "gift certificate", "present", "voucher"],
    language: "en",
    isActive: true,
    priority: 6
  },
  {
    title: "Bulk Order Discounts",
    content: "We offer special pricing for bulk orders over 50 items. Contact our sales team at wholesale@jabeencloset.com for custom quotes and volume discounts.",
    type: "instruction",
    category: "Wholesale",
    keywords: ["bulk", "wholesale", "volume", "discount", "business"],
    language: "en",
    isActive: true,
    priority: 5
  }
]

// Simple schema definitions (inline to avoid import issues)
const FAQSchema = new mongoose.Schema({
  question: String,
  answer: String,
  category: String,
  keywords: [String],
  language: { type: String, default: "en" },
  isActive: { type: Boolean, default: true },
  priority: { type: Number, default: 0 }
}, { timestamps: true })

const ChatbotKnowledgeSchema = new mongoose.Schema({
  title: String,
  content: String,
  type: { type: String, enum: ["instruction", "policy", "guide", "general"], default: "general" },
  category: String,
  keywords: [String],
  language: { type: String, default: "en" },
  isActive: { type: Boolean, default: true },
  priority: { type: Number, default: 0 }
}, { timestamps: true })

const FAQ = mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema)
const ChatbotKnowledge = mongoose.models.ChatbotKnowledge || mongoose.model('ChatbotKnowledge', ChatbotKnowledgeSchema)

async function seedChatbotData() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing data
    await FAQ.deleteMany({})
    await ChatbotKnowledge.deleteMany({})
    console.log('Cleared existing chatbot data')

    // Insert sample FAQs
    const insertedFAQs = await FAQ.insertMany(sampleFAQs)
    console.log(`Inserted ${insertedFAQs.length} FAQs`)

    // Insert sample knowledge
    const insertedKnowledge = await ChatbotKnowledge.insertMany(sampleKnowledge)
    console.log(`Inserted ${insertedKnowledge.length} knowledge entries`)

    console.log('Chatbot data seeded successfully!')
    
  } catch (error) {
    console.error('Error seeding chatbot data:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

seedChatbotData()
