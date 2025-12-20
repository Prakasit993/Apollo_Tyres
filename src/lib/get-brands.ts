import { createClient } from "@/lib/supabase-server"

export async function getBrands() {
    const supabase = await createClient()
    const { data } = await supabase.from('tyres_products').select('brand')

    // get unique brands
    const brands = [...new Set(data?.map(p => p.brand).filter(Boolean))]
    console.log("Brands:", brands)
    return brands
}
