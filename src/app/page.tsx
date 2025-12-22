import { HeroModern } from "@/components/home/HeroModern"
import { FilterSidebar } from "@/components/shop/FilterSidebar"
import { MapWidget } from "@/components/home/MapWidget"
import { Reviews } from "@/components/home/Reviews"
import { createClient } from "@/lib/supabase-server"

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()
  const { data: reviews } = await supabase
    .from('tyres_reviews')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="bg-neutral-900 min-h-screen pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <HeroModern />

      {/* Main Content Area */}
      <div className="relative">
        {/* Decorative Side Polygons for Page Body */}
        {/* Left Side Layered Shapes */}
        <div className="absolute top-0 left-0 z-0 hidden xl:block">
          {/* Dark Gold Triangle Gradient */}
          <div
            className="absolute top-0 left-0 w-64 h-96 bg-gradient-to-br from-[#B08D3F] to-[#8C6D2C]"
            style={{ clipPath: 'polygon(0 0, 100% 0, 0 80%)' }}
          />
          {/* Lighter Beige/Gold Gradient Triangle overlapping */}
          <div
            className="absolute top-0 left-0 w-96 h-[500px] bg-gradient-to-tr from-[#EAE4D5] via-[#D8D0C0] to-transparent -z-10"
            style={{ clipPath: 'polygon(0 0, 100% 40%, 0 100%)' }}
          />
          {/* Accent lighter gold strip */}
          <div
            className="absolute top-40 left-0 w-48 h-96 bg-gradient-to-b from-[#C9A24A]/40 to-transparent"
            style={{ clipPath: 'polygon(0 0, 100% 20%, 0 100%)' }}
          />
        </div>

        <div
          className="absolute top-20 right-0 w-96 h-96 translate-x-32 z-0 hidden xl:block opacity-50"
          style={{
            background: '#EAE4D5',
            clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 50%)'
          }}
        />

        <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10 flex flex-col items-center">
          <h2 className="font-heading text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-12 border-b-4 border-blue-600 inline-block text-center">
            SHOP TIRES
          </h2>

          <div className="w-full max-w-4xl mb-20">
            <FilterSidebar />
          </div>

          <Reviews reviews={reviews || []} />
        </div>
      </div>

      {/* Floating Map Widget */}
      <MapWidget />
    </div>
  )
}
