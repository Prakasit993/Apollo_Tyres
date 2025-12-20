import { getSettings } from "./actions"
import { SettingsForm } from "./SettingsForm"

export default async function SettingsPage() {
    const remarks = await getSettings('checkout_remarks')
    const bankDetails = await getSettings('bank_details')
    const qrCodeUrl = await getSettings('qr_code_url')

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-heading font-black text-charcoal-900">Site Settings</h1>
            <SettingsForm
                initialRemarks={remarks}
                initialBankDetails={bankDetails}
                initialQrCodeUrl={qrCodeUrl}
            />
        </div>
    )
}
