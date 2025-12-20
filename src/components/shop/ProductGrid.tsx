import { Product } from "@/data/products"
import { ProductCard } from "./ProductCard"

interface ProductGridProps {
    products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
    // Group products by Brand + Model
    const groupedProducts = products.reduce((acc, product) => {
        const key = `${product.brand}-${product.model}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(product);
        return acc;
    }, {} as Record<string, Product[]>);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(groupedProducts).map((variants) => (
                <ProductCard key={`${variants[0].brand}-${variants[0].model}`} variants={variants} />
            ))}
        </div>
    )
}
