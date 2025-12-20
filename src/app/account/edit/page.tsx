import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { EditProfileForm } from "./EditProfileForm"

export default async function EditProfilePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect("/login")
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="container max-w-2xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-heading font-black text-charcoal-900 mb-6">Edit Profile</h1>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <EditProfileForm profile={profile} user={user} />
            </div>
        </div>
    )
}
