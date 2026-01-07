import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
    getCartItems,
    addToCartDB,
    updateCartItemDB,
    removeFromCartDB,
    clearCartDB,
    syncGuestCartToDB
} from '@/app/actions/cart'

export interface CartItem {
    id: string // product_id
    model: string
    price: number
    quantity: number
    imageUrl: string
    brand: string
    specs: string // e.g. "195/65 R15"
}

interface CartState {
    items: CartItem[]
    isLoading: boolean
    isLoggedIn: boolean

    // Actions
    setLoggedIn: (loggedIn: boolean) => void
    loadFromDatabase: () => Promise<void>
    syncGuestCart: () => Promise<void>
    addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => Promise<void>
    removeFromCart: (itemId: string) => Promise<void>
    updateQuantity: (itemId: string, quantity: number) => Promise<void>
    clearCart: () => Promise<void>

    // Computed values getters
    getTotalItems: () => number
    getSubtotal: () => number
    getCartBreakdown: () => {
        setsOf4: number,
        remainder: number,
        formattedString: string
    }
}

const calculateSubtotal = (items: CartItem[]) => {
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
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,
            isLoggedIn: false,

            setLoggedIn: (loggedIn) => {
                set({ isLoggedIn: loggedIn })
            },

            /**
             * Load cart from database (for logged-in users)
             */
            loadFromDatabase: async () => {
                const { isLoggedIn } = get()
                if (!isLoggedIn) return

                set({ isLoading: true })
                try {
                    const dbItems = await getCartItems()

                    // Transform database items to CartItem format
                    const items: CartItem[] = dbItems
                        .filter(item => item.tyres_products) // Filter out items with deleted products
                        .map(item => {
                            const product = item.tyres_products!
                            return {
                                id: item.product_id,
                                model: product.model,
                                price: Number(product.price),
                                quantity: item.quantity,
                                imageUrl: product.image_url || '',
                                brand: product.brand,
                                specs: `${product.width}/${product.aspect_ratio} ${product.construction}${product.rim}`
                            }
                        })

                    set({ items, isLoading: false })
                } catch (error) {
                    console.error('Failed to load cart from database:', error)
                    set({ isLoading: false })
                }
            },

            /**
             * Sync guest cart (localStorage) to database when user logs in
             */
            syncGuestCart: async () => {
                const { items, isLoggedIn } = get()
                if (!isLoggedIn || items.length === 0) return

                set({ isLoading: true })
                try {
                    // Sync to database
                    await syncGuestCartToDB(
                        items.map(item => ({
                            id: item.id,
                            quantity: item.quantity
                        }))
                    )

                    // Clear localStorage and reload from database
                    set({ items: [] }) // Clear local state
                    await get().loadFromDatabase()
                } catch (error) {
                    console.error('Failed to sync guest cart:', error)
                    set({ isLoading: false })
                }
            },

            /**
             * Add item to cart (hybrid: localStorage for guest, DB for logged-in)
             */
            addToCart: async (product, qty = 1) => {
                const { isLoggedIn } = get()

                if (isLoggedIn) {
                    // Database mode
                    set({ isLoading: true })
                    try {
                        await addToCartDB(product.id, qty)
                        await get().loadFromDatabase()
                    } catch (error) {
                        console.error('Failed to add to cart:', error)
                        set({ isLoading: false })
                    }
                } else {
                    // localStorage mode (guest)
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
                }
            },

            /**
             * Remove item from cart
             */
            removeFromCart: async (id) => {
                const { isLoggedIn } = get()

                if (isLoggedIn) {
                    // Database mode
                    set({ isLoading: true })
                    try {
                        await removeFromCartDB(id)
                        await get().loadFromDatabase()
                    } catch (error) {
                        console.error('Failed to remove from cart:', error)
                        set({ isLoading: false })
                    }
                } else {
                    // localStorage mode
                    set((state) => ({
                        items: state.items.filter((i) => i.id !== id),
                    }))
                }
            },

            /**
             * Update cart item quantity
             */
            updateQuantity: async (id, quantity) => {
                if (quantity < 1) return

                const { isLoggedIn } = get()

                if (isLoggedIn) {
                    // Database mode
                    set({ isLoading: true })
                    try {
                        await updateCartItemDB(id, quantity)
                        await get().loadFromDatabase()
                    } catch (error) {
                        console.error('Failed to update quantity:', error)
                        set({ isLoading: false })
                    }
                } else {
                    // localStorage mode
                    set((state) => ({
                        items: state.items.map((i) =>
                            i.id === id ? { ...i, quantity } : i
                        ),
                    }))
                }
            },

            /**
             * Clear all items from cart
             */
            clearCart: async () => {
                const { isLoggedIn } = get()

                if (isLoggedIn) {
                    // Database mode
                    set({ isLoading: true })
                    try {
                        await clearCartDB()
                        set({ items: [], isLoading: false })
                    } catch (error) {
                        console.error('Failed to clear cart:', error)
                        set({ isLoading: false })
                    }
                } else {
                    // localStorage mode
                    set({ items: [] })
                }
            },

            getTotalItems: () => {
                return get().items.reduce((acc, item) => acc + item.quantity, 0)
            },

            getSubtotal: () => {
                const items = get().items
                return calculateSubtotal(items)
            },

            getCartBreakdown: () => {
                const totalQty = get().items.reduce((acc, item) => acc + item.quantity, 0)
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
            // Only persist items for guest users
            partialize: (state) => ({
                items: state.isLoggedIn ? [] : state.items
            })
        }
    )
)
