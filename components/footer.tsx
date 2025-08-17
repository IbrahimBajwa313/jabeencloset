"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Facebook, Instagram, Mail, Phone, MapPin, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// Using a simple text icon for TikTok instead of react-icons

export function Footer() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubscribe = async () => {
   
    if (!email) return

    setIsLoading(true)
    setSuccess(false)

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setSuccess(true)
        setEmail("")
      } else {
        alert("Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error(error)
      alert("Failed to subscribe.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer className="border-t sm:mt-16 mt-20 mb-10 dark:border-white/10">
      {/* Newsletter CTA */}
      {/* <div className="relative z-10 w-full flex justify-center">
        <div className="w-10/12 md:w-9/12 lg:w-3/5 mx-auto shadow-rose -mb-20 z-20">
          <div className="gradient-rose text-white rounded-xl shadow-rose border border-white/30 overflow-visible">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4 py-6 md:px-10 md:py-10 relative">
              {/* <div className="md:absolute relative flex flex-col left-0 -bottom-6 md:block">
                <Image
                  src="/footer.png"
                  alt="Newsletter Illustration"
                  width={220}
                  height={220}
                  className="object-contain"
                />
              </div> */}
{/* 
              <div className="md:pl-48 lg:pl-56 flex flex-col justify-center gap-3 text-center md:text-left">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold leading-snug">
                  Subscribe to our newsletter
                </h2>
                <p className="text-sm text-rose-100 max-w-md mx-auto md:mx-0">
                  Get 20% off on your first order just by subscribing. Don't miss out on the cutest toddler deals!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-2 justify-center md:justify-start">
                  <Input
                    placeholder="Enter your email"
                    className="rounded-full px-4 py-2 text-rose-800 w-full sm:w-64 bg-white border-rose-200 focus:border-rose-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button
                    onClick={handleSubscribe}
                    disabled={isLoading || !email}
                    className="rounded-full bg-white text-rose-600 hover:bg-rose-50 hover:text-rose-700 px-6 whitespace-nowrap shadow-soft transition-all duration-300"
                  >
                    {isLoading ? "Sending..." : "Subscribe"}
                  </Button>
                </div>
                {success && (
                  <p className="text-xs mt-1 text-coral-200">✅ You're subscribed!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div> */} 

      {/* Main Footer */}
      <div className="relative z-0 container shadow-soft bg-gradient-to-br from-rose-50 to-coral-50 dark:from-rose-950 dark:to-coral-950 border border-rose-200 dark:border-rose-800 w-11/12 sm:w-5/6 mx-auto px-4 pt-32 sm:pt-20 pb-2 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo & Social */}
          <div className="flex flex-col gap-4 pb-0">
            <Link href="/">
              <h2 className="text-xl font-bold bg-gradient-to-r from-rose-600 via-coral-500 to-rose-500 bg-clip-text text-transparent hover:from-rose-500 hover:via-coral-400 hover:to-rose-400 transition-all duration-300 tracking-wide">
                Jabeen Closet
              </h2>
            </Link>
            <p className="text-sm text-rose-600 dark:text-rose-300">
              Bringing joy to every toddler's world.
            </p>
            <div className="border-l-4 border-rose-500 pl-4 mt-2 text-sm italic text-rose-700 dark:text-rose-400">
              <p>
                "I'm passionate about offering premium products to support and delight you."
              </p>
              <p className="mt-1 font-semibold not-italic text-rose-600 dark:text-rose-300">
                — Mah Jabeen, Founder & CEO, Jabeen Closet
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="md:pt-32">
            <h4 className="text-sm font-semibold mb-4 text-rose-600 dark:text-rose-300">Contact</h4>
            <ul className="space-y-2 text-sm text-rose-700 dark:text-rose-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-coral-500" /> +9223241635860
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-coral-500" /> jabeen@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-coral-500" /> Faisalabad
              </li>
              <div className="ms-10 flex space-x-0 mt-0">
                <Link href="https://www.facebook.com/profile.php?id=61567127003108&mibextid=ZbWKwL" target="_blank">
                  <Button variant="ghost" size="icon" className="hover:bg-rose-100 dark:hover:bg-rose-800">
                    <Facebook className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </Button>
                </Link>
                <Link href="https://www.instagram.com/toddlersworld16?igshid=djU0bzdtMGQ2dzR0" target="_blank">
                  <Button variant="ghost" size="icon" className="hover:bg-rose-100 dark:hover:bg-rose-800">
                    <Instagram className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </Button>
                </Link>
                <Link href="https://www.tiktok.com/@toddlersworld16?_t=ZS-8y8dGyD3eqO&_r=1" target="_blank">
                  <Button variant="ghost" size="icon" className="hover:bg-rose-100 dark:hover:bg-rose-800">
                    <span className="w-5 h-5 text-rose-600 dark:text-rose-400 font-bold text-sm flex items-center justify-center">TT</span>
                  </Button>
                </Link>
              </div>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="md:pt-32">
            <h4 className="text-sm font-semibold mb-4 text-rose-600 dark:text-rose-300">Quick Links</h4>
            <ul className="space-y-2 text-sm text-rose-700 dark:text-rose-400">
              <li><Link href="/ourStory" className="hover:text-rose-600 dark:hover:text-rose-300 hover:underline transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-rose-600 dark:hover:text-rose-300 hover:underline transition-colors">Contact Us</Link></li>
              <li><Link href="/products" className="hover:text-rose-600 dark:hover:text-rose-300 hover:underline transition-colors">Shop</Link></li>
              <li><Link href="/returns" className="hover:text-rose-600 dark:hover:text-rose-300 hover:underline transition-colors">Return Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center text-xs text-rose-600 dark:text-rose-400 border-t border-rose-200 dark:border-rose-700 pt-2">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-3">
            <div className="flex items-center gap-1">
              <Code2 className="w-3 h-3" />
              <span> 2025 Jabeen Closet. All rights reserved.</span>
            </div>
            <span className="hidden sm:inline-block">|</span>
            <span>
              Developed by{" "}
              <Link
                href="https://www.techcognify.com/"
                target="_blank"
                className="hover:underline underline-offset-2 text-rose-600 dark:text-rose-300 font-medium transition-colors"
              >
                TECHCOGNIFY
              </Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
