import Link from "next/link"
import { getDashboardStats } from "./dashboard-actions"
import { DashboardCharts } from "./DashboardCharts"

export default async function AdminDashboard() {
    const stats = await getDashboardStats()

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-charcoal-900">Dashboard Overview</h1>
            </div>

            <DashboardCharts data={stats} />

            <div className="grid md:grid-cols-2 gap-8 mt-8 print:hidden">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <Link href="/admin/products" className="block w-full text-center py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gold-500 hover:text-gold-600 transition-colors">
                            + Add New Product
                        </Link>
                        <Link href="/admin/orders" className="block w-full text-center py-3 bg-charcoal-900 text-white rounded-lg hover:bg-black transition-colors">
                            Manage Orders
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
