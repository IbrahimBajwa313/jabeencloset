"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Heart, Sparkles, Star } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"


export default function OurStoryPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center gradient-rose">
        <Loader2 className="w-10 h-10 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-rose text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                  <Heart className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Story
            </h1>
            <p className="text-xl md:text-2xl text-rose-100 leading-relaxed">
              The inspiring journey of <span className="font-bold text-white">Mah Jabeen</span> and the birth of <span className="font-bold text-white">Jabeen Closet</span>
            </p>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <Star className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <Star className="w-8 h-8 text-white animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </section>

      {/* Main Story Content */}
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Founder Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-center mb-16"
            >
              <div className="relative inline-block mb-8">
                <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-rose-200 to-coral-200 p-1">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <div className="text-6xl">👩‍💼</div>
                  </div>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white rounded-full px-6 py-2 shadow-lg border border-rose-200">
                    <p className="font-bold text-rose-600">Mah Jabeen</p>
                  </div>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Meet Our Founder
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Founder & CEO of Jabeen Closet - A premium clothes and basic essentials brand
              </p>
            </motion.div>

            {/* Story Cards */}
            <div className="space-y-12">
              
              {/* Vision Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="bg-white rounded-2xl p-8 shadow-rose border border-rose-100"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full gradient-rose flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">The Vision</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Mah Jabeen envisioned creating a brand that would offer premium quality clothes and essential items 
                      that combine style, comfort, and affordability. Her dream was to make fashion accessible to everyone 
                      while maintaining the highest standards of quality and customer satisfaction.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Journey Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="bg-gradient-to-br from-rose-50 to-coral-50 rounded-2xl p-8 border border-rose-200"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border border-rose-200">
                      <Heart className="w-8 h-8 text-rose-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">The Journey</h3>
                    <p className="text-lg text-gray-600 leading-relaxed mb-4">
                      Starting with a passion for fashion and a keen eye for quality, Mah Jabeen began her entrepreneurial 
                      journey with determination and creativity. She believed that everyone deserves to look and feel their best, 
                      regardless of their budget.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Through careful curation of products, building relationships with trusted suppliers, and maintaining 
                      a customer-first approach, Jabeen Closet has grown from a small startup to a trusted brand that 
                      customers love and recommend.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Brand Promise Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8 }}
                className="bg-white rounded-2xl p-8 shadow-rose border border-rose-100"
              >
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-rose flex items-center justify-center">
                    <Star className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Promise</h3>
                  <div className="max-w-2xl mx-auto">
                    <blockquote className="text-xl text-gray-600 leading-relaxed italic mb-6">
                      "I'm passionate about offering premium products to support and delight you. Every piece in our collection 
                      is carefully selected to ensure you get the best quality, style, and value."
                    </blockquote>
                    <p className="font-bold text-rose-600 text-lg">
                      — Mah Jabeen, Founder & CEO, Jabeen Closet
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Values Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.0 }}
                className="grid md:grid-cols-3 gap-6"
              >
                <div className="bg-gradient-to-br from-rose-100 to-rose-50 rounded-xl p-6 text-center border border-rose-200">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-rose-500 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Quality First</h4>
                  <p className="text-gray-600 text-sm">Premium materials and craftsmanship in every product</p>
                </div>
                
                <div className="bg-gradient-to-br from-coral-100 to-coral-50 rounded-xl p-6 text-center border border-coral-200">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-coral-500 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Style & Comfort</h4>
                  <p className="text-gray-600 text-sm">Fashion that makes you look and feel amazing</p>
                </div>
                
                <div className="bg-gradient-to-br from-lavender-100 to-lavender-50 rounded-xl p-6 text-center border border-lavender-200">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-lavender-500 flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Customer Love</h4>
                  <p className="text-gray-600 text-sm">Your satisfaction is our greatest achievement</p>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
