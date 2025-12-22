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
        <div className="container mx-auto px-4 py-12 max-w-7xl bg-neutral-900 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Gallery Section */}
                <div>
                    <ProductGallery product={product} />
                </div>

                {/* Info Section */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-sm font-bold text-blue-500 uppercase tracking-wider mb-2">{product.brand}</h2>
                        <h1 className="text-4xl font-black text-white uppercase leading-none">{product.model}</h1>
                    </div>

                    {/* Size Selector */}
                    <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
                        <span className="text-gray-400 uppercase text-xs font-bold block mb-3">เลือกขนาด</span>
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
                                                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                                : "bg-neutral-700 text-gray-300 border-neutral-600 hover:border-blue-500 hover:text-blue-400"
                                        )}
                                    >
                                        {variant.width}/{variant.aspect_ratio} R{variant.rim}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-neutral-700">
                        <p className="text-3xl font-black text-white mb-6">
                            ฿{product.price.toLocaleString()}
                            <span className="text-sm text-gray-400 font-medium ml-2 align-middle">/ เส้น</span>
                        </p>

                        <AddToCartButton product={product} />
                    </div>

                    <div className="prose prose-sm prose-invert text-gray-400 pt-6">
                        <h3 className="text-white font-bold uppercase text-sm mb-2">รายละเอียดสินค้า</h3>
                        <p className="whitespace-pre-wrap">
                            {product.description || `ยางรถยนต์ ${product.brand} คุณภาพสูง ออกแบบมาเพื่อประสิทธิภาพและความทนทาน รุ่น ${product.model} ให้การยึดเกาะถนนที่ดีเยี่ยมและการทรงตัวที่มั่นคง`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
