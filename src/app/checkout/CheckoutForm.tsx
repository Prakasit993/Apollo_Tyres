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

interface CheckoutFormProps {
    user: any
    profile: any
    defaultAddress?: string
    remarks: string
    bankDetails: string
    qrCodeUrl: string
}

export function CheckoutForm({ user, profile, defaultAddress, remarks, bankDetails, qrCodeUrl }: CheckoutFormProps) {
    const router = useRouter()
    const { items, getSubtotal, clearCart } = useCartStore()
    const [isLoading, setIsLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [paymentMethod, setPaymentMethod] = useState("transfer")

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

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)

        // Populate missing fields from state if hidden inputs missed them (safeguard)
        for (const [key, value] of Object.entries(formValues)) {
            if (!formData.get(key)) formData.set(key, value)
        }

        // Ensure payment method is set
        formData.set('paymentMethod', paymentMethod)

        // Validate Slip for Transfer
        if (paymentMethod === 'transfer') {
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
                router.push('/orders?success=true')
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
                <h2 className="text-xl font-bold">Your cart is empty</h2>
                <p className="text-muted-foreground">Go add some tires first!</p>
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

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column: Shipping & Details */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-border/40 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold-500 text-black text-sm">1</span>
                                Shipping Details
                            </h2>
                            {!isEditing && (
                                <Button type="button" variant="link" onClick={() => setIsEditing(true)} className="text-gold-600 font-bold">
                                    Edit
                                </Button>
                            )}
                        </div>

                        {!isEditing ? (
                            <div className="space-y-3 text-sm text-gray-700">
                                <p><span className="font-semibold text-gray-900 block">Name:</span> {formValues.fullName || '-'}</p>
                                <p><span className="font-semibold text-gray-900 block">Phone:</span> {formValues.phone || '-'}</p>
                                <p><span className="font-semibold text-gray-900 block">Address:</span> {displayAddress || '-'}</p>

                                {/* Hidden inputs to ensure placeOrder gets granular data */}
                                {Object.entries(formValues).map(([key, value]) => (
                                    <input key={key} type="hidden" name={key} value={value} />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        value={formValues.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formValues.phone}
                                        onChange={handleInputChange}
                                        placeholder="08X-XXX-XXXX"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Address (House No / Street)</Label>
                                    <Textarea
                                        id="address"
                                        name="address"
                                        value={formValues.address}
                                        onChange={handleInputChange}
                                        placeholder="123/45 ..."
                                        required
                                        className="min-h-[80px]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="district">District (ตำบล)</Label>
                                        <Input
                                            id="district"
                                            name="district"
                                            value={formValues.district}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="amphoe">Amphoe (อำเภอ)</Label>
                                        <Input
                                            id="amphoe"
                                            name="amphoe"
                                            value={formValues.amphoe}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="province">Province (จังหวัด)</Label>
                                        <Input
                                            id="province"
                                            name="province"
                                            value={formValues.province}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zipcode">Zipcode</Label>
                                        <Input
                                            id="zipcode"
                                            name="zipcode"
                                            value={formValues.zipcode}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                                    <Button type="button" variant="default" size="sm" onClick={handleSaveDetails} className="bg-gold-500 text-black hover:bg-gold-600" disabled={isLoading}>
                                        {isLoading ? 'Saving...' : 'Save'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-border/40 shadow-sm">
                        <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold-500 text-black text-sm">2</span>
                            Payment Method
                        </h2>
                        <RadioGroup
                            value={paymentMethod}
                            onValueChange={setPaymentMethod}
                            name="paymentMethod"
                            className="grid gap-4"
                        >
                            <div className={cn("relative rounded-lg border-2 p-4 transition-all hover:bg-accent", paymentMethod === "transfer" ? "border-gold-500 bg-gold-50/10" : "border-muted")}>
                                <RadioGroupItem value="transfer" id="transfer" className="peer sr-only" />
                                <Label
                                    htmlFor="transfer"
                                    className="flex flex-col items-center justify-between cursor-pointer"
                                >
                                    <span className="font-bold">Bank Transfer</span>
                                    <span className="text-sm text-muted-foreground">PromptPay / Mobile Banking</span>
                                </Label>

                                {/* Bank Details Extension */}
                                {paymentMethod === "transfer" && (
                                    <div className="mt-4 pt-4 border-t border-dashed animate-in fade-in slide-in-from-top-2">
                                        <div className="text-center mb-4">
                                            {qrCodeUrl ? (
                                                <div className="mx-auto w-48 h-48 bg-gray-100 rounded-lg mb-2 overflow-hidden border">
                                                    <img src={qrCodeUrl} alt="Payment QR Code" className="w-full h-full object-contain" />
                                                </div>
                                            ) : (
                                                <div className="mx-auto w-48 h-48 bg-gray-100 rounded-lg mb-2 flex items-center justify-center text-gray-400 text-xs text-center p-2">
                                                    QR Code not set in Admin Settings
                                                </div>
                                            )}
                                            <p className="text-sm text-gray-500 font-mono mt-2 whitespace-pre-wrap">{bankDetails || "Bank details not set"}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="slip" className="text-sm font-bold text-red-600">Upload Payment Slip *</Label>
                                            <Input id="slip" name="slip" type="file" accept="image/*" className="cursor-pointer" />
                                            <p className="text-xs text-muted-foreground">Please upload the transfer slip to confirm your order.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={cn("relative rounded-lg border-2 p-4 transition-all hover:bg-accent", paymentMethod === "cash" ? "border-gold-500 bg-gold-50/10" : "border-muted")}>
                                <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                                <Label
                                    htmlFor="cash"
                                    className="flex flex-col items-center justify-between cursor-pointer"
                                >
                                    <span className="font-bold">Cash on Delivery (COD)</span>
                                    <span className="text-sm text-muted-foreground">Pay when you receive items</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Remarks / Important Notes - Using HTML from Editor */}
                    <div className="bg-white p-6 rounded-lg border border-border/40 shadow-sm border-l-4 border-l-gold-500">
                        <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
                            หมายเหตุ**
                        </h2>
                        <div
                            dangerouslySetInnerHTML={{ __html: remarks }}
                            className="prose prose-sm prose-gray max-w-none prose-headings:font-bold prose-headings:text-inherit prose-a:text-blue-600 hover:prose-a:underline"
                        />
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-border/40 shadow-sm sticky top-24">
                        <h2 className="text-xl font-heading font-bold mb-4">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span>{item.quantity} x {item.brand} {item.model}</span>
                                    <span className="font-mono">฿{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="border-t border-dashed my-2" />
                            <div className="flex justify-between font-bold text-lg text-gold-600">
                                <span>Total</span>
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
                            className="w-full bg-gold-500 hover:bg-gold-600 text-black font-bold h-12 text-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "CONFIRM ORDER"
                            )}
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-4">
                            By placing an order, you agree to our Terms of Service.
                        </p>
                    </div>
                </div>
            </div>
        </form>
    )
}
