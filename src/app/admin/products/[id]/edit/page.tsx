import { createClient } from "@/lib/supabase-server"
import { notFound, redirect } from "next/navigation"
import { ProductForm } from "../../ProductForm"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // 1. Fetch Product
    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !product) {
        notFound()
    }

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-heading font-bold mb-6">Edit Product</h1>
            <ProductForm product={product} />
        </div>
    )
}
