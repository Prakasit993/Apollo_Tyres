import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Package, ShoppingCart, BarChart3, LogOut, Home, Star, MapPin, CreditCard, FileText } from "lucide-react"

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
                    <Link href="/admin/finance" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-charcoal-800 text-gray-300 hover:text-white transition-colors">
                        <CreditCard className="w-5 h-5" />
                        Finance
                    </Link>
                    <Link href="/admin/finance/accounting" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-charcoal-800 text-gray-300 hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                        Accounting
                    </Link>
                    <Link href="/admin/reviews" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-charcoal-800 text-gray-300 hover:text-white transition-colors">
                        <Star className="w-5 h-5" />
                        Reviews
                    </Link>
                    <Link href="/admin/contact" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-charcoal-800 text-gray-300 hover:text-white transition-colors">
                        <MapPin className="w-5 h-5" />
                        Contact Info
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-charcoal-800 text-gray-300 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                        Settings
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
