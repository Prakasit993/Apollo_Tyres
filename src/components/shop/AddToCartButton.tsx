"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"
import { createClient } from "@/lib/supabase"
import { Check, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

export function AddToCartButton({ product }: { product: any }) {
    const addToCart = useCartStore((state) => state.addToCart)
    const [isAdded, setIsAdded] = useState(false)

    const handleAddToCart = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            alert("กรุณาล็อคอิน")
            return
        }

        addToCart({
            id: product.id,
            model: product.model,
            price: product.price,
            imageUrl: product.image_url || '',
            brand: product.brand,
            specs: `${product.width}/${product.aspect_ratio} R${product.rim}`
        });

        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    if (product.stock <= 0) {
        return null
    }

    return (
        <Button
            onClick={handleAddToCart}
            size="lg"
            className={cn(
                "w-full font-black text-lg h-14 uppercase tracking-widest shadow-lg transition-all",
                isAdded
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-charcoal-900 hover:bg-gold-500 hover:text-charcoal-900 text-white"
            )}
            disabled={isAdded || product.stock <= 0}
        >
            {isAdded ? (
                <span className="flex items-center gap-3">
                    <Check className="w-6 h-6" /> เพิ่มเรียบร้อย
                </span>
            ) : (
                <span className="flex items-center gap-3">
                    <ShoppingCart className="w-6 h-6" /> เพิ่มใส่ตะกร้า
                </span>
            )}
        </Button>
    )
}
