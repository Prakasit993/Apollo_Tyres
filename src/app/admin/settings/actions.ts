'use server'

import { createClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function getSettings(key: string) {
    const supabase = await createClient()
    const { data } = await supabase.from('site_settings').select('value').eq('key', key).single()
    return data?.value || ''
}

export async function updateSettings(key: string, value: string) {
    const supabase = await createClient()

    // Auth & Role Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { message: "Unauthorized" }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return { message: "Forbidden" }

    try {
        // Use upsert to handle cases where the setting key doesn't exist yet
        const { error } = await supabase
            .from('site_settings')
            .upsert({
                key,
                value,
                updated_at: new Date().toISOString(),
                description: `Setting for ${key}` // Provide default description for new rows
            }, { onConflict: 'key' })

        if (error) throw error

        revalidatePath('/admin/settings')
        revalidatePath('/checkout') // Update checkout page too
        return { success: true, message: "Settings updated successfully" }

    } catch (e) {
        console.error("Update Settings Error:", e)
        return { message: "Failed to update settings" }
    }
}
