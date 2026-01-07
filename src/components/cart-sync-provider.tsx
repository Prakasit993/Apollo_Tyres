'use client'

import { useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useCartStore } from '@/lib/cart-store'

/**
 * Cart Sync Provider
 * Automatically syncs cart between localStorage and database based on auth state
 */
export function CartSyncProvider({ children }: { children: React.ReactNode }) {
    const { setLoggedIn, syncGuestCart, loadFromDatabase } = useCartStore()

    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // Check initial auth state
        supabase.auth.getSession().then(({ data: { session } }) => {
            const isLoggedIn = !!session?.user
            setLoggedIn(isLoggedIn)

            if (isLoggedIn) {
                // User is logged in - check if we have guest cart to sync
                const localCart = useCartStore.getState().items
                if (localCart.length > 0) {
                    // Sync guest cart to database
                    syncGuestCart()
                } else {
                    // Just load from database
                    loadFromDatabase()
                }
            }
        })

        // Listen for auth state changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            const isLoggedIn = !!session?.user
            setLoggedIn(isLoggedIn)

            if (event === 'SIGNED_IN' && isLoggedIn) {
                // User just logged in - sync guest cart if exists
                const localCart = useCartStore.getState().items
                if (localCart.length > 0) {
                    await syncGuestCart()
                } else {
                    await loadFromDatabase()
                }
            } else if (event === 'SIGNED_OUT') {
                // User logged out - cart store will automatically use localStorage
                // No need to do anything
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [setLoggedIn, syncGuestCart, loadFromDatabase])

    return <>{children}</>
}
