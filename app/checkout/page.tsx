import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CheckoutForm } from "@/components/checkout-form"
import { OrderSummary } from "@/components/order-summary"

export const metadata = {
  title: "Checkout - ModernStore",
  description: "Complete your purchase securely",
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <CheckoutForm />
          </div>
          <div>
            <OrderSummary />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
