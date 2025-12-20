'use server'

import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const ProfileSchema = z.object({
    fullName: z.string().min(1, "Name is required"),
    phone: z.string().min(10, "Phone is required"),
    address: z.string().min(1, "Address is required"),
    district: z.string().min(1, "District is required"),
    amphoe: z.string().min(1, "Amphoe is required"),
    province: z.string().min(1, "Province is required"),
    zipcode: z.string().min(5, "Zipcode is required"),
})

export async function updateProfile(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { message: "Unauthorized" }
    }

    const validatedFields = ProfileSchema.safeParse({
        fullName: formData.get('fullName'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        district: formData.get('district'),
        amphoe: formData.get('amphoe'),
        province: formData.get('province'),
        zipcode: formData.get('zipcode'),
    })

    if (!validatedFields.success) {
        return { message: "Please fill in all fields." }
    }

    const { fullName, phone, address, district, amphoe, province, zipcode } = validatedFields.data

    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            email: user.email,
            full_name: fullName,
            phone: phone,
            address: address,
            district: district,
            amphoe: amphoe,
            province: province,
            zipcode: zipcode,
            is_complete: true,
            updated_at: new Date().toISOString()
        })

    if (error) {
        console.error("Profile Update Error:", error)
        return { message: "Failed to save profile." }
    }

    revalidatePath('/account') // Clear cache for account page
    redirect('/account')
}
