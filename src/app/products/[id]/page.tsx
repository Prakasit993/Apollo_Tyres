import { getProduct, getProductVariants } from "@/app/products/actions"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { AddToCartButton } from "@/components/shop/AddToCartButton"
import { ProductGallery } from "@/components/shop/ProductGallery"
import { cn } from "@/lib/utils"

export const dynamic = 'force-dynamic'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const product = await getProduct(id)

    if (!product) {
        notFound()
    }

    const variants = await getProductVariants(product.brand, product.model)

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Gallery Section */}
                <div>
                    <ProductGallery product={product} />
                </div>

                {/* Info Section */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-sm font-bold text-gold-500 uppercase tracking-wider mb-2">{product.brand}</h2>
                        <h1 className="text-4xl font-black text-charcoal-900 uppercase leading-none">{product.model}</h1>
                    </div>

                    {/* Size Selector */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <span className="text-gray-400 uppercase text-xs font-bold block mb-3">Select Size</span>
                        <div className="flex flex-wrap gap-2">
                            {variants.map((variant: any) => {
                                const isActive = variant.id === product.id
                                return (
                                    <Link
                                        key={variant.id}
                                        href={`/products/${variant.slug || variant.id}`}
                                        className={cn(
                                            "px-4 py-2 text-sm font-bold rounded-md border transition-all",
                                            isActive
                                                ? "bg-charcoal-900 text-white border-charcoal-900 shadow-md"
                                                : "bg-white text-gray-700 border-gray-200 hover:border-gold-500 hover:text-gold-600"
                                        )}
                                    >
                                        {variant.width}/{variant.aspect_ratio} R{variant.rim}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <p className="text-3xl font-black text-charcoal-900 mb-6">
                            ฿{product.price.toLocaleString()}
                            <span className="text-sm text-gray-400 font-medium ml-2 align-middle">/ unit</span>
                        </p>

                        <AddToCartButton product={product} />
                    </div>

                    <div className="prose prose-sm text-gray-500 pt-6">
                        <h3 className="text-charcoal-900 font-bold uppercase text-sm mb-2">Description</h3>
                        <p className="whitespace-pre-wrap">
                            {product.description || `High-quality ${product.brand} tire designed for performance and durability. Model ${product.model} offers excellent grip and stability on the road.`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
