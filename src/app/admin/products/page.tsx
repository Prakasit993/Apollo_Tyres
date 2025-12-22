import Link from "next/link"
import { getProducts } from "@/app/products/actions"
import { ProductTable } from "./ProductTable"
import { Button } from "@/components/ui/button"

export default async function AdminProductsPage() {
    // Reuse existing getProducts (fetches all products)
    const products = await getProducts({})

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl md:text-3xl font-heading font-bold text-charcoal-900">สินค้า</h1>
                    <p className="text-gray-500">จัดการสินค้าและสต็อกยางของคุณ</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="bg-gold-500 text-black hover:bg-gold-600 font-bold">
                        + เพิ่มสินค้า
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <ProductTable initialProducts={products} />
            </div>
        </div>
    )
}
