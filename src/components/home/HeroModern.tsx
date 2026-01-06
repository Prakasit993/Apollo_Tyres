import Link from "next/link"
import { ShoppingBag, MapPin, CheckCircle2 } from "lucide-react"
import { getHeroImageUrl } from "@/lib/storage"

export async function HeroModern() {
    const heroImageUrl = await getHeroImageUrl()

    return (
        <section className="relative bg-black text-white w-full overflow-hidden">
            {/* Background with Gradient Overlay */}
            <div className="absolute inset-0 bg-neutral-900">
                {/* Background Image - Dynamically loaded from database */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
                    style={{ backgroundImage: `url('${heroImageUrl}')` }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent/20 z-10" />
            </div>

            {/* Content Container */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col justify-center min-h-[550px] md:min-h-[650px]">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1.5 md:px-4 md:py-2 rounded-full w-fit mb-4 md:mb-6 backdrop-blur-sm">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 fill-blue-500 text-black" />
                    <span className="font-semibold text-xs md:text-sm tracking-wide uppercase">In Stock Now</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-tight max-w-3xl mb-4 md:mb-6">
                    STOCK READY <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        TO DELIVER
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-xl mb-8 md:mb-10 leading-relaxed">
                    Premium tires delivered directly to your door or installed at our partnered centers.
                    Explore our wide range of performance tyres today.
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                    <Link
                        href="/products"
                        className="flex items-center gap-2 md:gap-3 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-base md:text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                    >
                        <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                        Shop Tires
                    </Link>

                    <Link
                        href="/contact"
                        className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-all border border-neutral-700"
                        title="Find Location"
                    >
                        <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
