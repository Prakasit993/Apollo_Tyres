"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { AdminNavLinks } from "./AdminNavLinks"

export function AdminMobileMenu() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-white hover:bg-white/10"
                    aria-label="Open admin menu"
                >
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-neutral-800 bg-charcoal-900 text-white p-0">
                <SheetHeader className="p-6 border-b border-gray-800">
                    <SheetTitle className="text-xl font-heading font-bold text-gold-500 text-left">
                        ระบบจัดการร้าน
                    </SheetTitle>
                </SheetHeader>
                <AdminNavLinks />
            </SheetContent>
        </Sheet>
    )
}
