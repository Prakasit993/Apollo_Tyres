import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Package, ShoppingCart, BarChart3, LogOut, Home } from "lucide-react"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Check Role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

    if (profile?.role !== "admin") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 dark:bg-neutral-900">
                <div className="p-8 text-center bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                    <p className="mb-6 text-gray-600">You do not have permission to view the admin dashboard.</p>
                    <Link href="/" className="px-4 py-2 text-white bg-black rounded hover:bg-gray-800">
                        Return to Store
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-charcoal-900 text-white shrink-0 hidden md:block">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-xl font-heading font-bold text-gold-500">ADMIN PANEL</h2>
                </div>
                <nav className="p-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-charcoal-800 text-gray-300 hover:text-white transition-colors">
                        <BarChart3 className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-charcoal-800 text-gray-300 hover:text-white transition-colors">
                        <Package className="w-5 h-5" />
                        Products
                    </Link>
                    <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-charcoal-800 text-gray-300 hover:text-white transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                        Orders
                    </Link>
                </nav>
                <div className="p-4 absolute bottom-0 w-64 border-t border-gray-800">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-charcoal-800 text-gray-300 hover:text-white transition-colors mb-2">
                        <Home className="w-5 h-5" />
                        Storefront
                    </Link>
                </div>
            </aside>

            {/* Mobile Header (simplified) */}

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
