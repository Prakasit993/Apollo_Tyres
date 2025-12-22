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
                    <Label htmlFor="fullName" className="text-charcoal-900">ชื่อ-นามสกุล</Label>
                    <Input id="fullName" name="fullName" defaultValue={defaultName} required className="bg-white text-gray-900 border-gray-300" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone" className="text-charcoal-900">เบอร์โทรศัพท์</Label>
                    <Input id="phone" name="phone" type="tel" defaultValue={profile?.phone || ''} required className="bg-white text-gray-900 border-gray-300" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address" className="text-charcoal-900">ที่อยู่</Label>
                    <Textarea id="address" name="address" defaultValue={profile?.address || ''} required className="bg-white text-gray-900 border-gray-300" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="district" className="text-charcoal-900">ตำบล/แขวง</Label>
                        <Input id="district" name="district" defaultValue={profile?.district || ''} required className="bg-white text-gray-900 border-gray-300" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="amphoe" className="text-charcoal-900">อำเภอ/เขต</Label>
                        <Input id="amphoe" name="amphoe" defaultValue={profile?.amphoe || ''} required className="bg-white text-gray-900 border-gray-300" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="province" className="text-charcoal-900">จังหวัด</Label>
                        <Input id="province" name="province" defaultValue={profile?.province || ''} required className="bg-white text-gray-900 border-gray-300" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="zipcode" className="text-charcoal-900">รหัสไปรษณีย์</Label>
                        <Input id="zipcode" name="zipcode" defaultValue={profile?.zipcode || ''} required className="bg-white text-gray-900 border-gray-300" />
                    </div>
                </div>
            </div>

            {state?.message && (
                <p className="text-red-500 text-center text-sm font-medium">{state.message}</p>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full text-gray-700"
                    onClick={() => {
                        if (confirm("ถ้าคุณยกเลิก คุณจะไม่สามารถทำการสั่งซื้อได้จนกว่าจะกรอกข้อมูลครบถ้วน\nต้องการกลับไปหน้าหลักหรือไม่?")) {
                            router.push('/')
                        }
                    }}
                >
                    ยกเลิก
                </Button>
                <Button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold">
                    {isPending ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                </Button>
            </div>
        </form>
    )
}
