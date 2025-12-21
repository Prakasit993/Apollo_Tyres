"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
    product: any
}

export function ProductGallery({ product }: ProductGalleryProps) {
    // Combine main image and gallery
    const images = [
        product.image_url,
        ...(product.gallery || [])
    ].filter(Boolean)

    const [selectedImage, setSelectedImage] = useState(images[0] || "")

    if (images.length === 0) {
        return (
            <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-300 font-bold text-2xl uppercase">
                {product.brand}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Main View */}
            <div className="aspect-square relative bg-white border border-gray-100 rounded-xl overflow-hidden flex items-center justify-center p-8 group">
                <img
                    src={selectedImage}
                    alt="Product View"
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(img)}
                            className={cn(
                                "w-20 h-20 shrink-0 border-2 rounded-lg bg-white overflow-hidden p-1 transition-all",
                                selectedImage === img ? "border-gold-500 ring-2 ring-gold-200" : "border-transparent hover:border-gray-200"
                            )}
                        >
                            <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
