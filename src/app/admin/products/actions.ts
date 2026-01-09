'use server'

import { createClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function deleteProduct(productId: string) {
    const supabase = await createClient()

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { message: "Unauthorized" }

    // Role Check (Double verification)
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return { message: "Forbidden" }

    try {
        const { error } = await supabase
            .from('tyres_products')
            .delete()
            .eq('id', productId)

        if (error) {
            console.error("Delete Error:", error)
            return { message: `Failed to delete product: ${error.message}` }
        }

        revalidatePath('/admin/products')
        revalidatePath('/products') // Update storefront too
        return { success: true, message: "Product deleted successfully" }

    } catch (e: any) {
        console.error("Delete Error:", e)
        return { message: `Failed to delete product: ${e.message || JSON.stringify(e)}` }
    }
}

export async function upsertProduct(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // Auth & Role Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { message: "Unauthorized" }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return { message: "Forbidden" }

    const id = formData.get('id') as string
    const brand = formData.get('brand') as string
    const model = formData.get('model') as string
    const price = parseFloat(formData.get('price') as string)
    const promotionalPriceRaw = formData.get('promotionalPrice') as string
    const promotionalPrice = promotionalPriceRaw ? parseFloat(promotionalPriceRaw) : null
    const promoMinQuantityRaw = formData.get('promoMinQuantity') as string
    const promoMinQuantity = promoMinQuantityRaw ? parseInt(promoMinQuantityRaw) : 1
    const stock = parseInt(formData.get('stock') as string)
    const width = parseInt(formData.get('width') as string)
    const aspectRatio = parseInt(formData.get('aspectRatio') as string)
    const rim = parseInt(formData.get('rim') as string)
    const imageUrl = formData.get('imageUrl') as string // Client uploads and sends URL
    const galleryRaw = formData.get('gallery') as string
    let gallery: string[] = []

    if (galleryRaw) {
        try {
            gallery = JSON.parse(galleryRaw)
        } catch (e) {
            console.error("Failed to parse gallery JSON", e)
            gallery = []
        }
    }

    // Slug Logic
    let slug = formData.get('slug') as string
    if (!slug) {
        // Auto-generate: Brand-Model-Specs
        const rawSlug = `${brand}-${model}-${width}-${aspectRatio}-r${rim}`
        slug = rawSlug.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dash
            .replace(/(^-|-$)/g, '')     // Trim dashes
    }

    const description = formData.get('description') as string

    console.log("Upsert Product Debug:", { id, brand, imageUrl, galleryLength: gallery.length, slug, promotionalPrice, promoMinQuantity })

    // Auto-set featured to true when there's a valid promotional price
    const hasValidPromo = promotionalPrice && promotionalPrice > 0
    // Fix: Extract featured from form data, defaulting to false if undefined
    const featured = formData.get('featured') === 'true' || formData.get('featured') === 'on'

    const productData = {
        brand,
        model,
        price,
        promotional_price: promotionalPrice && promotionalPrice > 0 ? promotionalPrice : null,
        promo_min_quantity: promoMinQuantity || 1,
        featured: hasValidPromo ? true : featured, // Auto-tag as featured if has promo
        stock,
        width,
        aspect_ratio: aspectRatio,
        rim,
        image_url: imageUrl || null,
        gallery: gallery,
        slug: slug,
        description: description || null
    }

    let error
    if (id) {
        // Update
        const res = await supabase.from('tyres_products').update(productData).eq('id', id)
        error = res.error
    } else {
        // Insert
        const res = await supabase.from('tyres_products').insert(productData)
        error = res.error
    }

    if (error) {
        console.error("Upsert Error:", error)
        return { message: "Failed to save product: " + error.message }
    }

    revalidatePath('/admin/products')
    revalidatePath('/products')
    return { success: true, message: "Product saved successfully" }
}
