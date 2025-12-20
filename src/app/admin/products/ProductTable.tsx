'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"
import { deleteProduct } from "./actions"
import { Button } from "@/components/ui/button"

interface Product {
    id: string
    brand: string
    model: string
    price: number
    stock: number
    image_url: string | null
    width: number
    aspect_ratio: number
    rim: number
}

export function ProductTable({ initialProducts }: { initialProducts: any[] }) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this product?")) return

        setIsDeleting(id)
        const result = await deleteProduct(id)
        setIsDeleting(null)

        if (result.message && !result.success) {
            alert(result.message)
        }
    }

    if (initialProducts.length === 0) {
        return (
            <div className="p-12 text-center text-gray-400">
                No products found. Start by adding one!
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-medium">
                    <tr>
                        <th className="px-6 py-4">Image</th>
                        <th className="px-6 py-4">Details</th>
                        <th className="px-6 py-4">Specs</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Stock</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {initialProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="h-12 w-12 relative bg-gray-100 rounded overflow-hidden border border-gray-200">
                                    {product.image_url ? (
                                        <Image
                                            src={product.image_url}
                                            alt={product.model}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-300 text-xs">No Img</div>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-bold text-gray-900">{product.brand}</div>
                                <div className="text-gray-500">{product.model}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {product.width}/{product.aspect_ratio} R{product.rim}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-medium text-charcoal-900">
                                ฿{product.price.toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Link href={`/admin/products/${product.id}/edit`}>
                                        <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-gold-100 hover:text-gold-600 border-gray-200">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-red-100 hover:text-red-600 border-gray-200"
                                        onClick={() => handleDelete(product.id)}
                                        disabled={isDeleting === product.id}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
