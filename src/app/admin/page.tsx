import Link from "next/link"
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react"

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-heading font-bold text-charcoal-900 mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Stats Cards */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold">฿0.00</div>
                    <p className="text-xs text-green-600 mt-1">+0% from last month</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Orders</h3>
                        <ShoppingCart className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-gray-500 mt-1">Pending processing</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Products</h3>
                        <Package className="w-5 h-5 text-gold-500" />
                    </div>
                    <div className="text-2xl font-bold">--</div>
                    <p className="text-xs text-gray-500 mt-1">Active items</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
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
