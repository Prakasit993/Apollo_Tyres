"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Product } from "@/data/products"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/lib/cart-store"
import { Check, ShoppingCart } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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

    const handleAddToCart = () => {
        addToCart({
            id: selectedProduct.id,
            model: selectedProduct.model,
            price: selectedProduct.price,
            imageUrl: (selectedProduct as any).image_url || '',
            brand: selectedProduct.brand,
            specs: `${selectedProduct.width}/${selectedProduct.aspect_ratio} R${selectedProduct.rim}`
        });

        // Show feedback
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    const hasMultipleVariants = variants.length > 1;

    return (
        <div className="group relative bg-white border border-border/50 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full rounded-sm overflow-hidden">

            {/* Top Brand Logo Area (Mock) */}
            <div className="absolute top-4 left-4 z-10">
                <span className="font-extrabold text-charcoal-900/40 text-lg uppercase tracking-widest transition-opacity duration-300 opacity-50 group-hover:opacity-100">
                    {selectedProduct.brand}
                </span>
            </div>

            {/* Image Section - Gold Background Style */}
            <div className={cn("aspect-square relative p-8 flex items-center justify-center overflow-hidden transition-colors", "bg-[#E8C872]")}>
                {/* Brand Logo Watermark effect could go here */}

                {/* Product Image */}
                <div className="relative w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-125 group-hover:-rotate-3 flex items-center justify-center text-charcoal-900/10">
                    {(selectedProduct as any).image_url ? (
                        <img
                            src={(selectedProduct as any).image_url}
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

                {/* Hot/Sale Badge */}
                {selectedProduct.featured && (
                    <div className="absolute top-0 right-0 bg-charcoal-900 text-gold-500 text-xs font-bold px-3 py-1">
                        HOT
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1 gap-2">

                {/* Title */}
                <div className="mb-2">
                    <h3 className="font-black text-lg text-charcoal-900 uppercase leading-tight line-clamp-1">
                        {selectedProduct.brand} {selectedProduct.model}
                    </h3>
                    {!hasMultipleVariants && (
                        <p className="text-muted-foreground text-sm font-medium">
                            {selectedProduct.width}/{(selectedProduct as any).aspectRatio} R{selectedProduct.rim}
                        </p>
                    )}
                </div>

                {/* Size Selector (If multiple variants) */}
                {hasMultipleVariants && (
                    <div className="mb-3">
                        <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1 block">
                            Select Size
                        </label>
                        <Select
                            value={selectedProduct.id}
                            onValueChange={(id) => {
                                const p = variants.find(v => v.id === id)
                                if (p) setSelectedProduct(p)
                            }}
                        >
                            <SelectTrigger className="w-full h-8 text-xs font-medium">
                                <SelectValue placeholder="Select Size" />
                            </SelectTrigger>
                            <SelectContent>
                                {variants.map(v => (
                                    <SelectItem key={v.id} value={v.id} className="text-xs">
                                        {v.width}/{v.aspect_ratio} R{v.rim} - {v.price.toLocaleString()} THB
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Price and Stock */}
                <div className="mt-auto flex items-end justify-between border-t border-border pt-3">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                            {hasMultipleVariants ? 'Starts at' : 'Per Unit'}
                        </p>
                        <p className="text-xl font-black text-charcoal-900">
                            {selectedProduct.price.toLocaleString()} THB
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3">
                    <Button
                        onClick={handleAddToCart}
                        className={cn(
                            "flex-1 font-bold rounded-full h-9 text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all duration-300",
                            isAdded
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-gold-600 hover:bg-gold-700 text-white"
                        )}
                        disabled={isAdded}
                    >
                        {isAdded ? (
                            <span className="flex items-center gap-2">
                                <Check className="w-4 h-4" /> ADDED
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4" /> ADD TO CART
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
