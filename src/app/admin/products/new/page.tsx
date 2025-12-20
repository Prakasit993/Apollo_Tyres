import { ProductForm } from "../ProductForm"

export default function NewProductPage() {
    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-heading font-bold mb-6">Add New Product</h1>
            <ProductForm />
        </div>
    )
}
