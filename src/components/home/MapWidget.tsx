"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function MapWidget() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <div
                className={cn(
                    "hidden lg:block fixed right-8 z-40 bg-white rounded-t-lg shadow-xl overflow-hidden border border-gold-500/30 transition-all duration-300 ease-in-out",
                    isOpen ? "bottom-8 w-80 rounded-b-lg" : "bottom-0 w-64 translate-y-0"
                )}
            >
                {/* Header - Always Visible */}
                <div
                    className="p-3 bg-charcoal-900 text-white flex items-center justify-between cursor-pointer hover:bg-charcoal-800 transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex items-center gap-2">
                        <MapPin className="text-gold-500 w-4 h-4" />
                        <h3 className="font-bold text-sm">Our Warehouse</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isOpen && <span className="text-[10px] text-gold-500 font-bold">CLICK TO VIEW</span>}
                        {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
                    </div>
                </div>

                {/* Content - Collapsible */}
                <div className={cn(
                    "transition-all duration-300 ease-in-out overflow-hidden bg-white",
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}>
                    <div className="h-40 bg-gray-200 relative">
                        {/* Mock Map */}
                        <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                            <span className="text-muted-foreground text-sm">Google Maps Placeholder</span>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <MapPin className="w-8 h-8 text-red-500 drop-shadow-md" fill="currentColor" />
                        </div>
                    </div>

                    <div className="p-4 space-y-3">
                        <p className="text-xs text-muted-foreground">
                            Ramindra, Suan Siam Zone,<br />
                            Bangkok (Near Siam Amazing Park)
                        </p>
                        <Button
                            className="w-full bg-gold-500 text-black hover:bg-gold-600 font-bold h-8 text-xs gap-2"
                            onClick={() => window.open("https://maps.app.goo.gl/u8xZxi6XjyWpgm54A", "_blank")}
                        >
                            <Navigation className="w-3 h-3" />
                            OPEN IN GOOGLE MAPS
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Version - Static block (unchanged) */}
            <div className="lg:hidden w-full bg-white rounded-lg shadow-sm border border-border p-4 my-6">
                <div className="flex items-center gap-2 mb-3">
                    <MapPin className="text-gold-500 w-5 h-5" />
                    <span className="font-bold text-charcoal-900">Visit Our Warehouse</span>
                </div>
                <div className="h-32 bg-gray-200 rounded-md mb-3 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">Map View</div>
                </div>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open("https://maps.app.goo.gl/u8xZxi6XjyWpgm54A", "_blank")}
                >
                    Open in Google Maps
                </Button>
            </div>
        </>
    )
}
