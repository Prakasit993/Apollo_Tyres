import { getReview } from "../../actions"
import { ReviewForm } from "../../ReviewForm"
import { notFound } from "next/navigation"

export default async function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const review = await getReview(id)

    if (!review) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-black text-charcoal-900">Edit Review</h1>
            <ReviewForm review={review} />
        </div>
    )
}
