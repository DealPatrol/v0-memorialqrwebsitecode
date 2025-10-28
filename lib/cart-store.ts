"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  name: string
  image: string
  price: number
  originalPrice?: number
  size: string
  color: string
  quantity: number
  digitalMemorialIncluded: boolean
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string, size: string, color: string) => void
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const items = get().items
        const existingItemIndex = items.findIndex(
          (item) => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color,
        )

        if (existingItemIndex > -1) {
          // Update quantity if item already exists
          const updatedItems = [...items]
          updatedItems[existingItemIndex].quantity += 1
          set({ items: updatedItems })
        } else {
          // Add new item
          set({ items: [...items, { ...newItem, quantity: 1 }] })
        }
      },

      removeItem: (id, size, color) => {
        set({
          items: get().items.filter((item) => !(item.id === id && item.size === size && item.color === color)),
        })
      },

      updateQuantity: (id, size, color, quantity) => {
        if (quantity < 1) return

        set({
          items: get().items.map((item) =>
            item.id === id && item.size === size && item.color === color ? { ...item, quantity } : item,
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: "memorial-cart-storage",
    },
  ),
)
