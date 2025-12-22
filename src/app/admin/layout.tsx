import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AdminNavLinks } from "@/components/layout/AdminNavLinks"
import { AdminMobileMenu } from "@/components/layout/AdminMobileMenu"

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
        <div className="flex min-h-screen bg-gray-100 flex-col md:flex-row">
            {/* Sidebar (Desktop) */}
            <aside className="w-64 bg-charcoal-900 text-white shrink-0 hidden md:block min-h-screen">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-xl font-heading font-bold text-gold-500">ระบบจัดการร้าน</h2>
                </div>
                <AdminNavLinks />
                <div className="p-4 absolute bottom-0 w-64 border-t border-gray-800">
                    {/* Optional footer links if needed */}
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden bg-charcoal-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
                <div className="flex items-center gap-3">
                    <AdminMobileMenu />
                    <span className="font-heading font-bold text-gold-500 text-lg">ระบบจัดการร้าน</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
