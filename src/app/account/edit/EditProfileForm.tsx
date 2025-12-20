'use client'

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { updateProfile } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function EditProfileForm({ profile, user }: { profile: any, user: any }) {
    const router = useRouter()
    const [state, formAction, isPending] = useActionState(updateProfile, null)

    const defaultName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || ''

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name (ชื่อ-นามสกุล)</Label>
                    <Input id="fullName" name="fullName" defaultValue={defaultName} required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (เบอร์โทร)</Label>
                    <Input id="phone" name="phone" type="tel" defaultValue={profile?.phone || ''} required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address">Address (ที่อยู่ / บ้านเลขที่ / ซอย)</Label>
                    <Textarea id="address" name="address" defaultValue={profile?.address || ''} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="district">District (ตำบล/แขวง)</Label>
                        <Input id="district" name="district" defaultValue={profile?.district || ''} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="amphoe">Amphoe (อำเภอ/เขต)</Label>
                        <Input id="amphoe" name="amphoe" defaultValue={profile?.amphoe || ''} required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="province">Province (จังหวัด)</Label>
                        <Input id="province" name="province" defaultValue={profile?.province || ''} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="zipcode">Zipcode (รหัสไปรษณีย์)</Label>
                        <Input id="zipcode" name="zipcode" defaultValue={profile?.zipcode || ''} required />
                    </div>
                </div>
            </div>

            {state?.message && (
                <p className="text-red-500 text-center text-sm font-medium">{state.message}</p>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending} className="w-full bg-gold-500 text-charcoal-900 hover:bg-gold-600 font-bold">
                    {isPending ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </form>
    )
}
