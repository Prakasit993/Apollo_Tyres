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
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-bold text-xl tracking-tighter text-charcoal-900">
                            TIRE<span className="text-gold-500">SELECT</span>
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/" className="transition-colors hover:text-gold-500 text-foreground/80 hover:text-foreground">
                        HOME
                    </Link>
                    <Link href="/products" className="transition-colors hover:text-gold-500 text-foreground/80 hover:text-foreground">
                        SHOP TIRES
                    </Link>
                    <Link href="/warranty" className="transition-colors hover:text-gold-500 text-foreground/80 hover:text-foreground">
                        WARRANTY
                    </Link>
                    <Link href="/contact" className="transition-colors hover:text-gold-500 text-foreground/80 hover:text-foreground">
                        CONTACT
                    </Link>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-2">
                            <Link href="/account">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <User className="h-4 w-4" />
                                    <span className="hidden sm:inline">Account</span>
                                </Button>
                            </Link>
                            <form action={signout}>
                                <Button variant="ghost" size="sm" type="submit" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                    Sign Out
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="font-bold">
                                LOGIN
                            </Button>
                        </Link>
                    )}

                    {user && <CartButton />}

                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Menu</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}
