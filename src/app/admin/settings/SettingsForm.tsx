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
                alert("All settings saved!")
            } else {
                alert(`Failed to save some settings:\n${errors.join('\n')}`)
            }
        })
    }

    return (
        <div className="space-y-6">
            {/* Remarks Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="remarks" className="text-lg font-bold">Checkout Remarks (HTML Supported)</Label>
                    <p className="text-sm text-gray-500">
                        This text appears on the checkout page under "หมายเหตุ". Use HTML for formatting.
                    </p>
                    <Textarea
                        id="remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="min-h-[200px] font-mono text-sm"
                    />
                </div>
            </div>

            {/* Legal Pages Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                <h2 className="text-lg font-bold">Legal Pages Content</h2>

                <div className="space-y-2">
                    <Label htmlFor="privacy" className="font-semibold">Privacy Policy (HTML Supported)</Label>
                    <p className="text-sm text-gray-500">
                        Content for /privacy page. Leave empty to use default.
                    </p>
                    <Textarea
                        id="privacy"
                        value={privacyContent}
                        onChange={(e) => setPrivacyContent(e.target.value)}
                        className="min-h-[300px] font-mono text-sm"
                    />
                </div>

                <div className="space-y-2 pt-4 border-t">
                    <Label htmlFor="terms" className="font-semibold">Terms of Service (HTML Supported)</Label>
                    <p className="text-sm text-gray-500">
                        Content for /terms page. Leave empty to use default.
                    </p>
                    <Textarea
                        id="terms"
                        value={termsContent}
                        onChange={(e) => setTermsContent(e.target.value)}
                        className="min-h-[300px] font-mono text-sm"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    className="bg-gold-500 text-black hover:bg-gold-600 font-bold"
                    disabled={isPending}
                >
                    {isPending ? 'Saving...' : 'Save All Changes'}
                </Button>
            </div>
        </div>
    )
}
