"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search } from "lucide-react"
import { SkeletonLoader } from "@/components/skeleton-loader"

type Product = {
  id: string
  name: string
  description: string | null
  price: number
  sku: string | null
  category: string | null
  unit: string
  createdAt: string
  _count?: {
    invoiceItems: number
  }
}

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 h-10 bg-muted rounded-lg animate-pulse" />
            <div className="w-full sm:w-auto h-10 bg-muted rounded-lg animate-pulse" />
          </div>
          <SkeletonLoader />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Link href="/products/add" className="w-full sm:w-auto">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                {products.length === 0 ? "No products yet. Add your first product!" : "No products found"}
              </div>
            ) : (
              filteredProducts.map((product) => (
                <Link key={product.id} href={`/products/edit/${product.id}`}>
                  <div className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors cursor-pointer h-full">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-lg">{product.name}</div>
                        {product.sku && (
                          <div className="text-xs text-muted-foreground">SKU: {product.sku}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">₹{product.price.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">{product.unit}</div>
                      </div>
                    </div>
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      {product.category && (
                        <span className="text-muted-foreground">{product.category}</span>
                      )}
                      {product._count && product._count.invoiceItems > 0 && (
                        <span className="text-xs text-muted-foreground">
                          Used in {product._count.invoiceItems} invoice{product._count.invoiceItems !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
