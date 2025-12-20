"use client"

import { Star } from "lucide-react"

const reviews = [
    {
        id: 1,
        image: "https://scontent.fbkk8-4.fna.fbcdn.net/v/t39.30808-6/598114812_1537183844118926_4973732882088202249_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGP2A_kAawWgw7qQpWGjRgEhjEm6p4AOSSGMSbqngA5JHTwNAv3a3jkRmne5iFCwhG5DxZqTSi9qO02gL5b31g3&_nc_ohc=-h_gJind-LMQ7kNvwH5onvj&_nc_oc=Adn4TFvABi87oq_FdDusepzhwZjMs061zC2ZoIsjjQ499Ybkk6ayNemzEfwpkvBls1A&_nc_zt=23&_nc_ht=scontent.fbkk8-4.fna&_nc_gid=r90Ey6vj9n88Kx_DYuhihw&oh=00_AflAWlVIlFYwTkdggnuN5S7TSDCPmaL-W1uBTvbZen42kw&oe=694ACFB8",
        name: "Somchai T.",
        car: "Honda Civic",
        comment: "ยางใหม่สภาพดี ส่งไวมากครับ แนะนำเลย",
        rating: 5
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=500",
        name: "Kornkanok P.",
        car: "Toyota Altis",
        comment: "ราคาถูกกว่าร้านแถวบ้านเยอะ สั่งมา 4 เส้นคุ้มครับ",
        rating: 5
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=500",
        name: "Wichai S.",
        car: "Isuzu D-Max",
        comment: "ประทับใจบริการครับ ของแท้แน่นอน",
        rating: 5
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=500",
        name: "Nattapong K.",
        car: "Ford Ranger",
        comment: "ส่งถึงหน้าบ้าน รวดเร็วทันใจ",
        rating: 4
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=500",
        name: "Danai L.",
        car: "Mazda 3",
        comment: "บริการดีมากครับ ให้คำแนะนำเรื่องยางดีสุดๆ",
        rating: 5
    }
]

export function Reviews() {
    return (
        <section className="py-20 w-full overflow-hidden bg-white/50">
            <div className="flex flex-col items-center mb-12">
                <h2 className="font-heading text-4xl md:text-5xl font-black text-charcoal-900 uppercase italic tracking-tighter border-b-4 border-gold-500 inline-block text-center mb-4">
                    CUSTOMER REVIEWS
                </h2>
                <p className="text-xl text-muted-foreground font-light">เสียงตอบรับจากลูกค้าจริง</p>
            </div>

            {/* Marquee Container */}
            <div className="relative w-full overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-cream-50 to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-cream-50 to-transparent z-10 pointer-events-none" />

                <div className="flex gap-8 animate-marquee whitespace-nowrap">
                    {/* Render reviews twice for seamless loop */}
                    {[...reviews, ...reviews, ...reviews].map((review, idx) => (
                        <div
                            key={`${review.id}-${idx}`}
                            className="w-[400px] shrink-0 bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col items-center text-center transform transition-transform hover:scale-105 duration-300"
                        >
                            {/* Review Image */}
                            <div className="w-full h-64 mb-6 overflow-hidden rounded-md bg-gray-100 group">
                                <a href={review.image} target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-pointer">
                                    <img
                                        src={review.image}
                                        alt={`Review by ${review.name}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                                        <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-charcoal-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                            VIEW IMAGE
                                        </span>
                                    </div>
                                </a>
                            </div>

                            {/* Content */}
                            <div className="flex gap-1 mb-4 text-gold-500 justify-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-gold-500" : "text-gray-300"} />
                                ))}
                            </div>

                            <p className="text-charcoal-900 font-medium text-lg mb-4 line-clamp-2 whitespace-normal italic">
                                "{review.comment}"
                            </p>

                            <div className="mt-auto pt-4 border-t border-gray-100 w-full">
                                <p className="text-sm font-bold text-charcoal-900 uppercase tracking-widest">{review.name}</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{review.car}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    )
}
