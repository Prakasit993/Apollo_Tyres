'use server'

import { createClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function getAdminReviews() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    // Verify admin
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return []

    const { data, error } = await supabase
        .from('tyres_reviews')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Fetch Reviews Error:", error)
        return []
    }
    return data
}

export async function getReview(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('tyres_reviews')
        .select('*')
        .eq('id', id)
        .single()

    if (error) return null
    return data
}

export async function deleteReview(id: string) {
    const supabase = await createClient()

    // Auth & Role Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { message: "Unauthorized" }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return { message: "Forbidden" }

    const { error } = await supabase.from('tyres_reviews').delete().eq('id', id)

    if (error) {
        console.error("Delete Review Error:", error)
        return { message: "Failed to delete review" }
    }

    revalidatePath('/admin/reviews')
    revalidatePath('/') // Revalidate homepage too
    return { success: true, message: "Review deleted" }
}

export async function upsertReview(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { message: "Unauthorized" }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return { message: "Forbidden" }

    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const car = formData.get('car') as string
    const comment = formData.get('comment') as string
    const rating = parseInt(formData.get('rating') as string) || 5
    const imageUrl = formData.get('imageUrl') as string
    const linkUrl = formData.get('linkUrl') as string

    const reviewData = {
        name,
        car,
        comment,
        rating,
        image_url: imageUrl || null,
        link_url: linkUrl || null
    }

    let error
    if (id) {
        // Update
        const res = await supabase.from('tyres_reviews').update(reviewData).eq('id', id)
        error = res.error
    } else {
        // Insert
        const res = await supabase.from('tyres_reviews').insert(reviewData)
        error = res.error
    }

    if (error) {
        console.error("Upsert Review Error:", error)
        return { message: "Failed to save review: " + error.message }
    }

    revalidatePath('/admin/reviews')
    revalidatePath('/')
    return { success: true, message: "Review saved successfully" }
}
