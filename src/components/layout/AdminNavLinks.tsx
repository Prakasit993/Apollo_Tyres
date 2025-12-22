import Link from "next/link"
import { Package, ShoppingCart, BarChart3, Home, Star, MapPin, CreditCard, FileText, Settings } from "lucide-react"

export function AdminNavLinks({ onClick }: { onClick?: () => void }) {
    return (
        <nav className="p-4 space-y-2">
            <Link
                href="/admin"
                onClick={onClick}
                className="flex items-center gap-3 px-4 py-3 rounded hover:bg-charcoal-800 text-gray-300 hover:text-white transition-colors"
            >
                <BarChart3 className="w-5 h-5" />
                ภาพรวม
            </Link>
            <Link
                href="/admin/products"
                onClick={onClick}
                className="flex items-center gap-3 px-4 py-3 rounded hover:bg-charcoal-800 text-gray-300 hover:text-white transition-colors"
            >
                <Package className="w-5 h-5" />
                สินค้า
            </Link>
            <Link
                href="/admin/orders"
                onClick={onClick}
                className="flex items-center gap-3 px-4 py-3 rounded hover:bg-charcoal-800 text-gray-300 hover:text-white transition-colors"
            >
                <ShoppingCart className="w-5 h-5" />
                คำสั่งซื้อ
            </Link>
            <Link
                href="/admin/finance"
                onClick={onClick}
                className="flex items-center gap-3 px-4 py-3 rounded hover:bg-charcoal-800 text-gray-300 hover:text-white transition-colors"
            >
                <CreditCard className="w-5 h-5" />
                การเงิน
            </Link>
            <Link
                href="/admin/finance/accounting"
                onClick={onClick}
                className="flex items-center gap-3 px-4 py-3 rounded hover:bg-charcoal-800 text-gray-300 hover:text-white transition-colors"
            >
                <FileText className="w-5 h-5" />
                บัญชี
            </Link>
            <Link
                href="/admin/reviews"
                onClick={onClick}
                className="flex items-center gap-3 px-4 py-3 rounded hover:bg-charcoal-800 text-gray-300 hover:text-white transition-colors"
            >
                <Star className="w-5 h-5" />
                รีวิวลูกค้า
            </Link>
            <Link
                href="/admin/contact"
                onClick={onClick}
                className="flex items-center gap-3 px-4 py-3 rounded hover:bg-charcoal-800 text-gray-300 hover:text-white transition-colors"
            >
                <MapPin className="w-5 h-5" />
                ข้อมูลร้าน
            </Link>
            <Link
                href="/admin/settings"
                onClick={onClick}
                className="flex items-center gap-3 px-4 py-3 rounded hover:bg-charcoal-800 text-gray-300 hover:text-white transition-colors"
            >
                <Settings className="w-5 h-5" />
                ตั้งค่า
            </Link>

            <div className="pt-4 mt-4 border-t border-gray-800">
                <Link
                    href="/"
                    onClick={onClick}
                    className="flex items-center gap-3 px-4 py-3 rounded hover:bg-charcoal-800 text-gray-300 hover:text-white transition-colors"
                >
                    <Home className="w-5 h-5" />
                    หน้าร้านสินค้า
                </Link>
            </div>
        </nav>
    )
}
