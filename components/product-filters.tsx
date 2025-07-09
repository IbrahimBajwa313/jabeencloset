"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

interface Category {
  _id: string
  name: string
  slug: string
}

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [categories, setCategories] = useState<Category[]>([])
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(searchParams.get("category")?.split(",") || [])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","))
    }

    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    setMinPrice("")
    setMaxPrice("")
    setSelectedCategories([])
    router.push("/products")
  }

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categorySlug])
    } else {
      setSelectedCategories(selectedCategories.filter((slug) => slug !== categorySlug))
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Price Range</Label>
            <div className="flex space-x-2">
              <Input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              <Input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Categories</Label>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.slug}
                    checked={selectedCategories.includes(category.slug)}
                    onCheckedChange={(checked) => handleCategoryChange(category.slug, checked as boolean)}
                  />
                  <Label htmlFor={category.slug} className="text-sm flex-1 cursor-pointer">
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button onClick={applyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
