import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    originalPrice?: number
    image: string
    rating: number
    reviews: number
    badge?: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Link href={`/products/${product.id}`}>
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {product.badge && (
            <Badge className="absolute top-3 left-3" variant="secondary">
              {product.badge}
            </Badge>
          )}

          {discountPercentage > 0 && (
            <Badge className="absolute top-3 right-3 bg-red-500 hover:bg-red-600">-{discountPercentage}%</Badge>
          )}
        </div>

        <div className="p-4 space-y-3">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
          </Link>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                )}
              </div>
            </div>
          </div>

          <Button className="w-full" size="sm">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
