import Link from "next/link"
import { ShoppingCart, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase-server"
import { signout } from "@/app/login/actions"
import { CartButton } from "./CartButton"

export async function Header() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-black/90 backdrop-blur supports-[backdrop-filter]:bg-black/60 text-white">
            <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-bold text-xl tracking-tighter text-white">
                            TIRE<span className="text-blue-500">SELECT</span>
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/" className="transition-colors hover:text-blue-400 text-gray-300 hover:text-white">
                        หน้าแรก
                    </Link>
                    <Link href="/products" className="transition-colors hover:text-blue-400 text-gray-300 hover:text-white">
                        เลือกยาง
                    </Link>
                    <Link href="/warranty" className="transition-colors hover:text-blue-400 text-gray-300 hover:text-white">
                        การรับประกัน
                    </Link>
                    <Link href="/contact" className="transition-colors hover:text-blue-400 text-gray-300 hover:text-white">
                        ติดต่อเรา
                    </Link>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-2">
                            <Link href="/account">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <User className="h-4 w-4" />
                                    <span className="hidden sm:inline">บัญชีผู้ใช้</span>
                                </Button>
                            </Link>
                            <form action={signout}>
                                <Button variant="ghost" size="sm" type="submit" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                    ออกจากระบบ
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="font-bold">
                                เข้าสู่ระบบ
                            </Button>
                        </Link>
                    )}

                    {user && <CartButton />}

                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="md:hidden h-10 w-10 rounded-full text-white hover:bg-white/10 focus-visible:ring-0"
                    >
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Menu</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}
