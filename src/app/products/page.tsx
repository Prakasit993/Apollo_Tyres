import { FilterSidebar } from "@/components/shop/FilterSidebar"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { getProducts } from "@/app/products/actions"
import { PaginationControls } from "@/components/ui/pagination-controls"
import { Metadata } from "next"

interface ProductsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
    const resolvedParams = await searchParams;
    const query = resolvedParams.q as string | undefined;
    const brand = resolvedParams.brand as string | undefined;

    let title = "All Products";
    if (query) {
        title = `Search results for "${query}"`;
    } else if (brand) {
        title = `${brand} Tires`;
    }

    return {
        title: title,
        description: `Browse our collection of ${brand || 'premium'} tires. Find the perfect fit for your vehicle.`,
        openGraph: {
            title: `${title} | Tire Select`,
            description: `Shop ${title} at Tire Select. Best prices and fast delivery.`,
        }
    }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const resolvedParams = await searchParams;
    const products = await getProducts(resolvedParams);

    // Pagination Logic
    const page = Number(resolvedParams.page) || 1
    const ITEMS_PER_PAGE = 15

    // Group products by Brand + Model
    const groupedProducts = products.reduce((acc, product) => {
        const key = `${product.brand}-${product.model}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(product);
        return acc;
    }, {} as Record<string, typeof products>);

    const allGroups = Object.values(groupedProducts)
    const totalPages = Math.ceil(allGroups.length / ITEMS_PER_PAGE)

    const startIndex = (page - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentGroups = allGroups.slice(startIndex, endIndex)

    // Flatten back to array for ProductGrid (which expects Product[])
    // Note: ProductGrid will re-group them, which is slightly inefficient but keeps ProductGrid component reusable.
    // Ideally ProductGrid should accept groups, but we'll stick to minimum changes.
    const currentProducts = currentGroups.flat()

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <h1 className="text-3xl font-black text-charcoal-900 mb-8">All Products</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/4 shrink-0">
                    <FilterSidebar />
                </div>
                <div className="w-full lg:w-3/4">
                    {currentProducts.length > 0 ? (
                        <>
                            <ProductGrid products={currentProducts as any} />
                            <PaginationControls currentPage={page} totalPages={totalPages} />
                        </>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-lg">
                            <h3 className="text-xl font-bold text-gray-400">No products found</h3>
                            <p className="text-gray-400">Try adjusting your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
