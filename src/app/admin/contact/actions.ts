'use server'

import { createClient } from "@/lib/supabase-server"
import { createAdminClient } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"

export interface ContactSettings {
    address: string
    phone1: string
    phone2: string
    email: string
    facebook: string
    line: string
    mapUrl: string
    hoursWeekdays: string
    hoursWeekend: string
}

export async function getContactSettings(): Promise<ContactSettings> {
    const supabase = await createClient()
    const { data } = await supabase.from('tyres_site_settings').select('key, value')

    // Map array to object
    const settings: any = {}
    data?.forEach((item: any) => {
        settings[item.key] = item.value
    })

    return {
        address: settings.contact_address || '',
        phone1: settings.contact_phone1 || '',
        phone2: settings.contact_phone2 || '',
        email: settings.contact_email || '',
        facebook: settings.contact_facebook || '',
        line: settings.contact_line || '',
        mapUrl: settings.contact_map_url || '',
        hoursWeekdays: settings.contact_hours_weekdays || '',
        hoursWeekend: settings.contact_hours_weekend || ''
    }
}

export async function saveContactSettings(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { message: "Unauthorized" }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return { message: "Forbidden" }

    const admin = createAdminClient()

    const settings = [
        { key: 'contact_address', value: formData.get('address') as string },
        { key: 'contact_phone1', value: formData.get('phone1') as string },
        { key: 'contact_phone2', value: formData.get('phone2') as string },
        { key: 'contact_email', value: formData.get('email') as string },
        { key: 'contact_facebook', value: formData.get('facebook') as string },
        { key: 'contact_line', value: formData.get('line') as string },
        { key: 'contact_map_url', value: formData.get('mapUrl') as string },
        { key: 'contact_hours_weekdays', value: formData.get('hoursWeekdays') as string },
        { key: 'contact_hours_weekend', value: formData.get('hoursWeekend') as string },
    ]

    try {
        for (const setting of settings) {
            const { error } = await admin.from('tyres_site_settings').upsert({
                key: setting.key,
                value: setting.value,
                updated_at: new Date().toISOString(),
                description: 'Contact Page Setting'
            }, { onConflict: 'key' })

            if (error) {
                console.error(`Error saving ${setting.key}:`, error)
                throw new Error(`Failed to save ${setting.key}: ${error.message}`)
            }
        }

        revalidatePath('/contact')
        revalidatePath('/admin/contact')
        return { success: true, message: "Contact info updated successfully" }
    } catch (e: any) {
        console.error("Save Contact Settings Error:", e)
        return { message: e.message || "Failed to save settings" }
    }
}
