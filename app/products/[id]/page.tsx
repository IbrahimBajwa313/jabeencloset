import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductDetails } from "@/components/product-details"
import { RelatedProducts } from "@/components/related-products"
import { notFound } from "next/navigation"

// Mock product data - replace with actual database call
const getProduct = async (id: string) => {
  // This would be replaced with actual database call
  const mockProduct = {
    id,
    name: "Premium Wireless Headphones",
    description:
      "Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation and 30-hour battery life.",
    price: 299.99,
    originalPrice: 399.99,
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    category: "Electronics",
    inStock: true,
    rating: 4.8,
    reviews: 124,
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Bluetooth 5.0",
      "Premium materials",
      "Comfortable fit",
    ],
  }

  return mockProduct
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: `${product.name} - ModernStore`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0]],
    },
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <ProductDetails product={product} />
        <div className="mt-16">
          <RelatedProducts categoryId={product.category} currentProductId={product.id} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
