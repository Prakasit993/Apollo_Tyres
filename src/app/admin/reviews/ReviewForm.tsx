'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase"
import { upsertReview } from "./actions" // We need to export this from actions.ts
import { Loader2, Upload } from "lucide-react"

interface ReviewFormProps {
    review?: any
}

export function ReviewForm({ review }: ReviewFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [uploading, setUploading] = useState(false)
    const [imageUrl, setImageUrl] = useState(review?.image_url || "")

    // Handle File Upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const supabase = createClient()
            const fileExt = file.name.split('.').pop()
            const fileName = `reviews/${Date.now()}.${fileExt}`

            // Ensure bucket exists (using public products bucket for now or create a new one? generic 'public' bucket is better)
            // Let's use 'products' bucket since it's already public, or 'slips'. 'products' is safer for public view.
            // Ideally should be 'content' or 'reviews'. Let's reuse 'products' bucket but organized folder.
            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(fileName, file)

            if (uploadError) {
                console.error("Upload error:", uploadError)
                alert("Upload failed: " + uploadError.message)
                return
            }

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(fileName)

            setImageUrl(publicUrl)
        } catch (error) {
            console.error(error)
            alert("Upload failed")
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (formData: FormData) => {
        // Append image URL if not present (although input hidden handles it)
        if (imageUrl) {
            formData.set('imageUrl', imageUrl)
        }

        startTransition(async () => {
            const result = await upsertReview(null, formData)
            if (result.success) {
                router.push('/admin/reviews')
            } else {
                alert(result.message)
            }
        })
    }

    return (
        <form action={handleSubmit} className="space-y-8 max-w-2xl">
            {review?.id && <input type="hidden" name="id" value={review.id} />}
            <input type="hidden" name="imageUrl" value={imageUrl} />

            <div className="grid gap-4 bg-white p-6 rounded-lg border shadow-sm">

                {/* Image Input Selection */}
                <div className="space-y-4">
                    <Label>Review Image Source</Label>

                    {/* Option 1: URL Input */}
                    <div className="space-y-2">
                        <Label htmlFor="manualUrl" className="text-xs text-muted-foreground">Option 1: Paste Image URL</Label>
                        <Input
                            id="manualUrl"
                            name="manualUrl"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="text-center text-xs text-muted-foreground font-bold">- OR -</div>

                    {/* Option 2: File Upload */}
                    <div className="flex items-center gap-4">
                        <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border border-dashed border-gray-300 flex items-center justify-center relative shrink-0">
                            {imageUrl ? (
                                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-gray-400 text-xs">No image</span>
                            )}
                            {uploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader2 className="animate-spin text-white" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <Label className="text-xs text-muted-foreground mb-1 block">Option 2: Upload File</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                Recommended: Square image or 4:3 ratio.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Customer Name</Label>
                        <Input id="name" name="name" defaultValue={review?.name} required placeholder="e.g. Somchai T." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="car">Car Model</Label>
                        <Input id="car" name="car" defaultValue={review?.car} placeholder="e.g. Honda Civic" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="rating">Rating (Stars)</Label>
                    <select
                        name="rating"
                        id="rating"
                        defaultValue={review?.rating || 5}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="linkUrl">Original Post Link (Optional)</Label>
                    <Input id="linkUrl" name="linkUrl" defaultValue={review?.link_url} placeholder="e.g. https://facebook.com/post/..." />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="comment">Comment</Label>
                    <Textarea
                        id="comment"
                        name="comment"
                        defaultValue={review?.comment}
                        required
                        placeholder="Customer review text..."
                        rows={4}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isPending}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="bg-gold-500 text-black hover:bg-gold-600 font-bold"
                    disabled={isPending || uploading}
                >
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {review ? 'Update Review' : 'Create Review'}
                </Button>
            </div>
        </form>
    )
}
