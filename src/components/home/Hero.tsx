import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
    return (
        <section className="relative w-full h-[500px] md:h-[600px] flex items-center overflow-hidden bg-charcoal-900">

            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/hero-bg.png)' }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Geometric Gold Overlays (CSS Clip Path) */}
            {/* Top Left Large Polygon */}
            <div
                className="absolute top-0 left-0 w-[40%] h-full z-10 hidden lg:block opacity-70"
                style={{
                    background: 'linear-gradient(135deg, #C9A24A 0%, #B08D3F 100%)',
                    clipPath: 'polygon(0 0, 100% 0, 0 100%)'
                }}
            />

            {/* Bottom Right Large Polygon */}
            <div
                className="absolute bottom-0 right-0 w-[40%] h-full z-10 hidden lg:block opacity-70"
                style={{
                    background: 'linear-gradient(135deg, #C9A24A 0%, #B08D3F 100%)',
                    clipPath: 'polygon(100% 0, 100% 100%, 20% 100%)'
                }}
            />

            {/* Content */}
            <div className="container relative z-20 mx-auto px-4 max-w-7xl flex flex-col justify-center items-start h-full">
                <div className="max-w-4xl space-y-2 mt-12 md:mt-0 md:pl-12">
                    {/* Main Headline */}
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-gold-500 uppercase drop-shadow-2xl italic leading-[0.9]">
                        STOCK READY <br />
                        <span className="text-white">TO DELIVER</span>
                    </h1>

                    {/* Subheadline (Thai) */}
                    <h2 className="text-2xl md:text-4xl font-bold text-white tracking-wide mt-4 drop-shadow-md">
                        ส่งรวดเร็ว <span className="text-gold-500">ราคาพิเศษ</span>
                    </h2>

                    {/* Badge/Tagline Box */}
                    <div className="mt-8 inline-block bg-gold-500 text-charcoal-900 font-bold px-4 py-2 text-sm md:text-base uppercase tracking-widest shadow-lg -skew-x-12">
                        NOTICE: REAL STOCK, REAL PHOTO, QUICK PHOTO
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Link href="/products">
                            <Button size="lg" className="w-full sm:w-auto bg-charcoal-900 text-gold-500 hover:bg-black font-bold border-2 border-gold-500 rounded-none text-base px-10 h-14 uppercase tracking-wider shadow-xl">
                                SHOP TIRES
                            </Button>
                        </Link>
                        <Link href="https://maps.app.goo.gl/u8xZxi6XjyWpgm54A" target="_blank" rel="noopener noreferrer">
                            <Button size="lg" variant="default" className="w-full sm:w-auto bg-white text-charcoal-900 hover:bg-gray-100 font-bold border-none rounded-none text-base px-10 h-14 uppercase tracking-wider shadow-xl">
                                VIEW LOCATION
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
