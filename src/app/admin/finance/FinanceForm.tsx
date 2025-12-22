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
                alert("Finance settings saved!")
            } else {
                alert(`Failed to save settings:\n${errors.join('\n')}`)
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                <h2 className="text-lg font-bold">Bank Transfer Settings</h2>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name (English/Thai)</Label>
                        <Input
                            id="bankName"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            placeholder="e.g. KBANK / Kasikorn"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bankAccNum">Account Number</Label>
                        <Input
                            id="bankAccNum"
                            value={bankAccNum}
                            onChange={(e) => setBankAccNum(e.target.value)}
                            placeholder="e.g. 123-4-56789-0"
                            className="font-mono"
                        />
                    </div>

                    <div className="col-span-2 space-y-2">
                        <Label htmlFor="bankAccName">Account Name</Label>
                        <Input
                            id="bankAccName"
                            value={bankAccName}
                            onChange={(e) => setBankAccName(e.target.value)}
                            placeholder="e.g. Apollo Shop Co., Ltd."
                        />
                    </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                    <Label htmlFor="qrCodeUrl">QR Code Image URL</Label>
                    <p className="text-xs text-muted-foreground">Upload your QR code to Supabase Storage (bucket 'slips' or similar) and paste the Public URL here.</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            id="qrCodeUrl"
                            value={qrCodeUrl}
                            onChange={(e) => setQrCodeUrl(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    {qrCodeUrl && (
                        <div className="mt-2 w-32 h-32 border rounded overflow-hidden bg-gray-50">
                            <img src={qrCodeUrl} alt="QR Preview" className="w-full h-full object-contain" />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    className="bg-gold-500 text-black hover:bg-gold-600 font-bold"
                    disabled={isPending}
                >
                    {isPending ? 'Saving...' : 'Save Finance Settings'}
                </Button>
            </div>
        </div>
    )
}
