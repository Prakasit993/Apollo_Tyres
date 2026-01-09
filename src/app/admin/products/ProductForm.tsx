'use client'

import { useState, useTransition } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr" // Use browser client for upload
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus } from "lucide-react"
import { upsertProduct } from "./actions"

interface ProductFormProps {
    product?: any
}

export function ProductForm({ product }: ProductFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [uploading, setUploading] = useState(false)
    const [imageUrl, setImageUrl] = useState(product?.image_url || "")
    const [gallery, setGallery] = useState<string[]>(product?.gallery || [])

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

            const { data } = supabase.storage
                .from('products')
                .getPublicUrl(filePath)

            setImageUrl(data.publicUrl)
        } catch (error: any) {
            alert('เกิดข้อผิดพลาดในการอัปโหลดรูป: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return

        setUploading(true)
        const files = Array.from(e.target.files)
        const newUrls: string[] = []

        try {
            for (const file of files) {
                const fileExt = file.name.split('.').pop()
                const fileName = `gallery/${Date.now()}-${Math.random()}.${fileExt}`
                const filePath = `${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(filePath, file)

                if (uploadError) throw uploadError

                const { data } = supabase.storage
                    .from('products')
                    .getPublicUrl(filePath)

                newUrls.push(data.publicUrl)
            }

            setGallery(prev => [...prev, ...newUrls])
        } catch (error: any) {
            alert('เกิดข้อผิดพลาดในการอัปโหลดรูปแกลเลอรี: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleRemoveGalleryImage = (index: number) => {
        setGallery(prev => prev.filter((_, i) => i !== index))
    }

    async function handleSubmit(formData: FormData) {
        // Append image URL
        formData.set('imageUrl', imageUrl)
        formData.set('gallery', JSON.stringify(gallery)) // Send gallery as JSON string

        if (product?.id) {
            formData.set('id', product.id)
        }

        startTransition(async () => {
            const result = await upsertProduct(null, formData)
            if (result?.success) {
                router.push('/admin/products')
            } else {
                alert(result?.message || "บันทึกไม่สำเร็จ")
            }
        })
    }

    return (
        <form action={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Brand & Model */}
                <div className="space-y-2">
                    <Label htmlFor="brand" className="text-charcoal-900">ยี่ห้อ (Brand)</Label>
                    <Input id="brand" name="brand" defaultValue={product?.brand} required placeholder="เช่น Apollo" className="bg-white text-gray-900 border-gray-300" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="model" className="text-charcoal-900">รุ่น (Model)</Label>
                    <Input id="model" name="model" defaultValue={product?.model} required placeholder="เช่น Alnac 4G" className="bg-white text-gray-900 border-gray-300" />
                </div>

                {/* Slug (Seo) */}
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="slug" className="text-charcoal-900">URL Slug (สำหรับ SEO)</Label>
                    <Input id="slug" name="slug" defaultValue={product?.slug} placeholder="สร้างอัตโนมัติ เช่น apollo-alnac-4g-195-55-15" className="bg-white text-gray-900 border-gray-300" />
                    <p className="text-xs text-gray-500">เว้นว่างไว้เพื่อสร้างอัตโนมัติ (ต้องไม่ซ้ำกัน)</p>
                </div>

                {/* Specs */}
                <div className="space-y-2">
                    <Label htmlFor="width" className="text-charcoal-900">หน้ายาง (มม.)</Label>
                    <Input id="width" name="width" type="number" defaultValue={product?.width} required placeholder="เช่น 195" className="bg-white text-gray-900 border-gray-300" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="aspectRatio" className="text-charcoal-900">แก้มยาง (%)</Label>
                    <Input id="aspectRatio" name="aspectRatio" type="number" defaultValue={product?.aspect_ratio} required placeholder="เช่น 55" className="bg-white text-gray-900 border-gray-300" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="rim" className="text-charcoal-900">ขอบล้อ (นิ้ว)</Label>
                    <Input id="rim" name="rim" type="number" defaultValue={product?.rim} required placeholder="เช่น 15" className="bg-white text-gray-900 border-gray-300" />
                </div>

                {/* Price & Stock */}
                <div className="space-y-2">
                    <Label htmlFor="price" className="text-charcoal-900">ราคา (บาท)</Label>
                    <Input id="price" name="price" type="number" step="0.01" defaultValue={product?.price} required placeholder="เช่น 2500" className="bg-white text-gray-900 border-gray-300" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="promotionalPrice" className="text-charcoal-900">ราคาโปรโมชั่น (บาท) - ไม่บังคับ</Label>
                    <Input id="promotionalPrice" name="promotionalPrice" type="number" step="0.01" defaultValue={product?.promotional_price} placeholder="เช่น 2000" className="bg-white text-gray-900 border-gray-300" />
                    <p className="text-xs text-gray-500">เว้นว่างไว้ถ้าไม่มีโปรโมชั่น หรือกรอก 0 เพื่อลบโปรโมชั่น</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="promoMinQuantity" className="text-charcoal-900">จำนวนขั้นต่ำสำหรับโปร (เส้น)</Label>
                    <Input id="promoMinQuantity" name="promoMinQuantity" type="number" min="1" defaultValue={product?.promo_min_quantity || 1} className="bg-white text-gray-900 border-gray-300" />
                    <p className="text-xs text-gray-500">ลูกค้าต้องซื้อครบจำนวนนี้ถึงจะได้ราคาโปร (ค่าเริ่มต้น 1 = ไม่มีขั้นต่ำ)</p>
                </div>
                <div className="space-y-2">
                    <Input id="stock" name="stock" type="number" defaultValue={product?.stock || 0} required className="bg-white text-gray-900 border-gray-300" />
                </div>

                {/* Featured Checkbox */}
                <div className="space-y-2 flex items-center gap-3 pt-6">
                    <div className="flex items-center h-5">
                        <input
                            id="featured"
                            name="featured"
                            type="checkbox"
                            defaultChecked={product?.featured}
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                    </div>
                    <div className="text-sm">
                        <Label htmlFor="featured" className="font-medium text-charcoal-900">สินค้าแนะนำ (Featured)</Label>
                        <p className="text-gray-500 text-xs">แสดงในส่วน "สินค้าแนะนำ" หน้าแรก (ถ้ามีราคาโปรโมชั่น ระบบจะติ๊กให้อัตโนมัติ)</p>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description" className="text-charcoal-900">รายละเอียดสินค้า</Label>
                    <Textarea
                        id="description"
                        name="description"
                        defaultValue={product?.description}
                        placeholder="อธิบายรายละเอียดสินค้า คุณสมบัติ ฯลฯ..."
                        className="h-32 bg-white text-gray-900 border-gray-300"
                    />
                </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-6">
                {/* Main Image */}
                <div className="space-y-4">
                    <Label className="text-base font-semibold text-charcoal-900">รูปภาพหลัก (ปกสินค้า)</Label>
                    <div className="flex flex-col sm:flex-row items-start gap-4 p-4 border rounded-lg bg-gray-50 border-gray-200">
                        <div className="relative w-40 h-40 bg-white rounded-md border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                            {imageUrl ? (
                                <Image src={imageUrl} alt="Main Preview" fill className="object-cover" />
                            ) : (
                                <span className="text-gray-400 text-xs">ไม่มีรูปภาพ</span>
                            )}
                        </div>
                        <div className="flex-1 w-full">
                            <Label htmlFor="main-image-upload" className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto">
                                <span>เลือกรูปภาพหลัก</span>
                                <input id="main-image-upload" type="file" onChange={handleImageUpload} disabled={uploading} accept="image/*" className="sr-only" />
                            </Label>
                            <p className="text-xs text-gray-500 mt-2">
                                {uploading ? 'กำลังอัปโหลด...' : 'ขนาดแนะนำ: 800x800px ใช้สำหรับแสดงในหน้ารวมสินค้า'}
                            </p>
                            {imageUrl && (
                                <Button type="button" variant="ghost" size="sm" className="mt-2 text-red-600 hover:text-red-700" onClick={() => setImageUrl("")}>
                                    ลบรูปภาพหลัก
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Gallery Images */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold text-charcoal-900">รูปภาพเพิ่มเติม (แกลเลอรี)</Label>
                        <span className="text-xs text-gray-500">{gallery.length} รูป</span>
                    </div>

                    <div className="p-4 border rounded-lg bg-gray-50 border-gray-200 space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {gallery.map((url, index) => (
                                <div key={index} className="group relative aspect-square bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm">
                                    <Image src={url} alt={`Gallery ${index + 1}`} fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveGalleryImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
                                        title="Remove Image"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}

                            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors bg-white">
                                <Plus className="w-8 h-8 text-gray-400 mb-1" />
                                <span className="text-xs text-gray-500 font-medium">เพิ่มรูปภาพ</span>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleGalleryUpload}
                                    disabled={uploading}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <p className="text-xs text-gray-500">
                            {uploading ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปภาพเพิ่มเติมเพื่อแสดงมุมมองต่างๆ หรือรายละเอียด'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => router.back()}>ยกเลิก</Button>
                <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 font-bold" disabled={isPending || uploading}>
                    {isPending ? 'กำลังบันทึก...' : (product ? 'บันทึกสินค้า' : 'เพิ่มสินค้า')}
                </Button>
            </div>
        </form>
    )
}
