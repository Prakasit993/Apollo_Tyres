"use client"

import { Star } from "lucide-react"

// Hardcoded fallback removed, accepting props.
interface Review {
    id: string | number
    image_url: string
    name: string
    car: string
    comment: string
    rating: number
    link_url?: string
}

interface ReviewsProps {
    reviews: Review[]
}

export function Reviews({ reviews }: ReviewsProps) {
    // If no reviews, don't crash, maybe show hardcoded as fallback or empty
    const displayReviews = reviews && reviews.length > 0 ? reviews : [] // Or fallback

    return (
        <section className="py-20 w-full overflow-hidden bg-neutral-900">
            <div className="flex flex-col items-center mb-12 px-4 text-center">
                <h2 className="font-heading text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter border-b-4 border-blue-500 inline-block text-center mb-4 pb-2">
                    รีวิวจากลูกค้า
                </h2>
                <p className="text-xl text-gray-400 font-light">ความประทับใจจากผู้ใช้งานจริงของเรา</p>
            </div>

            {/* Marquee Container */}
            <div className="relative w-full overflow-hidden">
                <div className="absolute top-0 left-0 w-12 md:w-32 h-full bg-gradient-to-r from-neutral-900 to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-12 md:w-32 h-full bg-gradient-to-l from-neutral-900 to-transparent z-10 pointer-events-none" />

                <div className="flex gap-6 md:gap-8 animate-marquee whitespace-nowrap px-4">
                    {/* Render reviews twice for seamless loop */}
                    {[...displayReviews, ...displayReviews, ...displayReviews].map((review, idx) => (
                        <div
                            key={`${review.id}-${idx}`}
                            className="w-[300px] md:w-[400px] shrink-0 bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-700 flex flex-col items-center text-center transform transition-transform hover:scale-105 duration-300 group/card"
                        >
                            {/* Review Image */}
                            <div className="w-full h-48 md:h-64 mb-6 overflow-hidden rounded-md bg-neutral-700 relative group-hover/card:shadow-inner">
                                <a href={review.link_url || review.image_url} target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-pointer flex items-center justify-center relative">
                                    {review.image_url ? (
                                        <img
                                            src={review.image_url}
                                            alt={`Review by ${review.name}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement!.classList.add('no-image');
                                            }}
                                        />
                                    ) : (
                                        <div className="text-gray-500 text-sm font-bold opacity-50">NO IMAGE</div>
                                    )}

                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                        <span className="bg-blue-600 text-white text-xs md:text-sm font-bold px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300">
                                            {review.link_url ? 'ดูโพสต์ต้นฉบับ' : 'ดูรูปขยาย'}
                                        </span>
                                    </div>
                                </a>
                            </div>

                            {/* Content */}
                            <div className="flex gap-1 mb-4 justify-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} fill={i < review.rating ? "#3b82f6" : "none"} className={i < review.rating ? "text-blue-500" : "text-neutral-600"} />
                                ))}
                            </div>

                            <p className="text-gray-100 font-medium text-base md:text-lg mb-4 line-clamp-2 whitespace-normal italic leading-relaxed">
                                "{review.comment || 'บริการดีมากครับ'}"
                            </p>

                            <div className="mt-auto pt-4 border-t border-neutral-700 w-full">
                                <p className="text-sm font-bold text-white uppercase tracking-widest">{review.name}</p>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">{review.car}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    )
}
