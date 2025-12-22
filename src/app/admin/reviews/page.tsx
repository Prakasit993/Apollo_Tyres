import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Star } from "lucide-react"
import { getAdminReviews, deleteReview } from "./actions"

export default async function AdminReviewsPage() {
    const reviews = await getAdminReviews()

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-xl md:text-3xl font-black text-charcoal-900">จัดการรีวิวลูกค้า</h1>
                <Link href="/admin/reviews/new">
                    <Button className="bg-gold-500 text-black hover:bg-gold-600 font-bold">
                        <Plus className="mr-2 h-4 w-4" /> เพิ่มรีวิว
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ลูกค้า</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ความคิดเห็น</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">คะแนน</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {reviews.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        ไม่พบรีวิวในระบบ เริ่มต้นสร้างรีวิวใหม่ได้เลย
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((review: any) => (
                                    <tr key={review.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden shrink-0">
                                                    {review.image_url ? (
                                                        <img src={review.image_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-charcoal-900">{review.name}</p>
                                                    <p className="text-xs text-muted-foreground">{review.car}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate">
                                            "{review.comment}"
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex text-gold-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-gold-500" : "text-gray-300"} />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/reviews/${review.id}/edit`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600">
                                                        <Pencil size={16} />
                                                    </Button>
                                                </Link>
                                                <form action={async () => {
                                                    'use server'
                                                    await deleteReview(review.id)
                                                }}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-600">
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
