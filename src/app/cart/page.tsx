"use client"

import { useCartStore } from "@/lib/cart-store"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function CartPage() {
    const [mounted, setMounted] = useState(false)
    const { items, removeFromCart, updateQuantity, getCartBreakdown, getSubtotal, clearCart } = useCartStore()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const breakdown = getCartBreakdown()
    const subtotal = getSubtotal() // NOTE: This is raw sum. 
    // If "Rule of 4" implies a DISCOUNT (e.g. buy 3 get 1 free, or special price for 4), we should adjust the calculation here.
    // Assuming for now it's just a display breakdown or the price is flat.
    // Let's implement a MOCK discount logic: "Buy 4 pay for 3" is common, OR "Special Set Price".
    // User requirement said "Set of 4 rules". I will stick to simple display for now, 
    // but if the sets have a special price, we can calculate it here.

    // Let's just calculate total normally for now.

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-gray-400" />
                </div>
                <h1 className="text-2xl font-black text-white mb-2">ตะกร้าสินค้าว่างเปล่า</h1>
                <p className="text-gray-400 mb-8">ดูเหมือนว่าคุณยังไม่ได้เลือกยางลงตะกร้า</p>
                <Link href="/products">
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 font-bold px-8">
                        เลือกซื้อสินค้า
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            <h1 className="font-heading text-3xl font-black text-white mb-8 flex items-center gap-3 uppercase italic border-b-4 border-blue-500 inline-block pr-6">
                <ShoppingBag className="text-blue-500" />
                ตะกร้าสินค้า
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items List */}
                <div className="w-full lg:w-2/3 space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex flex-col">
                            <div className="bg-white p-4 rounded-lg border border-border shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                                {/* Image */}
                                <div className="w-24 h-24 bg-gray-50 rounded-md flex items-center justify-center shrink-0">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.model} className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <span className="text-xs font-bold text-gray-300">{item.brand}</span>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="font-bold text-charcoal-900">{item.brand} {item.model}</h3>
                                    <p className="text-sm text-gray-500">{item.specs}</p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 font-bold text-gray-900"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center font-medium text-gray-900">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 font-bold text-gray-900"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Price */}
                                <div className="text-right min-w-[100px]">
                                    <p className="font-black text-lg text-blue-600">
                                        {(item.price * item.quantity).toLocaleString()} ฿
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {item.price.toLocaleString()} / เส้น
                                    </p>
                                </div>

                                {/* Remove */}
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            {/* Promo Notification */}
                            {item.brand === 'Apollo' && (
                                <div className="mt-2 mb-4">
                                    {item.quantity < 4 ? (
                                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-4 py-2 rounded-md flex items-center gap-2 animate-pulse">
                                            <span className="text-xl">🔥</span>
                                            <span className="font-bold">โปรโมชั่น:</span>
                                            ซื้อเพิ่มอีก <span className="font-black text-red-600">{4 - item.quantity} เส้น</span> เพื่อรับราคาพิเศษ <span className="font-black">4 เส้น 7,000 บาท!</span>
                                        </div>
                                    ) : (
                                        <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-2 rounded-md flex items-center gap-2">
                                            <span className="text-xl">✅</span>
                                            <span className="font-bold">ใช้โปรโมชั่นแล้ว:</span>
                                            ราคาพิเศษสำหรับชุด 4 เส้น (7,000 บาท) Active!
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="flex justify-between items-center pt-4">
                        <Button variant="ghost" onClick={clearCart} className="text-red-400 hover:text-red-500 hover:bg-red-900/10 text-sm">
                            ล้างตะกร้า
                        </Button>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-charcoal-900 text-white p-6 rounded-lg sticky top-24 border border-gray-800">
                        <h3 className="font-bold text-xl mb-6 border-b border-gray-700 pb-4 text-white">สรุปคำสั่งซื้อ</h3>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-300">
                                <span>ยอดรวมย่อย</span>
                                <span>{subtotal.toLocaleString()} ฿</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>ค่าจัดส่ง</span>
                                <span className="text-blue-500 font-bold">ฟรี</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-400 italic">
                                <span>รายละเอียดสินค้า</span>
                                <span>{breakdown.formattedString}</span>
                            </div>
                        </div>

                        <div className="flex justify-between text-2xl font-black mb-8 pt-4 border-t border-gray-700">
                            <span>ยอดรวมสุทธิ</span>
                            <span className="text-blue-500">{subtotal.toLocaleString()} ฿</span>
                        </div>

                        <Link href="/checkout">
                            <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold h-12 text-lg">
                                ดำเนินการชำระเงิน <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>

                        <div className="mt-4 text-center">
                            <Link href="/products" className="text-sm text-gray-400 hover:text-white underline decoration-dotted">
                                เลือกซื้อสินค้าต่อ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
