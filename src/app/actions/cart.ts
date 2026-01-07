'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export interface CartItemDB {
    id: string
    user_id: string
    product_id: string
    quantity: number
    created_at: string
    updated_at: string
    // Joined product data
    tyres_products?: {
        model: string
        price: number
        image_url: string
        brand: string
        width: number
        aspect_ratio: number
        construction: string
        rim: number
    }
}

/**
 * Get all cart items for the current user
 */
export async function getCartItems(): Promise<CartItemDB[]> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return []
    }

    const { data, error } = await supabase
        .from('tyres_cart_items')
        .select(`
      *,
      tyres_products (
        model,
        price,
        image_url,
        brand,
        width,
        aspect_ratio,
        construction,
        rim
      )
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching cart items:', error)
        return []
    }

    return data || []
}

/**
 * Add item to cart or update quantity if exists
 */
export async function addToCartDB(productId: string, quantity: number = 1) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'User not authenticated' }
    }

    // Check if item already exists
    const { data: existing } = await supabase
        .from('tyres_cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()

    if (existing) {
        // Update existing item
        const { error } = await supabase
            .from('tyres_cart_items')
            .update({
                quantity: existing.quantity + quantity,
                updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)

        if (error) {
            console.error('Error updating cart item:', error)
            return { error: error.message }
        }
    } else {
        // Insert new item
        const { error } = await supabase
            .from('tyres_cart_items')
            .insert({
                user_id: user.id,
                product_id: productId,
                quantity
            })

        if (error) {
            console.error('Error adding cart item:', error)
            return { error: error.message }
        }
    }

    revalidatePath('/cart')
    return { success: true }
}

/**
 * Update cart item quantity
 */
export async function updateCartItemDB(productId: string, quantity: number) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'User not authenticated' }
    }

    if (quantity < 1) {
        return { error: 'Quantity must be at least 1' }
    }

    const { error } = await supabase
        .from('tyres_cart_items')
        .update({
            quantity,
            updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('product_id', productId)

    if (error) {
        console.error('Error updating cart item:', error)
        return { error: error.message }
    }

    revalidatePath('/cart')
    return { success: true }
}

/**
 * Remove item from cart
 */
export async function removeFromCartDB(productId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'User not authenticated' }
    }

    const { error } = await supabase
        .from('tyres_cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)

    if (error) {
        console.error('Error removing cart item:', error)
        return { error: error.message }
    }

    revalidatePath('/cart')
    return { success: true }
}

/**
 * Clear all cart items for current user
 */
export async function clearCartDB() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'User not authenticated' }
    }

    const { error } = await supabase
        .from('tyres_cart_items')
        .delete()
        .eq('user_id', user.id)

    if (error) {
        console.error('Error clearing cart:', error)
        return { error: error.message }
    }

    revalidatePath('/cart')
    return { success: true }
}

/**
 * Sync localStorage cart to database when user logs in
 * @param items - Array of cart items from localStorage
 */
export async function syncGuestCartToDB(items: Array<{
    id: string // product_id
    quantity: number
}>) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'User not authenticated' }
    }

    try {
        // Get existing cart items
        const { data: existing } = await supabase
            .from('tyres_cart_items')
            .select('product_id, quantity')
            .eq('user_id', user.id)

        const existingMap = new Map(
            (existing || []).map(item => [item.product_id, item.quantity])
        )

        // Merge guest cart with existing cart
        for (const item of items) {
            const existingQty = existingMap.get(item.id) || 0
            const newQuantity = existingQty + item.quantity

            if (existingQty > 0) {
                // Update existing
                await supabase
                    .from('tyres_cart_items')
                    .update({
                        quantity: newQuantity,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', user.id)
                    .eq('product_id', item.id)
            } else {
                // Insert new
                await supabase
                    .from('tyres_cart_items')
                    .insert({
                        user_id: user.id,
                        product_id: item.id,
                        quantity: item.quantity
                    })
            }
        }

        revalidatePath('/cart')
        return { success: true }
    } catch (error) {
        console.error('Error syncing guest cart:', error)
        return { error: 'Failed to sync cart' }
    }
}
