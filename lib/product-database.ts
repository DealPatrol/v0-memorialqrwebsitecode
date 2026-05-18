import { PRODUCTS, type Product } from "./products"

export interface ProductSearchOptions {
  category?: string
  searchTerm?: string
  minPrice?: number
  maxPrice?: number
  limit?: number
  offset?: number
}

export interface ProductSearchResult {
  products: Product[]
  total: number
  offset: number
  limit: number
  hasMore: boolean
}

/**
 * Search and filter products based on provided criteria
 */
export function searchProducts(options: ProductSearchOptions): ProductSearchResult {
  let filtered = PRODUCTS

  // Filter by category
  if (options.category) {
    filtered = filtered.filter((p) => p.category === options.category)
  }

  // Filter by search term (searches name and description)
  if (options.searchTerm) {
    const term = options.searchTerm.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
    )
  }

  // Filter by price range
  if (options.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.priceInCents >= options.minPrice!)
  }
  if (options.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.priceInCents <= options.maxPrice!)
  }

  // Handle pagination
  const offset = Math.max(0, options.offset || 0)
  const limit = Math.min(100, options.limit || filtered.length)

  const paginated = filtered.slice(offset, offset + limit)

  return {
    products: paginated,
    total: filtered.length,
    offset,
    limit,
    hasMore: offset + limit < filtered.length,
  }
}

/**
 * Get a single product by ID
 */
export function getProductByIdWithDefaults(
  id: string,
): Product | null {
  return PRODUCTS.find((p) => p.id === id) || null
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  const categories = new Set(PRODUCTS.map((p) => p.category))
  return Array.from(categories)
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category)
}

/**
 * Get featured/trending products (first N products)
 */
export function getFeaturedProducts(count: number = 6): Product[] {
  return PRODUCTS.slice(0, count)
}

/**
 * Get similar products by category (excluding the given product ID)
 */
export function getSimilarProducts(productId: string, count: number = 3): Product[] {
  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) return []

  return PRODUCTS
    .filter((p) => p.id !== productId && p.category === product.category)
    .slice(0, count)
}
