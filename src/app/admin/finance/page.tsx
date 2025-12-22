import { getSettings } from "../settings/actions"
import { FinanceForm } from "./FinanceForm"

export default async function FinancePage() {
    const bankName = await getSettings('bank_name')
    const bankAccNum = await getSettings('bank_account_number')
    const bankAccName = await getSettings('bank_account_name')
    const qrCodeUrl = await getSettings('qr_code_url')

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-heading font-black text-charcoal-900">ตั้งค่าการเงิน</h1>
            <FinanceForm
                initialBankName={bankName}
                initialBankAccNum={bankAccNum}
                initialBankAccName={bankAccName}
                initialQrCodeUrl={qrCodeUrl}
            />
        </div>
    )
}
