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
                    {[...displayReviews, ...displayReviews, ...displayReviews].map((review, idx) => (
                        <div
                            key={`${review.id}-${idx}`}
                            className="w-[400px] shrink-0 bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col items-center text-center transform transition-transform hover:scale-105 duration-300"
                        >
                            {/* Review Image */}
                            <div className="w-full h-64 mb-6 overflow-hidden rounded-md bg-gray-100 group">
                                <a href={review.link_url || review.image_url} target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-pointer bg-gray-200 flex items-center justify-center">
                                    {review.image_url ? (
                                        <img
                                            src={review.image_url}
                                            alt={`Review by ${review.name}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement!.classList.add('no-image');
                                            }}
                                        />
                                    ) : (
                                        <div className="text-gray-400 text-sm font-bold">NO IMAGE</div>
                                    )}

                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                                        <span className={`opacity-0 group-hover:opacity-100 bg-white/90 text-charcoal-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-all duration-300`}>
                                            {review.link_url ? 'VIEW POST' : 'VIEW IMAGE'}
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
