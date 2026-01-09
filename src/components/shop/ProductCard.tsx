"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Product } from "@/data/products"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/lib/cart-store"
import { Check, ShoppingCart } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase"

interface ProductCardProps {
    variants: Product[]
}

export function ProductCard({ variants }: ProductCardProps) {
    const addToCart = useCartStore((state) => state.addToCart)
    const [isAdded, setIsAdded] = useState(false)

    // Default to the first variant
    const [selectedProduct, setSelectedProduct] = useState<Product>(variants[0])

    // Update selected product when variants prop changes (e.g. searching)
    useEffect(() => {
        setSelectedProduct(variants[0])
    }, [variants])

    const handleAddToCart = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            alert('กรุณาล็อกอินก่อนเพิ่มสินค้าลงตะกร้า')
            window.location.href = '/login'
            return
        }

        // Determine quantity to add based on promo_min_quantity

        const quantityToAdd = (selectedProduct.promo_min_quantity && selectedProduct.promo_min_quantity > 1)
            ? selectedProduct.promo_min_quantity
            : 1

        // Logic to handle Bundle Price (e.g. 14,000 for 4 tires)
        // If promo_price > price AND min_qty > 1, assume it's a bundle price
        let promoUnitPrice = selectedProduct.promotional_price
        let isBundlePrice = false

        if (selectedProduct.promotional_price &&
            selectedProduct.promo_min_quantity &&
            selectedProduct.promo_min_quantity > 1 &&
            selectedProduct.promotional_price > selectedProduct.price) {

            promoUnitPrice = selectedProduct.promotional_price / selectedProduct.promo_min_quantity
            isBundlePrice = true
        }

        // Use promotional price ONLY if it's valid (lower than regular price per unit)
        const hasValidPromo = promoUnitPrice &&
            promoUnitPrice > 0 &&
            promoUnitPrice < selectedProduct.price

        const effectivePrice = hasValidPromo
            ? promoUnitPrice!
            : selectedProduct.price

        await addToCart({
            id: selectedProduct.id,
            model: selectedProduct.model,
            price: effectivePrice, // Always pass UNIT price to cart
            imageUrl: (selectedProduct as any).image_url || '',
            brand: selectedProduct.brand,
            specs: `${selectedProduct.width}/${selectedProduct.aspect_ratio} R${selectedProduct.rim}`
        }, quantityToAdd); // Pass quantity as second parameter

        // Show feedback with quantity info  
        // If it's a bundle promo, show the bundle price in the messsage
        const displayTotal = isBundlePrice ? selectedProduct.promotional_price : (effectivePrice * quantityToAdd)

        const message = hasValidPromo && quantityToAdd > 1
            ? `เพิ่ม ${quantityToAdd} เส้นลงตะกร้าแล้ว (ราคาโปร ${displayTotal?.toLocaleString()} บาท)`
            : quantityToAdd > 1
                ? `เพิ่ม ${quantityToAdd} เส้นลงตะกร้าแล้ว`
                : 'เพิ่มสินค้าลงตะกร้าแล้ว'

        alert(message)

        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    const hasMultipleVariants = variants.length > 1;

    return (
        <div className="group relative bg-neutral-800 border border-neutral-700 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full rounded-sm overflow-hidden">

            {/* Top Brand Logo Area (Mock) */}
            <div className="absolute top-4 left-4 z-10">
                <span className="font-extrabold text-white/20 text-lg uppercase tracking-widest transition-opacity duration-300 opacity-50 group-hover:opacity-100">
                    {selectedProduct.brand}
                </span>
            </div>

            {/* Image Section - Light Background for Contrast */}
            <Link href={`/products/${(selectedProduct as any).slug || selectedProduct.id}`} className="block relative aspect-square p-8 flex items-center justify-center overflow-hidden transition-colors bg-white cursor-pointer">
                {/* Brand Logo Watermark effect could go here */}

                {/* Product Image */}
                <div className="relative w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-125 group-hover:-rotate-3 flex items-center justify-center text-charcoal-900/10">
                    {((selectedProduct as any).image_url || (selectedProduct as any).gallery?.[0]) ? (
                        <img
                            src={(selectedProduct as any).image_url || (selectedProduct as any).gallery?.[0]}
                            alt={`${selectedProduct.brand} ${selectedProduct.model}`}
                            className="object-contain w-full h-full drop-shadow-md group-hover:drop-shadow-2xl transition-all duration-500"
                            loading="lazy"
                        />
                    ) : (
                        <div className="text-center font-black uppercase text-2xl opacity-20">
                            {selectedProduct.brand}
                        </div>
                    )}
                </div>

                {/* Promotional Badge or Min Quantity Message */}
                {/* Promotional Badge or Min Quantity Message */}
                {(() => {
                    const minQty = selectedProduct.promo_min_quantity || 1
                    let promoUnitPrice = selectedProduct.promotional_price
                    let isBundlePrice = false

                    // Detect Bundle Price logic
                    if (selectedProduct.promotional_price && minQty > 1 && selectedProduct.promotional_price > selectedProduct.price) {
                        promoUnitPrice = selectedProduct.promotional_price / minQty
                        isBundlePrice = true
                    }

                    const hasValidPromo = promoUnitPrice && promoUnitPrice > 0 && promoUnitPrice < selectedProduct.price

                    if (!hasValidPromo || !selectedProduct.promotional_price) return null;

                    // Calculate total bundle price for display
                    const totalBundlePrice = isBundlePrice
                        ? selectedProduct.promotional_price
                        : selectedProduct.promotional_price * minQty

                    return minQty > 1 ? (
                        // Show minimum quantity requirement
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] font-extrabold px-2 py-1 shadow-lg rounded-bl-lg">
                            ซื้อครบ {minQty} เส้น<br />
                            ราคา {totalBundlePrice.toLocaleString()} บาท
                        </div>
                    ) : (
                        // Show discount percentage (min qty = 1, applies immediately)
                        <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 shadow-lg">
                            ลด {Math.round((1 - promoUnitPrice! / selectedProduct.price) * 100)}%
                        </div>
                    )
                })()}

                {/* Featured/Promo Badge (only if no promo price badge shown) */}
                {!selectedProduct.promotional_price && selectedProduct.featured && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold px-3 py-1 shadow-lg">
                        🔥 โปรโมชั่น
                    </div>
                )}
            </Link>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1 gap-2">

                {/* Title */}
                <div className="mb-2">
                    <Link href={`/products/${(selectedProduct as any).slug || selectedProduct.id}`} className="hover:text-blue-400 transition-colors">
                        <h3 className="font-black text-lg text-white uppercase leading-tight line-clamp-1">
                            {selectedProduct.brand} {selectedProduct.model}
                        </h3>
                    </Link>
                    {!hasMultipleVariants && (
                        <p className="text-gray-400 text-sm font-medium">
                            {selectedProduct.width}/{(selectedProduct as any).aspectRatio} R{selectedProduct.rim}
                        </p>
                    )}
                </div>

                {/* Size Selector (If multiple variants) */}
                {hasMultipleVariants && (
                    <div className="mb-3">
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">
                            เลือกขนาด
                        </label>
                        <Select
                            value={selectedProduct.id}
                            onValueChange={(id) => {
                                const p = variants.find(v => v.id === id)
                                if (p) setSelectedProduct(p)
                            }}
                        >
                            <SelectTrigger className="w-full h-8 text-xs font-medium bg-neutral-700 text-white border-neutral-600">
                                <SelectValue placeholder="เลือกขนาด" />
                            </SelectTrigger>
                            <SelectContent>
                                {variants.map(v => (
                                    <SelectItem key={v.id} value={v.id} className="text-xs text-gray-900">
                                        {v.width}/{v.aspect_ratio} R{v.rim} -
                                        {v.promotional_price && v.promotional_price > 0 && v.promotional_price < v.price ? (
                                            <>
                                                <span className="line-through text-gray-500 font-medium">{v.price.toLocaleString()}</span>
                                                {' '}
                                                <span className="text-red-600 font-extrabold">{v.promotional_price.toLocaleString()}</span> บาท
                                            </>
                                        ) : (
                                            <>{v.price.toLocaleString()} บาท</>
                                        )}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Price and Stock */}
                <div className="mt-auto flex items-end justify-between border-t border-neutral-700 pt-3">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                            {hasMultipleVariants ? 'เริ่มต้น' : 'ราคาต่อเส้น'}
                        </p>
                        {selectedProduct.promotional_price &&
                            selectedProduct.promotional_price > 0 &&
                            selectedProduct.promotional_price < selectedProduct.price ? ( // Only show if actually cheaper
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-gray-400 line-through font-medium">
                                    {selectedProduct.price.toLocaleString()} บาท
                                </p>
                                <p className="text-2xl font-black text-red-600">
                                    {selectedProduct.promotional_price.toLocaleString()} บาท
                                </p>
                            </div>
                        ) : (
                            <p className="text-xl font-black text-white">
                                {selectedProduct.price.toLocaleString()} บาท
                            </p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 min-h-[36px]">
                    {selectedProduct.stock > 0 ? (
                        <Button
                            onClick={handleAddToCart}
                            className={cn(
                                "flex-1 font-bold rounded-full h-9 text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all duration-300",
                                isAdded
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                            )}
                            disabled={isAdded}
                        >
                            {isAdded ? (
                                <span className="flex items-center gap-2">
                                    <Check className="w-4 h-4" /> เพิ่มแล้ว
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <ShoppingCart className="w-4 h-4" /> เพิ่มใส่ตะกร้า
                                </span>
                            )}
                        </Button>
                    ) : (
                        <div className="flex-1 h-9 flex items-center justify-center text-xs font-bold text-gray-600 uppercase bg-neutral-900 rounded-full cursor-not-allowed">
                            สินค้าหมด
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
