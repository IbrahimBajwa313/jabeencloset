"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative gradient-rose text-white overflow-hidden min-h-screen flex items-center">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-coral-200 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-lavender-200 rounded-full blur-md"></div>
      </div>
      
      <div className="container mx-auto px-6 py-24 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="inline-block"
              >
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/30">
                  ✨ New Collection Available
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-5xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-white to-rose-100 bg-clip-text text-transparent"
              >
                Discover Premium Products for Modern Living
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl lg:text-2xl text-rose-100 leading-relaxed max-w-lg"
              >
                Shop the latest trends with fast shipping and exceptional customer service. Experience luxury that fits your lifestyle.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button asChild size="lg" className="btn-feminine text-white hover:scale-105 transition-all duration-300">
                <Link href="/products" className="flex items-center">
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white bg-transparent backdrop-blur-sm transition-all duration-300"
              >
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-wrap items-center gap-6 text-sm"
            >
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-coral-300 rounded-full animate-pulse"></div>
                <span className="font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-coral-300 rounded-full animate-pulse"></div>
                <span className="font-medium">30-Day Returns</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-coral-300 rounded-full animate-pulse"></div>
                <span className="font-medium">24/7 Support</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Section - Image */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="relative lg:justify-self-end"
          >
            {/* Floating decorative elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-white/20 rounded-full blur-sm animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-coral-200/30 rounded-full blur-md"></div>
            
            <div className="relative z-10 group">
              <div className="glass-effect p-4 rounded-3xl">
                <Image
                  src="/jabeencloset.jpg"
                  alt="Hero Product"
                  width={600}
                  height={600}
                  className="rounded-2xl shadow-soft transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>
            </div>
            
            {/* Background decorative gradient */}
            <div className="absolute inset-0 gradient-lavender rounded-3xl transform rotate-3 scale-110 opacity-15 blur-sm"></div>
            <div className="absolute inset-0 gradient-soft rounded-3xl transform -rotate-2 scale-105 opacity-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
