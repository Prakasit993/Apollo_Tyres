'use client'

import { useState, Fragment } from "react"
import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import { updateOrderStatus, deleteOrder } from "./actions"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function OrderTable({ initialOrders }: { initialOrders: any[] }) {
    const [orders, setOrders] = useState(initialOrders || [])
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

    const toggleExpand = (id: string) => {
        setExpandedOrderId(expandedOrderId === id ? null : id)
    }

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        const result = await updateOrderStatus(orderId, newStatus)
        if (result.success) {
            // Optimistic update
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
        } else {
            alert("Failed to update status")
        }
    }

    const handleDelete = async (orderId: string) => {
        if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) return

        const result = await deleteOrder(orderId)
        if (result.success) {
            setOrders(orders.filter(o => o.id !== orderId))
            if (expandedOrderId === orderId) setExpandedOrderId(null)
        } else {
            alert(result.message || "Failed to delete order")
        }
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
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-medium">
                    <tr>
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => (
                        <Fragment key={order.id}>
                            <tr className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toggleExpand(order.id)}>
                                <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                    {order.id.slice(0, 8)}...
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900">{order.profiles?.full_name || 'Guest'}</div>
                                    <div className="text-gray-500 text-xs">{order.profiles?.phone}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {format(new Date(order.created_at), 'dd MMM yyyy')}
                                </td>
                                <td className="px-6 py-4 font-bold text-charcoal-900">
                                    ฿{order.total_price.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium uppercase ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center gap-2">
                                        <Select
                                            defaultValue={order.status}
                                            onValueChange={(val: string) => handleStatusChange(order.id, val)}
                                        >
                                            <SelectTrigger className="w-[130px] h-8 text-xs bg-white border-gray-200">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending" className="text-gray-900 cursor-pointer hover:bg-gray-100">Pending</SelectItem>
                                                <SelectItem value="paid" className="text-gray-900 cursor-pointer hover:bg-gray-100">Paid</SelectItem>
                                                <SelectItem value="shipped" className="text-gray-900 cursor-pointer hover:bg-gray-100">Shipped</SelectItem>
                                                <SelectItem value="completed" className="text-gray-900 cursor-pointer hover:bg-gray-100">Completed</SelectItem>
                                                <SelectItem value="cancelled" className="text-gray-900 cursor-pointer hover:bg-gray-100">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDelete(order.id)
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                            {/* Expanded Details Row */}
                            {expandedOrderId === order.id && (
                                <tr className="bg-gray-50/50">
                                    <td colSpan={6} className="px-6 py-4">
                                        <div className="bg-white rounded border border-gray-200 p-4">
                                            <h4 className="font-bold text-sm mb-3 text-gray-700">Order Items</h4>
                                            <ul className="space-y-2 mb-4">
                                                {order.order_items.map((item: any) => (
                                                    <li key={item.id} className="flex justify-between text-sm">
                                                        <span>
                                                            <span className="font-medium text-charcoal-900">{item.products?.brand} {item.products?.model}</span>
                                                            <span className="text-gray-500 ml-2">x {item.quantity}</span>
                                                        </span>
                                                        <span>฿{item.total_price.toLocaleString()}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="border-t border-gray-100 pt-3 flex justify-between text-xs text-gray-500">
                                                <div>
                                                    <p>Shipping Address:</p>
                                                    <p className="font-medium text-gray-700">{order.shipping_address}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p>Payment Method:</p>
                                                    <p className="font-medium text-gray-700 uppercase">{order.payment_method}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
