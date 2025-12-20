import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Package } from "lucide-react"
import { OrderTimer } from "@/components/order-timer"

export const dynamic = 'force-dynamic'

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
    const resolvedParams = await searchParams;
    const isSuccess = resolvedParams?.success === 'true'
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    let query = supabase
        .from("orders")
        .select(`
            *,
            order_items (
                *,
                product:products(brand, model, image_url)
            )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

    if (isSuccess) {
        query = query.limit(1)
    }

    const { data: fetchedOrders, error: fetchError } = await query

    // Lazy Expiration Logic
    const orders = fetchedOrders ? await Promise.all(fetchedOrders.map(async (order) => {
        if (order.status === 'pending') {
            const createdAt = new Date(order.created_at).getTime()
            const now = new Date().getTime()
            const oneHour = 60 * 60 * 1000

            if (now - createdAt > oneHour) {
                // Expired, update status to cancelled
                const { error } = await supabase
                    .from('orders')
                    .update({ status: 'cancelled' })
                    .eq('id', order.id)

                if (!error) {
                    return { ...order, status: 'cancelled' }
                }
            }
        }
        return order
    })) : []

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            {isSuccess && (
                <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col items-center text-center animate-in fade-in slide-in-from-top-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-green-800 mb-2">Order Placed Successfully!</h2>
                    <p className="text-green-700">Thank you for your purchase. We will contact you shortly to confirm delivery.</p>
                </div>
            )}

            <h1 className="text-4xl font-black text-charcoal-900 mb-8 uppercase italic border-b-4 border-gold-500 inline-block">
                My Orders
            </h1>

            {!orders || orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg border border-border/50">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-400">No orders yet</h3>
                    <Link href="/products" className="text-gold-600 hover:underline mt-2 inline-block">
                        Go shop for some tires!
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white border border-border/60 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Order ID</p>
                                    <p className="font-mono text-sm">{order.id.slice(0, 8)}...</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Date</p>
                                    <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Total</p>
                                    <p className="font-black text-gold-600">฿{order.total_price.toLocaleString()}</p>
                                </div>
                                <div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                        {order.status === 'pending' && (
                                            <OrderTimer createdAt={order.created_at} />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.order_items.map((item: any) => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-md shrink-0 overflow-hidden">
                                                {item.product?.image_url && (
                                                    <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-charcoal-900">{item.product?.brand} {item.product?.model}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="font-medium">
                                                ฿{item.total_price.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center text-sm text-gray-500">
                                    <p>Payment: <span className="uppercase">{order.payment_method}</span></p>
                                    <p>Delivery: <span className="uppercase">{order.delivery_method}</span></p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
