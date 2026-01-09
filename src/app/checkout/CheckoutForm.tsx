"use client"

import { useState } from "react"
import { useCartStore } from "@/lib/cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { placeOrder, updateProfileAddress } from "./actions"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

import { Modal } from "@/components/ui/custom-modal"
import { Copy, QrCode, Building2, Upload, CheckCircle } from "lucide-react"

interface CheckoutFormProps {
    user: any
    profile: any
    defaultAddress?: string
    remarks: string
    bankDetails: {
        bankName: string
        accountNumber: string
        accountName: string
    }
    qrCodeUrl: string
}

export function CheckoutForm({ user, profile, defaultAddress, remarks, bankDetails, qrCodeUrl }: CheckoutFormProps) {
    const router = useRouter()
    const { items, getSubtotal, clearCart } = useCartStore()
    const [isLoading, setIsLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [paymentMethod, setPaymentMethod] = useState("transfer_bank")
    const [showBankModal, setShowBankModal] = useState(false)
    const [showQrModal, setShowQrModal] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [successOrderId, setSuccessOrderId] = useState<string | null>(null)
    const [slipFileName, setSlipFileName] = useState<string | null>(null)

    // Local state for form values
    const [formValues, setFormValues] = useState({
        fullName: profile?.full_name || "",
        phone: profile?.phone || "",
        address: profile?.address || "", // Just house number
        district: profile?.district || "",
        amphoe: profile?.amphoe || "",
        province: profile?.province || "",
        zipcode: profile?.zipcode || ""
    })

    // Calculate total
    const total = getSubtotal()

    const handleSaveDetails = async () => {
        setIsLoading(true)
        const formData = new FormData()
        Object.entries(formValues).forEach(([key, value]) => formData.append(key, value))

        const result = await updateProfileAddress(formData)
        setIsLoading(false)

        if (result?.success) {
            setIsEditing(false)
        } else {
            setError(result?.message || "Failed to save")
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormValues(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handlePaymentChange = (value: string) => {
        setPaymentMethod(value)
        if (value === 'transfer_bank') {
            setShowBankModal(true)
        } else if (value === 'transfer_qr') {
            setShowQrModal(true)
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)

        // Populate missing fields from state if hidden inputs missed them (safeguard)
        for (const [key, value] of Object.entries(formValues)) {
            if (!formData.get(key)) formData.set(key, value)
        }

        // Map UI payment methods to backend expectations
        const actualPaymentMethod = (paymentMethod === 'transfer_bank' || paymentMethod === 'transfer_qr')
            ? 'transfer'
            : 'cash'

        formData.set('paymentMethod', actualPaymentMethod)

        // Validate Slip for Transfer
        if (actualPaymentMethod === 'transfer') {
            const file = formData.get('slip') as File
            if (!file || file.size === 0) {
                setError("Please upload the payment slip.")
                setIsLoading(false)
                return
            }
        }

        try {
            const result = await placeOrder(
                {},
                formData,
                items,
                total
            )

            if (result?.errors) {
                const errorMsg = Object.values(result.errors).flat().join('\n')
                setError(errorMsg)
                setIsEditing(true)
            } else if (result?.message) {
                setError(result.message)
            } else if (result?.success) {
                clearCart()
                setSuccessOrderId(result.orderId!)
                setShowSuccessModal(true)
                // router.push(`/account/orders/${result.orderId}?success=true`)
            }
        } catch (e) {
            setError("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-10">
                <h2 className="text-xl font-bold text-gray-100">ตะกร้าสินค้าว่างเปล่า</h2>
                <p className="text-muted-foreground">ไปเลือกซื้อยางก่อนเลย!</p>
            </div>
        )
    }

    // Construct display address from current state
    const displayAddress = [
        formValues.address,
        formValues.district ? `ต.${formValues.district} ` : null,
        formValues.amphoe ? `อ.${formValues.amphoe} ` : null,
        formValues.province ? `จ.${formValues.province} ` : null,
        formValues.zipcode
    ].filter(Boolean).join(" ")

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        alert("คัดลอกเรียบร้อยแล้ว!")
    }

    return (
        <>
            <Modal isOpen={showBankModal} onClose={() => setShowBankModal(false)} title="รายละเอียดการโอนเงิน (Bank Transfer)">
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3 border">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase">ธนาคาร (Bank Name)</p>
                            <p className="font-bold text-lg text-gray-900">{bankDetails.bankName || '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase">เลขบัญชี (Account Number)</p>
                            <div className="flex items-center gap-2">
                                <p className="font-mono font-bold text-xl tracking-wider text-blue-600">{bankDetails.accountNumber || '-'}</p>
                                {bankDetails.accountNumber && (
                                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(bankDetails.accountNumber)}>
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase">ชื่อบัญชี (Account Name)</p>
                            <p className="font-medium text-gray-900">{bankDetails.accountName || '-'}</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <Button onClick={() => setShowBankModal(false)} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            ปิด (Close)
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={showQrModal} onClose={() => setShowQrModal(false)} title="สแกน QR Code">
                <div className="space-y-4 flex flex-col items-center">
                    {qrCodeUrl ? (
                        <div className="relative w-64 h-64 bg-white rounded-lg p-2 border shadow-sm">
                            <img src={qrCodeUrl} alt="Payment QR Code" className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <div className="w-64 h-64 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400">
                            ไม่พบ QR Code
                        </div>
                    )}
                    <p className="text-sm text-center text-muted-foreground">
                        สแกนด้วยแอพธนาคารเพื่อชำระเงิน
                    </p>
                    <Button onClick={() => setShowQrModal(false)} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        ปิด (Close)
                    </Button>
                </div>
            </Modal>

            <Modal isOpen={showSuccessModal} onClose={() => { }} title="ยืนยันการสั่งซื้อเรียบร้อย">
                <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">ขอบคุณสำหรับการสั่งซื้อ!</h3>
                    <p className="text-gray-500 max-w-xs">
                        เราได้รับคำสั่งซื้อของคุณแล้วและกำลังดำเนินการตรวจสอบ
                    </p>
                    <div className="pt-4 w-full">
                        <Button
                            onClick={() => router.push(`/account/orders/${successOrderId}?success=true`)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                        >
                            ดูรายการสั่งซื้อ
                        </Button>
                    </div>
                </div>
            </Modal>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column: Shipping & Details */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg border border-border/40 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-heading font-bold flex items-center gap-2 text-gray-900">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm">1</span>
                                    ข้อมูลการจัดส่ง
                                </h2>
                                {!isEditing && (
                                    <Button type="button" variant="link" onClick={() => setIsEditing(true)} className="text-blue-600 font-bold">
                                        แก้ไข
                                    </Button>
                                )}
                            </div>

                            {!isEditing ? (
                                <div className="space-y-3 text-sm text-gray-700">
                                    <p><span className="font-semibold text-gray-900 block">ชื่อ-นามสกุล:</span> {formValues.fullName || '-'}</p>
                                    <p><span className="font-semibold text-gray-900 block">เบอร์โทรศัพท์:</span> {formValues.phone || '-'}</p>
                                    <p><span className="font-semibold text-gray-900 block">ที่อยู่:</span> {displayAddress || '-'}</p>

                                    {/* Hidden inputs to ensure placeOrder gets granular data */}
                                    {Object.entries(formValues).map(([key, value]) => (
                                        <input key={key} type="hidden" name={key} value={value} />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4 text-gray-900">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="text-gray-900">ชื่อ-นามสกุล</Label>
                                        <Input
                                            id="fullName"
                                            name="fullName"
                                            value={formValues.fullName}
                                            onChange={handleInputChange}
                                            placeholder="กรอกชื่อ-นามสกุล"
                                            required
                                            className="bg-white text-gray-900 border-gray-300"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-gray-900">เบอร์โทรศัพท์</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={formValues.phone}
                                            onChange={handleInputChange}
                                            placeholder="08X-XXX-XXXX"
                                            required
                                            className="bg-white text-gray-900 border-gray-300"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address" className="text-gray-900">ที่อยู่ (บ้านเลขที่ / ถนน / ซอย)</Label>
                                        <Textarea
                                            id="address"
                                            name="address"
                                            value={formValues.address}
                                            onChange={handleInputChange}
                                            placeholder="123/45 หมู่บ้าน..."
                                            required
                                            className="min-h-[80px] bg-white text-gray-900 border-gray-300"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="district" className="text-gray-900">แขวง / ตำบล</Label>
                                            <Input
                                                id="district"
                                                name="district"
                                                value={formValues.district}
                                                onChange={handleInputChange}
                                                required
                                                className="bg-white text-gray-900 border-gray-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="amphoe" className="text-gray-900">เขต / อำเภอ</Label>
                                            <Input
                                                id="amphoe"
                                                name="amphoe"
                                                value={formValues.amphoe}
                                                onChange={handleInputChange}
                                                required
                                                className="bg-white text-gray-900 border-gray-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="province" className="text-gray-900">จังหวัด</Label>
                                            <Input
                                                id="province"
                                                name="province"
                                                value={formValues.province}
                                                onChange={handleInputChange}
                                                required
                                                className="bg-white text-gray-900 border-gray-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="zipcode" className="text-gray-900">รหัสไปรษณีย์</Label>
                                            <Input
                                                id="zipcode"
                                                name="zipcode"
                                                value={formValues.zipcode}
                                                onChange={handleInputChange}
                                                required
                                                className="bg-white text-gray-900 border-gray-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="text-gray-600">ยกเลิก</Button>
                                        <Button type="button" variant="default" size="sm" onClick={handleSaveDetails} className="bg-blue-600 text-white hover:bg-blue-700 font-bold" disabled={isLoading}>
                                            {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-lg border border-border/40 shadow-sm text-gray-900">
                            <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2 text-gray-900">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm">2</span>
                                วิธีการชำระเงิน
                            </h2>
                            <RadioGroup
                                value={paymentMethod}
                                onValueChange={handlePaymentChange}
                                name="paymentMethodUI"
                                className="grid gap-4"
                            >
                                <div
                                    className={cn("relative rounded-lg border-2 p-4 transition-all hover:bg-accent cursor-pointer", paymentMethod === "transfer_bank" ? "border-blue-500 bg-blue-50/20" : "border-gray-200")}
                                    onClick={() => {
                                        if (paymentMethod === "transfer_bank") setShowBankModal(true)
                                    }}
                                >
                                    <RadioGroupItem value="transfer_bank" id="transfer_bank" className="peer sr-only" />
                                    <Label
                                        htmlFor="transfer_bank"
                                        className="flex flex-row items-center gap-4 cursor-pointer"
                                    >
                                        <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Building2 className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900">โอนเงินผ่านธนาคาร (Bank Transfer)</span>
                                            <span className="text-sm text-gray-500">ดูเลขบัญชีธนาคาร</span>
                                        </div>
                                    </Label>
                                </div>

                                <div
                                    className={cn("relative rounded-lg border-2 p-4 transition-all hover:bg-accent cursor-pointer", paymentMethod === "transfer_qr" ? "border-blue-500 bg-blue-50/20" : "border-gray-200")}
                                    onClick={() => {
                                        if (paymentMethod === "transfer_qr") setShowQrModal(true)
                                    }}
                                >
                                    <RadioGroupItem value="transfer_qr" id="transfer_qr" className="peer sr-only" />
                                    <Label
                                        htmlFor="transfer_qr"
                                        className="flex flex-row items-center gap-4 cursor-pointer"
                                    >
                                        <div className="h-10 w-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <QrCode className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900">สแกน QR Code</span>
                                            <span className="text-sm text-gray-500">พร้อมเพย์ / โมบายแบงค์กิ้ง</span>
                                        </div>
                                    </Label>
                                </div>

                                {(paymentMethod === "transfer_bank" || paymentMethod === "transfer_qr") && (
                                    <div className="mt-2 pt-4 px-2 border-t border-dashed animate-in fade-in slide-in-from-top-2">
                                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mb-4 text-sm text-yellow-800">
                                            กรุณา <strong>{paymentMethod === 'transfer_bank' ? 'โอนเงิน' : 'สแกน QR Code'}</strong> ตามรายละเอียดที่แจ้ง แล้วแนบสลิปด้านล่าง
                                            <Button type="button" variant="link" className="text-blue-600 h-auto p-0 ml-1 font-bold" onClick={() => paymentMethod === 'transfer_bank' ? setShowBankModal(true) : setShowQrModal(true)}>
                                                (ดูรายละเอียดอีกครั้ง)
                                            </Button>
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="slip" className="text-sm font-bold text-red-600">แนบหลักฐานการโอนเงิน (สลิป) *</Label>

                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <Input
                                                        id="slip"
                                                        name="slip"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0]
                                                            if (file) {
                                                                setSlipFileName(file.name)
                                                            } else {
                                                                setSlipFileName(null)
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => document.getElementById('slip')?.click()}
                                                        className="bg-white border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-700 w-full sm:w-auto"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Upload className="h-4 w-4" />
                                                            {slipFileName ? 'เปลี่ยนไฟล์' : 'เลือกไฟล์'}
                                                        </div>
                                                    </Button>
                                                </div>
                                                <span className="text-sm text-gray-500 italic truncate max-w-[200px]">
                                                    {slipFileName || 'ยังไม่ได้เลือกไฟล์'}
                                                </span>
                                            </div>

                                            <p className="text-xs text-muted-foreground">รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</p>
                                        </div>
                                    </div>
                                )}

                                <div className={cn("relative rounded-lg border-2 p-4 transition-all hover:bg-accent cursor-pointer", paymentMethod === "cash" ? "border-blue-500 bg-blue-50/20" : "border-gray-200")}>
                                    <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                                    <Label
                                        htmlFor="cash"
                                        className="flex flex-col items-center justify-between cursor-pointer"
                                    >
                                        <span className="font-bold text-gray-900">เก็บเงินปลายทาง (COD)</span>
                                        <span className="text-sm text-muted-foreground">ชำระเงินเมื่อได้รับสินค้า</span>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Remarks / Important Notes - Using HTML from Editor */}
                        <div className="bg-white p-6 rounded-lg border border-border/40 shadow-sm border-l-4 border-l-blue-500 text-gray-900">
                            <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2 text-charcoal-900">
                                หมายเหตุ**
                            </h2>
                            <div
                                dangerouslySetInnerHTML={{ __html: remarks }}
                                className="prose prose-sm prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 text-gray-900 prose-a:text-blue-600 hover:prose-a:underline whitespace-pre-line"
                            />
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg border border-border/40 shadow-sm sticky top-24">
                            <h2 className="text-xl font-heading font-bold mb-4 text-charcoal-900">สรุปคำสั่งซื้อ (Order Summary)</h2>

                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm text-gray-900">
                                        <span>{item.quantity} x {item.brand} {item.model}</span>
                                        <span className="font-mono text-gray-900">฿{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                                <div className="border-t border-dashed my-2 border-gray-300" />
                                <div className="flex justify-between font-bold text-lg text-blue-600">
                                    <span>ยอดรวม (Total)</span>
                                    <span>฿{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <input type="hidden" name="deliveryMethod" value="standard" />

                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading || !formValues.address || !formValues.phone || !formValues.fullName}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        กำลังดำเนินการ...
                                    </>
                                ) : (
                                    "ยืนยันการสั่งซื้อ (CONFIRM ORDER)"
                                )}
                            </Button>
                            {(!formValues.address || !formValues.phone || !formValues.fullName) && (
                                <p className="text-sm text-red-500 text-center mt-2 font-medium">
                                    กรุณากรอกข้อมูลการจัดส่งให้ครบถ้วนก่อนยืนยัน
                                </p>
                            )}
                            <p className="text-xs text-center text-muted-foreground mt-4">
                                การกดสั่งซื้อถือว่าคุณยอมรับเงื่อนไขการให้บริการของเรา
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}
