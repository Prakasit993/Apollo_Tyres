'use client'

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { updateSettings } from "@/app/admin/settings/actions"

interface FinanceFormProps {
    initialBankName: string
    initialBankAccNum: string
    initialBankAccName: string
    initialQrCodeUrl: string
}

export function FinanceForm({
    initialBankName,
    initialBankAccNum,
    initialBankAccName,
    initialQrCodeUrl
}: FinanceFormProps) {
    const [bankName, setBankName] = useState(initialBankName || "")
    const [bankAccNum, setBankAccNum] = useState(initialBankAccNum || "")
    const [bankAccName, setBankAccName] = useState(initialBankAccName || "")
    const [qrCodeUrl, setQrCodeUrl] = useState(initialQrCodeUrl || "")

    const [isPending, startTransition] = useTransition()

    const handleSave = () => {
        startTransition(async () => {
            const results = await Promise.all([
                updateSettings('bank_name', bankName),
                updateSettings('bank_account_number', bankAccNum),
                updateSettings('bank_account_name', bankAccName),
                updateSettings('qr_code_url', qrCodeUrl)
            ])

            const errors = results.filter(r => !r.success).map(r => r.message)

            if (errors.length === 0) {
                alert("บันทึกข้อมูลการเงินเรียบร้อย!")
            } else {
                alert(`เกิดข้อผิดพลาด:\n${errors.join('\n')}`)
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                <h2 className="text-lg font-bold text-charcoal-900">ตั้งค่าบัญชีธนาคาร</h2>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="bankName" className="text-charcoal-900">ชื่อธนาคาร (ไทย/อังกฤษ)</Label>
                        <Input
                            id="bankName"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            placeholder="เช่น กสิกรไทย / KBANK"
                            className="bg-white text-gray-900 border-gray-300"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bankAccNum" className="text-charcoal-900">เลขบัญชี</Label>
                        <Input
                            id="bankAccNum"
                            value={bankAccNum}
                            onChange={(e) => setBankAccNum(e.target.value)}
                            placeholder="เช่น 123-4-56789-0"
                            className="font-mono bg-white text-gray-900 border-gray-300"
                        />
                    </div>

                    <div className="col-span-2 space-y-2">
                        <Label htmlFor="bankAccName" className="text-charcoal-900">ชื่อบัญชี</Label>
                        <Input
                            id="bankAccName"
                            value={bankAccName}
                            onChange={(e) => setBankAccName(e.target.value)}
                            placeholder="เช่น บจก. อพอลโล ไทร์"
                            className="bg-white text-gray-900 border-gray-300"
                        />
                    </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-200">
                    <Label htmlFor="qrCodeUrl" className="text-charcoal-900">ลิงก์รูป QR Code (Supabase URL)</Label>
                    <p className="text-xs text-gray-500">อัปโหลดรูป QR Code ของคุณไปที่ Supabase Storage (ถัง 'slips' หรืออื่นๆ) และวางลิงก์ Public URL ที่นี่</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            id="qrCodeUrl"
                            value={qrCodeUrl}
                            onChange={(e) => setQrCodeUrl(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    {qrCodeUrl && (
                        <div className="mt-2 w-32 h-32 border border-gray-200 rounded overflow-hidden bg-gray-50">
                            <img src={qrCodeUrl} alt="QR Preview" className="w-full h-full object-contain" />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    className="bg-blue-600 text-white hover:bg-blue-700 font-bold"
                    disabled={isPending}
                >
                    {isPending ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
                </Button>
            </div>
        </div>
    )
}
