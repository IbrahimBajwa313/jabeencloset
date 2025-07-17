"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { OrderSummary } from "@/components/order-summary"

interface CartItem {
  _id: string
  product: {
    _id: string
    name: string
    price: number
    images: string[]
  }
  quantity: number
}

export function CheckoutClient() {
  const [isLoading, setIsLoading] = useState(true)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [altPhone, setAltPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")

  const [placingOrder, setPlacingOrder] = useState(false)

  useEffect(() => {
    fetchCartItems()
  }, [])

  const fetchCartItems = async () => {
    try {
      const response = await fetch("/api/cart")
      const data = await response.json()
      setCartItems(data.items || [])
    } catch (err) {
      console.error("Failed to fetch cart", err)
    } finally {
      setTimeout(() => setIsLoading(false), 700)
    }
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const tax = subtotal * 0.08
  const shipping = subtotal > 100 ? 0 : 9.99
  const total = subtotal + tax + shipping

  const handlePlaceOrder = async () => {
    if (!name || !email || !phone || !address || !city || !postalCode) {
      alert("Please fill in all required fields.")
      return
    }

    const orderPayload = {
      items: cartItems.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0] || "",
      })),
      address: {
        fullName: name,
        phoneNumber: phone,
        street: address,
        city,
        zipCode: postalCode,
        country: "Pakistan",
      },
      subtotal,
      tax,
      shipping,
      total,
      notes: `Alt phone: ${altPhone}, Email: ${email}`,
    }

    try {
      setPlacingOrder(true)
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      })

      if (res.ok) {
        alert("Order placed successfully!")
        window.location.href = "/thank-you"
        await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json", "user-id": "guest" },
          body: JSON.stringify({ clearAll: true }),
        })
        
        
      } else {
        const error = await res.json()
        console.error("Order error:", error)
        alert("Failed to place order.")
      }
    } catch (err) {
      console.error("Order error:", err)
      alert("Error placing order.")
    } finally {
      setPlacingOrder(false)
    }
  }

  return isLoading ? (
    <div className="flex justify-center items-center py-20">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ) : (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Checkout Form */}
      <div>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Billing Details</h2>
              <Input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Input type="text" placeholder="Alternate Phone Number (Optional)" value={altPhone} onChange={(e) => setAltPhone(e.target.value)} />
              <Input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
              <Input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
              <select defaultValue="Pakistan" className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Pakistan</option>
              </select>
              <Input type="text" placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
            </div>

            {/* Payment Method */}
            <div className="pt-6 space-y-3">
              <h2 className="text-xl font-semibold">Payment Method</h2>
              <div className="flex items-center space-x-2">
                <input type="radio" id="cod" name="payment" value="cod" defaultChecked className="accent-primary" />
                <label htmlFor="cod" className="text-sm">
                  Cash on Delivery (COD)
                </label>
              </div>
            </div>

            <Button
              className="w-full mt-6"
              onClick={handlePlaceOrder}
              disabled={placingOrder}
            >
              {placingOrder ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Placing...
                </>
              ) : (
                "Place Order"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary (no props) */}
      <div>
        <OrderSummary />
      </div>
    </div>
  )
}
