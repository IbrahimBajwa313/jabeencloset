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

const urduFAQs = [
  {
    question: "آپ کے پاس کیا شپنگ آپشنز ہیں؟",
    answer: "ہم معیاری شپنگ (5-7 کاروباری دن) $5.99 میں، ایکسپریس شپنگ (2-3 کاروباری دن) $12.99 میں، اور راتوں رات شپنگ $24.99 میں فراہم کرتے ہیں۔ $50 سے زیادہ کے آرڈرز پر مفت معیاری شپنگ۔",
    category: "Shipping",
    keywords: ["شپنگ", "ڈیلیوری", "تیز", "راتوں رات", "ایکسپریس", "معیاری"],
    language: "ur",
    isActive: true,
    priority: 10
  },
  {
    question: "آپ کی واپسی کی پالیسی کیا ہے؟",
    answer: "ہم خریداری کے 30 دن کے اندر واپسی قبول کرتے ہیں۔ اشیاء اصل حالت میں ٹیگز کے ساتھ ہونی چاہیے۔ خراب اشیاء کے لیے واپسی کی شپنگ مفت ہے، دوسری واپسیوں کے لیے $7.99۔",
    category: "Returns",
    keywords: ["واپسی", "رقم واپسی", "تبدیلی", "پالیسی", "30 دن"],
    language: "ur",
    isActive: true,
    priority: 9
  },
  {
    question: "کیا آپ بین الاقوامی شپنگ کرتے ہیں؟",
    answer: "جی ہاں، ہم 50 سے زیادہ ممالک میں بین الاقوامی شپنگ کرتے ہیں۔ بین الاقوامی شپنگ $15.99 سے شروع ہوتی ہے اور 7-14 کاروباری دن لگتے ہیں۔ کسٹم فیس لاگو ہو سکتی ہے۔",
    category: "Shipping",
    keywords: ["بین الاقوامی", "دنیا بھر", "عالمی", "کسٹم", "بیرون ملک"],
    language: "ur",
    isActive: true,
    priority: 8
  },
  {
    question: "میں اپنے آرڈر کو کیسے ٹریک کر سکتا ہوں؟",
    answer: "جب آپ کا آرڈر بھیجا جائے گا، آپ کو ای میل کے ذریعے ٹریکنگ نمبر مل جائے گا۔ آپ اپنے اکاؤنٹ میں لاگ ان کر کے آرڈر کی تاریخ دیکھ کر بھی اپنے آرڈر کو ٹریک کر سکتے ہیں۔",
    category: "Orders",
    keywords: ["ٹریک", "ٹریکنگ", "آرڈر کی صورتحال", "شپمنٹ", "ڈیلیوری"],
    language: "ur",
    isActive: true,
    priority: 9
  },
  {
    question: "آپ کون سے پیمنٹ میتھڈز قبول کرتے ہیں؟",
    answer: "ہم تمام بڑے کریڈٹ کارڈز (ویزا، ماسٹر کارڈ، امریکن ایکسپریس)، پے پال، ایپل پے، گوگل پے، اور بینک ٹرانسفر قبول کرتے ہیں۔",
    category: "Payment",
    keywords: ["پیمنٹ", "کریڈٹ کارڈ", "پے پال", "ایپل پے", "گوگل پے"],
    language: "ur",
    isActive: true,
    priority: 8
  },
  {
    question: "میں صحیح سائز کیسے تلاش کروں؟",
    answer: "ہر پروڈکٹ پیج پر دستیاب ہماری تفصیلی سائز گائیڈ دیکھیں۔ اگر سائز بالکل فٹ نہیں آتا تو ہم مفت تبدیلی بھی فراہم کرتے ہیں۔",
    category: "Sizing",
    keywords: ["سائز", "سائزنگ", "فٹ", "پیمائش", "گائیڈ"],
    language: "ur",
    isActive: true,
    priority: 7
  }
]

const urduKnowledge = [
  {
    title: "اسٹور کے اوقات اور رابطہ کی معلومات",
    content: "ہماری کسٹمر سروس ٹیم پیر سے جمعہ صبح 9 بجے سے شام 6 بجے تک دستیاب ہے۔ آپ ہم سے support@jabeencloset.com پر رابطہ کر سکتے ہیں یا 1-800-JABEEN-1 پر کال کر سکتے ہیں۔ کاروباری اوقات میں ہماری ویب سائٹ پر لائیو چیٹ دستیاب ہے۔",
    type: "general",
    category: "Contact",
    keywords: ["اوقات", "رابطہ", "سپورٹ", "فون", "ای میل", "چیٹ"],
    language: "ur",
    isActive: true,
    priority: 8
  },
  {
    title: "پروڈکٹ کی دیکھ بھال کی ہدایات",
    content: "ہمارے زیادہ تر کپڑوں کی اشیاء ٹھنڈے پانی میں مشین سے دھوئے جا سکتے ہیں۔ مخصوص ہدایات کے لیے ہمیشہ کیئر لیبل چیک کریں۔ کپڑے کی کوالٹی اور رنگ برقرار رکھنے کے لیے ہم ہوا میں خشک کرنے کی تجویز کرتے ہیں۔",
    type: "guide",
    category: "Care",
    keywords: ["دیکھ بھال", "دھونا", "صفائی", "دیکھ بھال", "کپڑا"],
    language: "ur",
    isActive: true,
    priority: 6
  },
  {
    title: "وفاداری پروگرام کے فوائد",
    content: "ہمارے VIP پروگرام میں شامل ہو کر ہر خریداری پر پوائنٹس حاصل کریں! ہر ڈالر خرچ کرنے پر 1 پوائنٹ حاصل کریں۔ 100 پوائنٹس = $5 انعام۔ VIP ممبرز کو سیلز تک جلدی رسائی اور خصوصی رعایات ملتی ہیں۔",
    type: "general",
    category: "Rewards",
    keywords: ["وفاداری", "وی آئی پی", "پوائنٹس", "انعامات", "رعایات", "خصوصی"],
    language: "ur",
    isActive: true,
    priority: 7
  },
  {
    title: "گفٹ کارڈ پالیسی",
    content: "گفٹ کارڈز $25 سے $500 تک کی مختلف رقوم میں دستیاب ہیں۔ یہ کبھی ختم نہیں ہوتے اور آن لائن یا اسٹور میں استعمال ہو سکتے ہیں۔ گفٹ کارڈز کی رقم واپس نہیں ہوتی لیکن کسی اور شخص کو منتقل کی جا سکتی ہے۔",
    type: "policy",
    category: "Gift Cards",
    keywords: ["گفٹ کارڈ", "گفٹ سرٹیفکیٹ", "تحفہ", "واؤچر"],
    language: "ur",
    isActive: true,
    priority: 6
  },
  {
    title: "بلک آرڈر رعایات",
    content: "ہم 50 سے زیادہ اشیاء کے بلک آرڈرز کے لیے خصوصی قیمتیں فراہم کرتے ہیں۔ کسٹم کوٹس اور والیوم رعایات کے لیے ہماری سیلز ٹیم سے wholesale@jabeencloset.com پر رابطہ کریں۔",
    type: "instruction",
    category: "Wholesale",
    keywords: ["بلک", "ہول سیل", "والیوم", "رعایت", "کاروبار"],
    language: "ur",
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

async function seedUrduData() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Insert Urdu FAQs
    const insertedUrduFAQs = await FAQ.insertMany(urduFAQs)
    console.log(`Inserted ${insertedUrduFAQs.length} Urdu FAQs`)

    // Insert Urdu knowledge
    const insertedUrduKnowledge = await ChatbotKnowledge.insertMany(urduKnowledge)
    console.log(`Inserted ${insertedUrduKnowledge.length} Urdu knowledge entries`)

    console.log('Urdu chatbot data seeded successfully!')
    
  } catch (error) {
    console.error('Error seeding Urdu chatbot data:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

seedUrduData()
