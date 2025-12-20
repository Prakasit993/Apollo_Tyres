import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { CheckoutForm } from "./CheckoutForm"

export default async function CheckoutPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login?next=/checkout")
    }

    // Fetch Profile for pre-filling
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

    // Construct full address from components if available
    const addressParts = [
        profile?.address,
        profile?.district ? `ต.${profile.district}` : null,
        profile?.amphoe ? `อ.${profile.amphoe}` : null,
        profile?.province ? `จ.${profile.province}` : null,
        profile?.zipcode
    ].filter(Boolean)

    const fullAddress = addressParts.join(" ")

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <h1 className="text-4xl font-black text-charcoal-900 mb-8 uppercase italic border-b-4 border-gold-500 inline-block">
                Secure Checkout
            </h1>

            <CheckoutForm
                user={user}
                profile={profile}
                defaultAddress={fullAddress}
            />
        </div>
    )
}
