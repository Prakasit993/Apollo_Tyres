'use server'

import { createClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function updateOrderStatus(orderId: string, newStatus: string) {
    const supabase = await createClient()

    // Auth & Role Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { message: "Unauthorized" }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return { message: "Forbidden" }

    try {
        // 1. Check if we need to restore stock (Transition to CANCELLED)
        if (newStatus === 'cancelled') {
            const { data: currentOrder } = await supabase
                .from('tyres_orders')
                .select('status, tyres_order_items(product_id, quantity)')
                .eq('id', orderId)
                .single()

            // Only restore if not already cancelled
            if (currentOrder && currentOrder.status !== 'cancelled') {
                const { createAdminClient } = await import('@/lib/supabase-admin')
                const supabaseAdmin = createAdminClient()

                const items = currentOrder.tyres_order_items as any[]
                // Note: Typescript might not know the shape without types, casting to any[] for simplicity in this file

                if (items && items.length > 0) {
                    for (const item of items) {
                        try {
                            const { data: product } = await supabaseAdmin
                                .from('tyres_products')
                                .select('stock')
                                .eq('id', item.product_id)
                                .single()

                            if (product) {
                                await supabaseAdmin
                                    .from('tyres_products')
                                    .update({ stock: product.stock + item.quantity })
                                    .eq('id', item.product_id)
                            }
                        } catch (err) {
                            console.error(`Failed to restore stock for item ${item.product_id}`, err)
                        }
                    }
                }
            }
        }

        const { error } = await supabase
            .from('tyres_orders')
            .update({ status: newStatus })
            .eq('id', orderId)

        if (error) {
            console.error("Update Status Error:", error)
            return { message: "Failed to update status" }
        }

        revalidatePath('/admin/orders')
        return { success: true, message: "Order status updated" }

    } catch (e) {
        return { message: "Server error" }
    }
}

export async function getAdminOrders() {
    const supabase = await createClient()

    // Auth & Role Check to ensure only admins trigger this update
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return []

    const { createAdminClient } = await import('@/lib/supabase-admin')
    const supabaseAdmin = createAdminClient()

    const { data: orders, error } = await supabaseAdmin
        .from('tyres_orders')
        .select(`
            *,
            profiles:user_id (full_name, email, phone),
            order_items:tyres_order_items (
                id,
                quantity,
                unit_price,
                total_price,
                products:tyres_products (brand, model)
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Fetch Orders Error:", error)
        return []
    }

    // Auto-cancel logic (Lazy check)
    // If order is pending and older than 1 hour, cancel it.
    const processedOrders = await Promise.all(orders.map(async (order) => {
        if (order.status === 'pending') {
            const createdAt = new Date(order.created_at).getTime()
            const now = new Date().getTime()
            const oneHour = 60 * 60 * 1000 // 1 Hour in milliseconds

            if (now - createdAt > oneHour) {
                // Perform cancellation
                const { error: updateError } = await supabase
                    .from('tyres_orders')
                    .update({ status: 'cancelled' })
                    .eq('id', order.id)

                if (!updateError) {
                    return { ...order, status: 'cancelled' }
                } else {
                    console.error(`Failed to auto-cancel order ${order.id}:`, updateError)
                }
            }
        }
        return order
    }))

    return processedOrders || []
}

export async function deleteOrder(orderId: string) {
    const supabase = await createClient()

    // Auth & Role Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { message: "Unauthorized" }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return { message: "Forbidden" }

    try {
        // 1. Fetch order details for stock restoration
        const { data: order } = await supabase
            .from('tyres_orders')
            .select('status, tyres_order_items(product_id, quantity)')
            .eq('id', orderId)
            .single()

        // 2. Restore stock if not already cancelled
        if (order && order.status !== 'cancelled') {
            const { createAdminClient } = await import('@/lib/supabase-admin')
            const supabaseAdmin = createAdminClient()
            const items = order.tyres_order_items as any[]

            if (items && items.length > 0) {
                for (const item of items) {
                    try {
                        const { data: product } = await supabaseAdmin
                            .from('tyres_products')
                            .select('stock')
                            .eq('id', item.product_id)
                            .single()

                        if (product) {
                            await supabaseAdmin
                                .from('tyres_products')
                                .update({ stock: product.stock + item.quantity })
                                .eq('id', item.product_id)
                        }
                    } catch (e) {
                        console.error("Stock restore error during delete", e)
                    }
                }
            }
        }

        // 3. Delete order
        const { error } = await supabase
            .from('tyres_orders')
            .delete()
            .eq('id', orderId)

        if (error) {
            console.error("Delete Order Error:", error)
            return { message: "Failed to delete order" }
        }

        revalidatePath('/admin/orders')
        return { success: true, message: "Order deleted successfully" }

    } catch (e) {
        return { message: "Server error" }
    }
}
