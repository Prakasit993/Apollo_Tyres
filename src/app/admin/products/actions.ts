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
            .from('products')
            .delete()
            .eq('id', productId)

        if (error) {
            console.error("Delete Error:", error)
            return { message: "Failed to delete product" }
        }

        revalidatePath('/admin/products')
        revalidatePath('/products') // Update storefront too
        return { success: true, message: "Product deleted successfully" }

    } catch (e) {
        return { message: "Server error" }
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
    const stock = parseInt(formData.get('stock') as string)
    const width = parseInt(formData.get('width') as string)
    const aspectRatio = parseInt(formData.get('aspectRatio') as string)
    const rim = parseInt(formData.get('rim') as string)
    const imageUrl = formData.get('imageUrl') as string // Client uploads and sends URL

    const productData = {
        brand,
        model,
        price,
        stock,
        width,
        aspect_ratio: aspectRatio,
        rim,
        image_url: imageUrl || null
    }

    let error
    if (id) {
        // Update
        const res = await supabase.from('products').update(productData).eq('id', id)
        error = res.error
    } else {
        // Insert
        const res = await supabase.from('products').insert(productData)
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
