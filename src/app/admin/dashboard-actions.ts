'use server'

import { createClient } from "@/lib/supabase-server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function getDashboardStats() {
    const supabase = await createClient()

    // Auth & Role Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') throw new Error("Forbidden")

    // Use Admin Client to bypass RLS for aggregate stats
    const admin = createAdminClient()

    // 1. Fetch Totals
    // Revenue (Sum of total_price where status = 'completed' or 'paid' - let's assume 'paid' counts closely enough or strict 'completed')
    // Changing to 'paid', 'shipped', 'completed' for revenue calculation to be more realistic.
    const { data: revenueData, error: revenueError } = await admin
        .from('tyres_orders')
        .select('total_price')
        .in('status', ['paid', 'shipped', 'completed'])

    const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0

    // Pending Orders
    const { count: pendingOrders } = await admin
        .from('tyres_orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

    // Total Products
    const { count: totalProducts } = await admin
        .from('tyres_products')
        .select('*', { count: 'exact', head: true })

    // 2. Sales Trend (Last 30 Days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: salesData } = await admin
        .from('tyres_orders')
        .select('created_at, total_price')
        .in('status', ['paid', 'shipped', 'completed'])
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true })

    // Aggregate by date
    const salesMap = new Map<string, number>();
    // Initialize last 30 days with 0
    for (let i = 0; i < 30; i++) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        // Format YYYY-MM-DD
        const dateStr = d.toISOString().split('T')[0]
        salesMap.set(dateStr, 0)
    }

    salesData?.forEach(order => {
        const dateStr = new Date(order.created_at).toISOString().split('T')[0]
        const current = salesMap.get(dateStr) || 0
        salesMap.set(dateStr, current + order.total_price)
    })

    // Convert to array and sort by date
    const monthlySales = Array.from(salesMap.entries())
        .map(([date, total]) => ({ date, total }))
        .sort((a, b) => a.date.localeCompare(b.date))
        // Format date for chart (e.g., "Dec 01")
        .map(item => ({
            ...item,
            shortDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }))


    // 3. Order Status Distribution
    const { data: statusData } = await admin
        .from('tyres_orders')
        .select('status')

    const statusCounts: Record<string, number> = {}
    statusData?.forEach(order => {
        statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
    })

    const orderStatusDistribution = Object.entries(statusCounts).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
    }))

    return {
        totalRevenue,
        pendingOrders: pendingOrders || 0,
        totalProducts: totalProducts || 0,
        monthlySales,
        orderStatusDistribution
    }
}
