'use client'

import { useActionState } from "react"
import { submitOnboarding } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function OnboardingPage() {
    const [state, formAction, isPending] = useActionState(submitOnboarding, null)

    return (
        <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden border border-gold-500/20">
                <div className="bg-charcoal-900 p-6 text-center">
                    <h1 className="text-2xl font-heading font-black text-white">WELCOME to TIRE SELECT</h1>
                    <p className="text-gold-500 text-sm mt-1">Please complete your profile to continue</p>
                </div>

                <form action={formAction} className="p-8 space-y-6 text-charcoal-900">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name (ชื่อ-นามสกุล)</Label>
                            <Input id="fullName" name="fullName" required placeholder="สมชาย ใจดี" className="bg-gray-50 border-gray-200 text-charcoal-900 placeholder:text-gray-400" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number (เบอร์โทร)</Label>
                            <Input id="phone" name="phone" type="tel" required placeholder="0812345678" className="bg-gray-50 border-gray-200 text-charcoal-900 placeholder:text-gray-400" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address (ที่อยู่ / บ้านเลขที่ / ซอย)</Label>
                            <Textarea id="address" name="address" required placeholder="123/45 หมู่บ้าน..." className="bg-gray-50 border-gray-200 text-charcoal-900 placeholder:text-gray-400" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="district">District (ตำบล/แขวง)</Label>
                                <Input id="district" name="district" required className="bg-gray-50 border-gray-200 text-charcoal-900" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amphoe">Amphoe (อำเภอ/เขต)</Label>
                                <Input id="amphoe" name="amphoe" required className="bg-gray-50 border-gray-200 text-charcoal-900" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="province">Province (จังหวัด)</Label>
                                <Input id="province" name="province" required className="bg-gray-50 border-gray-200 text-charcoal-900" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zipcode">Zipcode (รหัสไปรษณีย์)</Label>
                                <Input id="zipcode" name="zipcode" required className="bg-gray-50 border-gray-200 text-charcoal-900" />
                            </div>
                        </div>
                    </div>

                    {state?.message && (
                        <p className="text-red-500 text-center text-sm font-medium">{state.message}</p>
                    )}

                    <Button type="submit" disabled={isPending} className="w-full bg-gold-500 text-charcoal-900 hover:bg-gold-600 font-bold text-lg h-12">
                        {isPending ? 'Saving...' : 'Save & Continue'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
