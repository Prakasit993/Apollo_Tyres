"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"
import { useEffect, useState } from "react"

export function CartButton() {
    // Prevent hydration mismatch by waiting for mount
    const [mounted, setMounted] = useState(false)
    const totalItems = useCartStore((state) => state.getTotalItems())

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
            </Button>
        )
    }

    return (
        <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-black animate-in zoom-in">
                        {totalItems}
                    </span>
                )}
                <span className="sr-only">Cart</span>
            </Button>
        </Link>
    )
}
