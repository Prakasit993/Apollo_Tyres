import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, Calendar, MapPin, CreditCard, ShoppingBag, Clock, CheckCircle } from "lucide-react"
import { format } from "date-fns"

export const dynamic = 'force-dynamic'

export default async function OrderDetailPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ success?: string }> }) {
    const { id } = await params
    const resolvedSearchParams = await searchParams
    const isSuccess = resolvedSearchParams?.success === 'true'
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect("/login")
    }

    const { data: order, error } = await supabase
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
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (error || !order) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold text-gray-400">Order not found</h1>
                <Link href="/account/orders" className="text-blue-600 mt-4 inline-block hover:underline">
                    Back to My Orders
                </Link>
            </div>
        )
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

    const steps = [
        { status: 'pending', label: 'Order Placed', icon: ShoppingBag },
        { status: 'paid', label: 'Payment Confirmed', icon: CreditCard },
        { status: 'shipped', label: 'Shipped', icon: Package },
        { status: 'completed', label: 'Delivered', icon: CheckCircle },
    ]

    const currentStepIndex = steps.findIndex(s => s.status === order.status)
    // If pending, index 0. If paid, index 1. 

    return (
        <div className="container max-w-4xl mx-auto py-12 px-4">
            <Link href="/account/orders" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to My Orders
            </Link>

            {/* Main "Paper" Container */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">

                {/* Success Banner (Conditional) */}
                {isSuccess && (
                    <div className="bg-green-50 border-b border-green-100 p-8 flex flex-col items-center justify-center text-center space-y-3">
                        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2 shadow-sm">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-green-800">Order Placed Successfully</h2>
                        <p className="text-green-700 max-w-md mx-auto">Thank you for your purchase. Your order has been received and is being processed.</p>
                    </div>
                )}

                <div className="p-8 md:p-12">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 mb-8 gap-6">
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Order Details</p>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">#{order.id.slice(0, 8)}...</h1>
                            <p className="text-gray-500 mt-2 text-sm flex items-center gap-2 font-medium">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(order.created_at), 'dd MMM yyyy, HH:mm')}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <div className={`px-5 py-2 rounded-full font-bold text-sm uppercase tracking-wide flex items-center gap-2 shadow-sm ${getStatusColor(order.status)}`}>
                                <div className="w-2 h-2 rounded-full bg-current opacity-50" />
                                {order.status}
                            </div>
                            {order.status === 'pending' && (
                                <span className="text-xs text-yellow-600 font-bold bg-yellow-50 px-3 py-1.5 rounded-md border border-yellow-100">
                                    Waiting for Payment Verification
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Order Items Table Look */}
                    <div className="mb-12">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-gray-400" />
                            Order Items
                        </h3>
                        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4">Product</th>
                                        <th className="px-6 py-4 text-center">Qty</th>
                                        <th className="px-6 py-4 text-right">Price</th>
                                        <th className="px-6 py-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {order.tyres_order_items.map((item: any) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                                                        {item.tyres_products?.image_url ? (
                                                            <img src={item.tyres_products.image_url} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full text-gray-300">
                                                                <Package className="w-6 h-6" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{item.tyres_products?.brand} {item.tyres_products?.model}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center font-medium">x{item.quantity}</td>
                                            <td className="px-6 py-4 text-right">฿{item.unit_price.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right font-bold text-gray-900">฿{item.total_price.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50 border-t border-gray-200">
                                    <tr>
                                        <td colSpan={3} className="px-6 py-5 text-right font-bold text-gray-900 uppercase text-xs tracking-wider">Grand Total</td>
                                        <td className="px-6 py-5 text-right font-black text-2xl text-blue-600">฿{order.total_price.toLocaleString()}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                Shipping Information
                            </h3>
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 h-full">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line font-medium text-sm md:text-base">
                                    {order.shipping_address}
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-gray-400" />
                                Payment & Delivery
                            </h3>
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4 h-full">
                                <div className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                                    <span className="text-gray-500 text-sm">Payment Method</span>
                                    <span className="font-bold text-gray-900 uppercase bg-white px-3 py-1 rounded-md border border-gray-200 text-xs shadow-sm">
                                        {order.payment_method}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                                    <span className="text-gray-500 text-sm">Delivery Method</span>
                                    <span className="font-bold text-gray-900 uppercase bg-white px-3 py-1 rounded-md border border-gray-200 text-xs shadow-sm">
                                        {order.delivery_method}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
