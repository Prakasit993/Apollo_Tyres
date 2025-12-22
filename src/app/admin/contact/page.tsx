'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useTransition, useEffect, useState } from "react"
import { getContactSettings, saveContactSettings, type ContactSettings } from "./actions"
import { Loader2, Save } from "lucide-react"

export default function AdminContactPage() {
    const [isPending, startTransition] = useTransition()
    const [settings, setSettings] = useState<ContactSettings | null>(null)

    useEffect(() => {
        getContactSettings().then(setSettings)
    }, [])

    if (!settings) {
        return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-gold-500" /></div>
    }

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const res = await saveContactSettings(null, formData)
            if (res.success) {
                alert("บันทึกข้อมูลเรียบร้อย!")
            } else {
                alert(res.message)
            }
        })
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <h1 className="text-3xl font-black text-charcoal-900">จัดการข้อมูลติดต่อ</h1>
            <p className="text-gray-500">อัปเดตข้อมูลการติดต่อที่จะแสดงบนเว็บไซต์</p>

            <form action={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg border shadow-sm">

                <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2 text-charcoal-900">ที่ตั้งและแผนที่</h3>
                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-charcoal-900">ที่อยู่ร้าน</Label>
                        <Textarea
                            id="address"
                            name="address"
                            defaultValue={settings.address}
                            placeholder="กรอกที่อยู่เต็ม (รองรับการขึ้นบรรทัดใหม่)"
                            rows={4}
                            className="bg-white text-gray-900 border-gray-300"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mapUrl" className="text-charcoal-900">Google Maps Embed URL (เฉพาะ src="..." เท่านั้น)</Label>
                        <Textarea
                            id="mapUrl"
                            name="mapUrl"
                            defaultValue={settings.mapUrl}
                            placeholder="https://www.google.com/maps/embed?..."
                            className="min-h-[100px] font-mono text-xs bg-white text-gray-900 border-gray-300"
                            onChange={(e) => {
                                let val = e.target.value;

                                // Auto-extract src from iframe tag if pasted
                                if (val.includes('<iframe') && val.includes('src="')) {
                                    const srcMatch = val.match(/src="([^"]+)"/);
                                    if (srcMatch && srcMatch[1]) {
                                        val = srcMatch[1];
                                        e.target.value = val;
                                    }
                                }

                                const warningEl = document.getElementById('map-warning');
                                if (warningEl) {
                                    if (val && !val.includes('google.com/maps/embed')) {
                                        warningEl.style.display = 'block';
                                    } else {
                                        warningEl.style.display = 'none';
                                    }
                                }
                            }}
                        />
                        <p id="map-warning" className="text-xs font-bold text-red-500 hidden mt-1">
                            ⚠️ คำเตือน: รูปแบบลิงก์ไม่ถูกต้อง โปรดคัดลอกลิงก์จากเมนู "แชร์ &gt; ฝังแผนที่" ของ Google Maps
                        </p>
                        <p className="text-xs text-muted-foreground">
                            คัดลอก URL จากแอตทริบิวต์ "src" ในรหัส "ฝังแผนที่" ของ Google Maps
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2 text-charcoal-900">เบอร์โทรศัพท์</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone1" className="text-charcoal-900">เบอร์หลัก (Phone 1)</Label>
                            <Input id="phone1" name="phone1" defaultValue={settings.phone1} placeholder="02-xxx-xxxx" className="bg-white text-gray-900 border-gray-300" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone2" className="text-charcoal-900">เบอร์มือถือ (Phone 2)</Label>
                            <Input id="phone2" name="phone2" defaultValue={settings.phone2} placeholder="08x-xxx-xxxx" className="bg-white text-gray-900 border-gray-300" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2 text-charcoal-900">เวลาทำการ</h3>
                    <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="hoursLabel1" className="text-charcoal-900">ข้อความ 1 (เช่น จันทร์ - เสาร์)</Label>
                                <Input id="hoursLabel1" name="hoursLabel1" defaultValue={settings.hoursLabel1} placeholder="จันทร์ - เสาร์" className="bg-white text-gray-900 border-gray-300" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hoursWeekdays" className="text-charcoal-900">เวลา 1</Label>
                                <Input id="hoursWeekdays" name="hoursWeekdays" defaultValue={settings.hoursWeekdays} placeholder="08:30 - 18:00" className="bg-white text-gray-900 border-gray-300" />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="hoursLabel2" className="text-charcoal-900">ข้อความ 2 (เช่น วันอาทิตย์)</Label>
                                <Input id="hoursLabel2" name="hoursLabel2" defaultValue={settings.hoursLabel2} placeholder="วันอาทิตย์" className="bg-white text-gray-900 border-gray-300" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hoursWeekend" className="text-charcoal-900">เวลา 2</Label>
                                <Input id="hoursWeekend" name="hoursWeekend" defaultValue={settings.hoursWeekend} placeholder="หยุดทำการ" className="bg-white text-gray-900 border-gray-300" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2 text-charcoal-900">ช่องทางออนไลน์</h3>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-charcoal-900">อีเมล</Label>
                        <Input id="email" name="email" defaultValue={settings.email} placeholder="info@example.com" className="bg-white text-gray-900 border-gray-300" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="facebook" className="text-charcoal-900">Facebook Link / ชื่อ</Label>
                            <Input id="facebook" name="facebook" defaultValue={settings.facebook} placeholder="https://facebook.com/..." className="bg-white text-gray-900 border-gray-300" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="line" className="text-charcoal-900">Line ID / ลิงก์</Label>
                            <Input id="line" name="line" defaultValue={settings.line} placeholder="@yourshop" className="bg-white text-gray-900 border-gray-300" />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-gold-500 text-black hover:bg-gold-600 font-bold min-w-[150px]"
                    >
                        {isPending ? <Loader2 className="mr-2 animate-spin" /> : <Save className="mr-2 w-4 h-4" />}
                        บันทึกการเปลี่ยนแปลง
                    </Button>
                </div>

            </form>
        </div>
    )
}
