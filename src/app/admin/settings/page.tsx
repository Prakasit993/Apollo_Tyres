import { getSettings } from "./actions"
import { SettingsForm } from "./SettingsForm"

export default async function SettingsPage() {
    const remarks = await getSettings('checkout_remarks')
    const privacyContent = await getSettings('privacy_content')
    const termsContent = await getSettings('terms_content')

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-heading font-black text-charcoal-900">Site Settings</h1>
            <SettingsForm
                initialRemarks={remarks}
                initialPrivacyContent={privacyContent}
                initialTermsContent={termsContent}
            />
        </div>
    )
}
