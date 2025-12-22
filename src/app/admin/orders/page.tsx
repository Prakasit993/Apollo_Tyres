import { getAdminOrders } from "./actions"
import { OrderTable } from "./OrderTable"

export default async function AdminOrdersPage() {
    const orders = await getAdminOrders()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl md:text-3xl font-heading font-bold text-charcoal-900">คำสั่งซื้อ</h1>
                <p className="text-gray-500">ดูและจัดการคำสั่งซื้อของลูกค้า</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <OrderTable initialOrders={orders} />
            </div>
        </div>
    )
}
