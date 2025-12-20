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
                alert("Saved successfully!")
            } else {
                alert(res.message)
            }
        })
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <h1 className="text-3xl font-black text-charcoal-900">Manage Contact Page</h1>
            <p className="text-gray-500">Update the contact information shown on your website.</p>

            <form action={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg border shadow-sm">

                <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2">Location & Map</h3>
                    <div className="space-y-2">
                        <Label htmlFor="address">Store Address</Label>
                        <Textarea
                            id="address"
                            name="address"
                            defaultValue={settings.address}
                            placeholder="Full address (supports enter/newline)"
                            rows={4}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mapUrl">Google Maps Embed URL (src="..." only)</Label>
                        <Input
                            id="mapUrl"
                            name="mapUrl"
                            defaultValue={settings.mapUrl}
                            placeholder="https://www.google.com/maps/embed?..."
                            onChange={(e) => {
                                const val = e.target.value;
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
                            ⚠️ Warning: This doesn't look like an Embed URL. Please copy the link from "Share &gt; Embed a map".
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Copy the "src" URL from the Google Maps "Embed a map" code.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2">Contact Numbers</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone1">Phone 1 (Main)</Label>
                            <Input id="phone1" name="phone1" defaultValue={settings.phone1} placeholder="02-xxx-xxxx" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone2">Phone 2 (Mobile)</Label>
                            <Input id="phone2" name="phone2" defaultValue={settings.phone2} placeholder="08x-xxx-xxxx" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2">Opening Hours</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="hoursWeekdays">Mon - Sat</Label>
                            <Input id="hoursWeekdays" name="hoursWeekdays" defaultValue={settings.hoursWeekdays} placeholder="08:30 - 18:00" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hoursWeekend">Sunday</Label>
                            <Input id="hoursWeekend" name="hoursWeekend" defaultValue={settings.hoursWeekend} placeholder="Closed" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2">Online Channels</h3>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" defaultValue={settings.email} placeholder="info@example.com" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="facebook">Facebook Link / Name</Label>
                            <Input id="facebook" name="facebook" defaultValue={settings.facebook} placeholder="https://facebook.com/..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="line">Line ID / Link</Label>
                            <Input id="line" name="line" defaultValue={settings.line} placeholder="@yourshop" />
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
                        Save Changes
                    </Button>
                </div>

            </form>
        </div>
    )
}
