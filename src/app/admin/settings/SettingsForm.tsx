'use client'

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateSettings } from "./actions"

interface SettingsFormProps {
    initialRemarks: string
    initialPrivacyContent: string
    initialTermsContent: string
}

export function SettingsForm({
    initialRemarks,
    initialPrivacyContent,
    initialTermsContent
}: SettingsFormProps) {
    const [remarks, setRemarks] = useState(initialRemarks || "")
    const [privacyContent, setPrivacyContent] = useState(initialPrivacyContent || "")
    const [termsContent, setTermsContent] = useState(initialTermsContent || "")

    const [isPending, startTransition] = useTransition()

    const handleSave = () => {
        startTransition(async () => {
            const results = await Promise.all([
                updateSettings('checkout_remarks', remarks),
                updateSettings('privacy_content', privacyContent),
                updateSettings('terms_content', termsContent)
            ])

            const errors = results.filter(r => !r.success).map(r => r.message)

            if (errors.length === 0) {
                alert("บันทึกการตั้งค่าทั้งหมดเรียบร้อย!")
            } else {
                alert(`เกิดข้อผิดพลาดในการบันทึก:\n${errors.join('\n')}`)
            }
        })
    }

    return (
        <div className="space-y-6">
            {/* Remarks Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="remarks" className="text-lg font-bold text-charcoal-900">หมายเหตุในหน้าชำระเงิน (รองรับ HTML)</Label>
                    <p className="text-sm text-gray-500">
                        ข้อความนี้จะแสดงในหน้าชำระเงินใต้หัวข้อ "หมายเหตุ". สามารถใช้ HTML ได้
                    </p>
                    <Textarea
                        id="remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="min-h-[200px] font-mono text-sm bg-white text-gray-900 border-gray-300"
                    />
                </div>
            </div>

            {/* Legal Pages Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                <h2 className="text-lg font-bold text-charcoal-900">เนื้อหาหน้ากฏหมาย</h2>

                <div className="space-y-2">
                    <Label htmlFor="privacy" className="font-semibold text-charcoal-900">นโยบายความเป็นส่วนตัว (รองรับ HTML)</Label>
                    <p className="text-sm text-gray-500">
                        เนื้อหาสำหรับหน้า /privacy (เว้นว่างไว้เพื่อใช้ค่าเริ่มต้น)
                    </p>
                    <Textarea
                        id="privacy"
                        value={privacyContent}
                        onChange={(e) => setPrivacyContent(e.target.value)}
                        className="min-h-[300px] font-mono text-sm bg-white text-gray-900 border-gray-300"
                    />
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-200">
                    <Label htmlFor="terms" className="font-semibold text-charcoal-900">เงื่อนไขการให้บริการ (รองรับ HTML)</Label>
                    <p className="text-sm text-gray-500">
                        เนื้อหาสำหรับหน้า /terms (เว้นว่างไว้เพื่อใช้ค่าเริ่มต้น)
                    </p>
                    <Textarea
                        id="terms"
                        value={termsContent}
                        onChange={(e) => setTermsContent(e.target.value)}
                        className="min-h-[300px] font-mono text-sm bg-white text-gray-900 border-gray-300"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    className="bg-blue-600 text-white hover:bg-blue-700 font-bold"
                    disabled={isPending}
                >
                    {isPending ? 'กำลังบันทึก...' : 'บันทึกทั้งหมด'}
                </Button>
            </div>
        </div>
    )
}
