"use client"

import Link from "next/link"
import { Menu, Package, Home, ShieldCheck, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet"

export function MobileMenu() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-10 w-10 rounded-full text-white hover:bg-white/10 focus-visible:ring-0"
                    aria-label="Open menu"
                >
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-neutral-800 bg-neutral-900 text-white p-0">
                <SheetHeader className="p-6 border-b border-neutral-800">
                    <SheetTitle className="text-white text-left font-bold text-xl">
                        TIRE<span className="text-blue-500">SELECT</span>
                    </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col py-4">
                    <SheetClose asChild>
                        <Link
                            href="/"
                            className="flex items-center gap-4 px-6 py-4 text-sm font-medium hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                        >
                            <Home className="h-5 w-5" />
                            หน้าแรก
                        </Link>
                    </SheetClose>
                    <SheetClose asChild>
                        <Link
                            href="/products"
                            className="flex items-center gap-4 px-6 py-4 text-sm font-medium hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                        >
                            <Package className="h-5 w-5" />
                            เลือกยาง
                        </Link>
                    </SheetClose>
                    <SheetClose asChild>
                        <Link
                            href="/warranty"
                            className="flex items-center gap-4 px-6 py-4 text-sm font-medium hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                        >
                            <ShieldCheck className="h-5 w-5" />
                            การรับประกัน
                        </Link>
                    </SheetClose>
                    <SheetClose asChild>
                        <Link
                            href="/contact"
                            className="flex items-center gap-4 px-6 py-4 text-sm font-medium hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                        >
                            <Phone className="h-5 w-5" />
                            ติดต่อเรา
                        </Link>
                    </SheetClose>
                </div>
            </SheetContent>
        </Sheet>
    )
}
