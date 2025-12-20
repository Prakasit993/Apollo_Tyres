'use client'

import { useState, useTransition } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr" // Use browser client for upload
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { upsertProduct } from "./actions"

interface ProductFormProps {
    product?: any
}

export function ProductForm({ product }: ProductFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [uploading, setUploading] = useState(false)
    const [imageUrl, setImageUrl] = useState(product?.image_url || "")

    // Client-side Supabase for Storage Upload
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return

        setUploading(true)
        const file = e.target.files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        try {
            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // Get Public URL
            const { data } = supabase.storage
                .from('products')
                .getPublicUrl(filePath)

            setImageUrl(data.publicUrl)
        } catch (error: any) {
            alert('Error uploading image: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    async function handleSubmit(formData: FormData) {
        // Append image URL
        formData.set('imageUrl', imageUrl)
        if (product?.id) {
            formData.set('id', product.id)
        }

        startTransition(async () => {
            const result = await upsertProduct(null, formData)
            if (result?.success) {
                router.push('/admin/products')
            } else {
                alert(result?.message || "Failed to save")
            }
        })
    }

    return (
        <form action={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Brand & Model */}
                <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" name="brand" defaultValue={product?.brand} required placeholder="e.g. Apollo" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" name="model" defaultValue={product?.model} required placeholder="e.g. Alnac 4G" />
                </div>

                {/* Specs */}
                <div className="space-y-2">
                    <Label htmlFor="width">Width (mm)</Label>
                    <Input id="width" name="width" type="number" defaultValue={product?.width} required placeholder="e.g. 195" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="aspectRatio">Aspect Ratio (%)</Label>
                    <Input id="aspectRatio" name="aspectRatio" type="number" defaultValue={product?.aspect_ratio} required placeholder="e.g. 55" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="rim">Rim (inch)</Label>
                    <Input id="rim" name="rim" type="number" defaultValue={product?.rim} required placeholder="e.g. 15" />
                </div>

                {/* Price & Stock */}
                <div className="space-y-2">
                    <Label htmlFor="price">Price (THB)</Label>
                    <Input id="price" name="price" type="number" step="0.01" defaultValue={product?.price} required placeholder="e.g. 2500" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input id="stock" name="stock" type="number" defaultValue={product?.stock || 0} required />
                </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
                <Label>Product Image</Label>
                <div className="flex items-center gap-4">
                    <div className="relative w-32 h-32 bg-gray-100 rounded border border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                        {imageUrl ? (
                            <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                        ) : (
                            <span className="text-gray-400 text-xs">No Image</span>
                        )}
                    </div>
                    <div className="flex-1">
                        <Input type="file" onChange={handleImageUpload} disabled={uploading} accept="image/*" />
                        <p className="text-xs text-gray-500 mt-1">
                            {uploading ? 'Uploading...' : 'Upload a product image (PNG, JPG)'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" className="bg-gold-500 text-charcoal-900 hover:bg-gold-600 font-bold" disabled={isPending || uploading}>
                    {isPending ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
                </Button>
            </div>
        </form>
    )
}
