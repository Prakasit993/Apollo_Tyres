'use server'

import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { z } from "zod"

const ProfileSchema = z.object({
    fullName: z.string().min(1, "Name is required"),
    phone: z.string().min(10, "Phone is required"),
    address: z.string().min(1, "Address is required"),
    district: z.string().min(1, "District is required"), // Tambon
    amphoe: z.string().min(1, "Amphoe is required"),   // District (but we call it Amphoe usually)
    province: z.string().min(1, "Province is required"),
    zipcode: z.string().min(5, "Zipcode is required"),
})

export async function submitOnboarding(prevState: any, formData: FormData) {
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
        .update({
            full_name: fullName,
            phone: phone,
            address: address, // Keep legacy field or combine? Let's use it as "House No / Building"
            district: district,
            amphoe: amphoe,
            province: province,
            zipcode: zipcode,
            is_complete: true
        })
        .eq('id', user.id)

    if (error) {
        console.error("Profile Update Error:", error)
        return { message: "Failed to save profile." }
    }

    redirect('/')
}
