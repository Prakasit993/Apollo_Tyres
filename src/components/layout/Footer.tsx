import Link from "next/link"
import { Facebook, Instagram } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-charcoal-900 text-white py-12 border-t border-gold-600/20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <Link href="/" className="inline-block">
                            <span className="font-heading text-2xl font-black text-white tracking-tighter">
                                TIRE <span className="text-gold-500">SELECT</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm mt-2">
                            Premium tires for every journey.
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-6">
                        <a
                            href="https://www.facebook.com/apollotire/?ref=embed_page#"
                            target="_blank"
                            rel="noreferrer"
                            className="bg-charcoal-800 p-3 rounded-full hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1 group"
                            aria-label="Facebook"
                        >
                            <Facebook className="w-5 h-5" />
                        </a>

                        <a
                            href="https://instagram.com/tireselect"
                            target="_blank"
                            rel="noreferrer"
                            className="bg-charcoal-800 p-3 rounded-full hover:bg-pink-600 hover:text-white transition-all transform hover:-translate-y-1 group"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>

                        <a
                            href="https://line.me/R/ti/p/%40apollo01"
                            target="_blank"
                            rel="noreferrer"
                            className="bg-charcoal-800 p-3 rounded-full hover:bg-[#06C755] hover:text-white transition-all transform hover:-translate-y-1 group"
                            aria-label="Line"
                        >
                            {/* Custom Line Icon SVG */}
                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5"
                                height="24"
                                width="24"
                            >
                                <path d="M22.288 10.31c0-4.665-4.57-8.455-10.29-8.455C6.29 1.855 1.72 5.645 1.72 10.31c0 4.19 3.71 7.695 8.79 8.35 1.48.33 1.05 1.76.71 2.53-.17.38-.64 1.43-.64 1.43s-.14.86.53.53c.67-.34 5.3-3.15 7.23-5.38 2.58-2.6 4-4.875 3.955-7.43zm-16.7 1.34h-1.3c-.27 0-.5-.22-.5-.5v-3.7c0-.28.23-.5.5-.5.28 0 .5.22.5.5v3.2h.8c.27 0 .5.22.5.5 0 .28-.23.5-.5.5zm3.02 0H7.3c-.27 0-.5-.22-.5-.5v-3.7c0-.28.23-.5.5-.5.28 0 .5.22.5.5v3.7c.04.28-.2.5-.48.5zm4.84-2.28h-1.4v1.28h1.4c.27 0 .5.22.5.5 0 .28-.23.5-.5.5h-1.9c-.28 0-.5-.22-.5-.5v-3.7c0-.28.23-.5.5-.5H13.44c.28 0 .5.22.5.5 0 .28-.23.5-.5.5h-1.4v1.17h1.4c.27 0 .5.22.5.5.04.28-.2.5-.48.5zm3.76-.94v3.22c0 .28-.22.5-.5.5-.27 0-.5-.22-.5-.5V8.9l-1.62 2.22c-.1.14-.24.2-.4.2-.13 0-.25-.05-.34-.14-.08-.1-.13-.22-.13-.35v-3.7c0-.28.22-.5.5-.5.27 0 .5.22.5.5v2.7l1.63-2.2c.1-.15.26-.22.42-.22.3 0 .58.23.57.54z" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>© 2025 Tire Select. All rights reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-gold-500 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-gold-500 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
