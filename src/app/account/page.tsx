import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, User as UserIcon, Shield } from "lucide-react"

export default async function AccountPage() {
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
        <div className="container max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-heading font-black text-charcoal-900 mb-2">MY ACCOUNT</h1>
            <p className="text-gray-500 mb-8">Welcome back, {profile?.full_name || user.email}</p>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Profile Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <UserIcon className="w-6 h-6 text-gold-500" />
                            <h2 className="text-xl font-bold">Profile Details</h2>
                        </div>
                        <Link href="/account/edit">
                            <Button variant="outline" size="sm" className="text-xs">Edit Profile</Button>
                        </Link>
                    </div>
                    <div className="space-y-3 text-sm text-gray-600">
                        <p className="grid grid-cols-[80px_1fr]"><span className="font-semibold text-gray-900">Email:</span> {user.email}</p>
                        <p className="grid grid-cols-[80px_1fr]"><span className="font-semibold text-gray-900">Name:</span> {profile?.full_name || '-'}</p>
                        <p className="grid grid-cols-[80px_1fr]"><span className="font-semibold text-gray-900">Phone:</span> {profile?.phone || '-'}</p>
                        <div className="grid grid-cols-[80px_1fr]">
                            <span className="font-semibold text-gray-900">Address:</span>
                            <span>
                                {profile?.address || '-'}
                                {profile?.district && <br />}
                                {profile?.district && `${profile.district} ${profile.amphoe}`}
                                {profile?.province && <br />}
                                {profile?.province && `${profile.province} ${profile.zipcode}`}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-start">
                    <div className="flex items-center gap-3 mb-4">
                        <Package className="w-6 h-6 text-blue-500" />
                        <h2 className="text-xl font-bold">My Orders</h2>
                    </div>
                    <p className="text-gray-500 text-sm mb-6 flex-1">
                        View your order history and track shipping status.
                    </p>
                    <Link href="/account/orders" className="w-full">
                        <Button className="w-full" variant="outline">View Orders</Button>
                    </Link>
                </div>

                {/* Admin Card (Only if Admin) */}
                {profile?.role === 'admin' && (
                    <div className="md:col-span-2 bg-charcoal-900 text-white p-6 rounded-lg shadow-lg border border-gold-500/30 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Shield className="w-6 h-6 text-gold-500" />
                                <h2 className="text-xl font-bold">Admin Dashboard</h2>
                            </div>
                            <p className="text-gray-400 text-sm">Manage products, orders, and store settings.</p>
                        </div>
                        <Link href="/admin">
                            <Button className="bg-gold-500 text-black hover:bg-gold-600 font-bold border-none">
                                Go to Dashboard
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
