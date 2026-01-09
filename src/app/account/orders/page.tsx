import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, Calendar, MapPin, CreditCard, CheckCircle } from "lucide-react"
import { format } from "date-fns"

export const dynamic = 'force-dynamic'

export default async function UserOrdersPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
    const resolvedParams = await searchParams;
    const isSuccess = resolvedParams?.success === 'true'
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect("/login")
    }

    // Fetch user's orders with items
    const { data: orders, error } = await supabase
        .from('tyres_orders')
        .select(`
            *,
            tyres_order_items (
                *,
                tyres_products (
                    brand,
                    model,
                    image_url
                )
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching orders:", error)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'paid': return 'bg-blue-100 text-blue-800'
            case 'shipped': return 'bg-purple-100 text-purple-800'
            case 'completed': return 'bg-green-100 text-green-800'
            case 'cancelled': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="container max-w-4xl mx-auto py-12 px-4">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/account">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-heading font-black text-charcoal-900">MY ORDERS</h1>
            </div>
            <div className="space-y-6">
                {isSuccess && (
                    <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col items-center text-center animate-in fade-in slide-in-from-top-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                            <CheckCircle size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-green-800 mb-2">Order Placed Successfully!</h2>
                        <p className="text-green-700">Thank you for your purchase. We will contact you shortly to confirm details.</p>
                    </div>
                )}
                {!orders || orders.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-500 mb-2">No orders found</h3>
                        <p className="text-gray-400 mb-6">You haven't placed any orders yet.</p>
                        <Link href="/products">
                            <Button className="bg-gold-500 text-black hover:bg-gold-600 font-bold">
                                START SHOPPING
                            </Button>
                        </Link>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            {/* Order Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap gap-4 justify-between items-center text-sm">
                                <div className="flex gap-6">
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase font-bold mb-1">Order Placed</p>
                                        <div className="flex items-center gap-1 font-medium text-gray-700">
                                            <Calendar className="w-3 h-3" />
                                            {format(new Date(order.created_at), 'dd MMM yyyy')}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase font-bold mb-1">Total Amount</p>
                                        <p className="font-bold text-charcoal-900">฿{order.total_price.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase font-bold mb-1">Status</p>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-xs font-mono text-gray-400">
                                    ID: {order.id.slice(0, 8)}...
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <ul className="divide-y divide-gray-100">
                                    {order.tyres_order_items.map((item: any) => (
                                        <li key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center shrink-0 overflow-hidden border border-gray-200">
                                                {item.tyres_products?.image_url ? (
                                                    <img
                                                        src={item.tyres_products.image_url}
                                                        alt={item.tyres_products.model}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Package className="w-8 h-8 text-gray-300" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-charcoal-900">{item.tyres_products?.brand} {item.tyres_products?.model}</h4>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">฿{item.total_price.toLocaleString()}</p>
                                                <p className="text-xs text-gray-500">฿{item.unit_price.toLocaleString()} / unit</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {/* Delivery & Payment Info */}
                                <div className="mt-6 pt-6 border-t border-gray-100 grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                                        <div>
                                            <span className="font-bold text-gray-900">Shipping Address:</span>
                                            <p className="mt-1">{order.shipping_address}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CreditCard className="w-4 h-4 mt-0.5 text-gray-400" />
                                        <div>
                                            <span className="font-bold text-gray-900">Payment Method:</span>
                                            <p className="mt-1 uppercase">{order.payment_method} ({order.delivery_method})</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
