"use client"

import { useState } from "react"
import { useCartStore } from "@/lib/cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { placeOrder } from "./actions"
import { Loader2 } from "lucide-react"
import { updateProfileAddress } from "./actions"

interface CheckoutFormProps {
    user: any
    profile: any
    defaultAddress?: string
}

import { useRouter } from "next/navigation"

export function CheckoutForm({ user, profile, defaultAddress }: CheckoutFormProps) {
    const router = useRouter()
    const { items, getSubtotal, clearCart } = useCartStore()
    const [isLoading, setIsLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [error, setError] = useState<string | null>(null)

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

    // Handle saving local changes via Server Action
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
                        <RadioGroup defaultValue="transfer" name="paymentMethod" className="grid gap-4">
                            <div>
                                <RadioGroupItem value="transfer" id="transfer" className="peer sr-only" />
                                <Label
                                    htmlFor="transfer"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <span className="font-bold">Bank Transfer</span>
                                    <span className="text-sm text-muted-foreground">PromptPay / Mobile Banking</span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                                <Label
                                    htmlFor="cash"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <span className="font-bold">Cash on Delivery (COD)</span>
                                    <span className="text-sm text-muted-foreground">Pay when you receive items</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Remarks / Important Notes */}
                    <div className="bg-white p-6 rounded-lg border border-border/40 shadow-sm border-l-4 border-l-gold-500">
                        <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
                            หมายเหตุ**
                        </h2>
                        <ul className="space-y-3 text-sm text-gray-700 list-disc pl-4 marker:text-gold-500">
                            <li>
                                <div>
                                    <span className="font-bold">มารับของได้ที่:</span> กทม รามอินทรา โซนสวนสยาม ครับ
                                </div>
                                <div className="mt-2">
                                    <a
                                        href="https://maps.app.goo.gl/u8xZxi6XjyWpgm54A"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-red-700 shadow-md transition-all no-underline"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                        เปิดดูแผนที่ร้าน
                                    </a>
                                </div>
                            </li>
                            <li>
                                <span className="font-bold text-red-600">ราคานี้สำหรับ เงินสด และ เงินโอน เท่านั้น!!</span>
                            </li>
                            <li>
                                <span className="font-bold text-green-600">แถมฟรี!!</span> จุ๊บลมยาง คุณภาพดีที่สุด
                            </li>
                            <li>
                                <span className="font-bold">ราคาแต่ยางไม่รวมติดตั้ง</span><br />
                                <span className="text-gray-500 text-xs">(มีร้านติดตั้ง ใส่ ถ่วง ใกล้ๆ ผม ห่างกันแค่ 700 เมตร แนะนำให้ครับ)</span>
                            </li>
                            <li>
                                <span className="font-bold">ค่าติดตั้ง เริ่มต้น 4 เส้น 500.-</span><br />
                                <span className="text-gray-500 text-xs">(ใส่ ถอด ถ่วง 4 ล้อ ครับ)</span>
                            </li>
                            <li>
                                <span className="font-bold">ราคาไม่รวมจัดส่ง</span> (มีบริการจัดส่งได้ทั่วไทย)<br />
                                <ul className="list-none pl-2 mt-1 space-y-1 text-xs text-gray-600">
                                    <li>- <span className="font-semibold">กทม : ปริมณฑล</span> ส่งโดย Taxi กด มิสเตอร์ตามจริงครับ</li>
                                    <li>- <span className="font-semibold">ต่างจังหวัด</span> : ค่าขนส่งขึ้นอยู่กับแต่ละจังหวัดและขนาดยาง</li>
                                </ul>
                            </li>
                        </ul>
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
