import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
    id: string
    model: string
    price: number
    quantity: number
    imageUrl: string
    brand: string
    specs: string // e.g. "195/65 R15"
}

interface CartState {
    items: CartItem[]
    addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
    removeFromCart: (itemId: string) => void
    updateQuantity: (itemId: string, quantity: number) => void
    clearCart: () => void

    // Computed values getters
    getTotalItems: () => number
    getSubtotal: () => number
    // "Rule of 4": Calculate sets of 4 and remainders
    getCartBreakdown: () => {
        setsOf4: number,
        remainder: number,
        formattedString: string
    }
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addToCart: (product, qty = 1) => {
                set((state) => {
                    const existingItem = state.items.find((i) => i.id === product.id)
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.id === product.id
                                    ? { ...i, quantity: i.quantity + qty }
                                    : i
                            ),
                        }
                    }
                    return { items: [...state.items, { ...product, quantity: qty }] }
                })
            },

            removeFromCart: (id) => {
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                }))
            },

            updateQuantity: (id, quantity) => {
                if (quantity < 1) return
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === id ? { ...i, quantity } : i
                    ),
                }))
            },

            clearCart: () => set({ items: [] }),

            getTotalItems: () => {
                return get().items.reduce((acc, item) => acc + item.quantity, 0)
            },

            getSubtotal: () => {
                const items = get().items
                return items.reduce((acc, item) => {
                    // Pricing Rule: Apollo Tires (Buy 4 for 7,000 THB)
                    if (item.brand === 'Apollo' && item.quantity >= 4) {
                        const setsOf4 = Math.floor(item.quantity / 4)
                        const remainder = item.quantity % 4
                        const setPrice = 7000

                        return acc + (setsOf4 * setPrice) + (remainder * item.price)
                    }

                    return acc + item.price * item.quantity
                }, 0)
            },

            getCartBreakdown: () => {
                const totalQty = get().items.reduce((acc, item) => acc + item.quantity, 0) // Simplified loop: Rule usually applies per product but user requirement was vague "Set of 4 rules".
                // Often "Set of 4" pricing applies to specific tires. 
                // For now, let's assume valid tires count towards sets.
                // Or if we just need total sets logic:
                const sets = Math.floor(totalQty / 4)
                const remainder = totalQty % 4

                return {
                    setsOf4: sets,
                    remainder: remainder,
                    formattedString: `${sets} Set(s) + ${remainder} Tire(s)`
                }
            }
        }),
        {
            name: 'tire-shop-cart',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
