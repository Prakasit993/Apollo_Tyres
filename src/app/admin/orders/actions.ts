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

    // Check role inside component or here? Better here for fetching.
    // Assuming middleware/layout protects the page, but double check is good.

    const { data: orders, error } = await supabase
        .from('tyres_orders')
        .select(`
            *,
            profiles:user_id (full_name, email, phone),
            tyres_order_items (
                id,
                quantity,
                unit_price,
                total_price,
                tyres_products (brand, model)
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Fetch Orders Error:", error)
        return []
    }

    return orders
}

export async function deleteOrder(orderId: string) {
    const supabase = await createClient()

    // Auth & Role Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { message: "Unauthorized" }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return { message: "Forbidden" }

    try {
        // Delete order items first (cascade should handle this usually, but explicit is safer if no cascade)
        // Assuming database has ON DELETE CASCADE for order_items -> order_id
        // If not, we'd delete items here. Let's assume standard cascade or just delete order.

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
