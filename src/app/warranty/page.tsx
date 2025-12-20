import Link from "next/link"
import { ShieldCheck, CheckCircle, AlertCircle } from "lucide-react"

export default function WarrantyPage() {
    return (
        <div className="bg-cream-50 min-h-screen pb-20">
            {/* Hero Section */}
            <div className="bg-charcoal-900 text-white py-20 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="font-heading text-4xl md:text-6xl font-black italic tracking-tighter text-gold-500 mb-4">
                        WARRANTY INFORMATION
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Your peace of mind is our priority. We partner with top brands to ensure you get the best coverage on usage and road hazards.
                    </p>
                </div>
                {/* Decorative background elements can go here */}
            </div>

            <div className="container mx-auto px-4 py-12 max-w-5xl">

                {/* Apollo Highlight */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gold-200 mb-12 transform hover:-translate-y-1 transition-transform duration-300">
                    <div className="bg-gradient-to-r from-[#C9A24A] to-[#B08D3F] p-1">
                        <div className="bg-white p-8 md:p-12">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="md:w-1/3 flex justify-center">
                                    <div className="w-48 h-48 bg-cream-50 rounded-full flex items-center justify-center border-4 border-gold-500 shadow-inner">
                                        <div className="text-center">
                                            <ShieldCheck size={64} className="text-gold-500 mx-auto mb-2" />
                                            <span className="block text-3xl font-black text-charcoal-900">2 YEAR</span>
                                            <span className="block text-sm font-bold text-gray-500">WARRANTY</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:w-2/3 text-center md:text-left">
                                    <div className="inline-block bg-gold-100 text-gold-800 text-xs font-bold px-3 py-1 rounded-full mb-4">
                                        PREMIUM PARTNER
                                    </div>
                                    <h2 className="text-3xl font-black text-charcoal-900 mb-4 uppercase">Apollo Tires Unconditional Warranty</h2>
                                    <p className="text-gray-600 mb-6 text-lg">
                                        Exclusive 2-Year protection against all road hazards—nails, potholes, cuts, and impact damage.
                                        <br /><span className="text-sm font-bold text-red-500">*Compensation based on remaining tread depth (Pro-rata basis).</span>
                                    </p>
                                    <ul className="space-y-3 mb-8">
                                        <li className="flex items-center gap-3">
                                            <CheckCircle className="text-green-500 shrink-0" size={20} />
                                            <span className="font-medium">Covers accidental damage (cuts, bursts, bulges)</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle className="text-green-500 shrink-0" size={20} />
                                            <span className="font-medium">Valid for 2 Years from date of purchase</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle className="text-green-500 shrink-0" size={20} />
                                            <span className="font-medium">Free replacement for manufacturing defects (5 Years)</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <AlertCircle className="text-orange-500 shrink-0" size={20} />
                                            <span className="font-medium text-orange-700">Must register online within 30 days</span>
                                        </li>
                                    </ul>
                                    <div className="flex gap-4">
                                        <Link href="https://www.apollotyres.com/th-th/warranty/" target="_blank" rel="noopener noreferrer">
                                            <button className="bg-gold-500 text-black px-8 py-3 font-bold rounded hover:bg-gold-600 transition-colors shadow-lg">
                                                REGISTER WARRANTY
                                            </button>
                                        </Link>
                                        <Link href="/products?brand=Apollo">
                                            <button className="bg-charcoal-900 text-white px-8 py-3 font-bold rounded hover:bg-black transition-colors border border-charcoal-900">
                                                SHOP APOLLO
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Other Brands Grid */}
                <h3 className="text-2xl font-bold text-charcoal-900 mb-6 border-l-4 border-gold-500 pl-4 uppercase italic">
                    Other Brand Warranties
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Bridgestone */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                            <h4 className="font-bold text-xl text-charcoal-900">Bridgestone</h4>
                            <ShieldCheck className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Standard Manufacturer Warranty</p>
                        <div className="space-y-2 text-sm text-gray-700">
                            <p>• 5 Years coverage against manufacturing defects.</p>
                            <p>• Does not cover road hazard damage (nails/cuts).</p>
                        </div>
                    </div>

                    {/* Michelin */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                            <h4 className="font-bold text-xl text-charcoal-900">Michelin</h4>
                            <ShieldCheck className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Standard Manufacturer Warranty</p>
                        <div className="space-y-2 text-sm text-gray-700">
                            <p>• 6 Years coverage against manufacturing defects.</p>
                            <p>• Requires official inspection for claims.</p>
                        </div>
                    </div>

                    {/* Maxxis */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                            <h4 className="font-bold text-xl text-charcoal-900">Maxxis</h4>
                            <ShieldCheck className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Standard Manufacturer Warranty</p>
                        <div className="space-y-2 text-sm text-gray-700">
                            <p>• 5 Years coverage against manufacturing defects.</p>
                            <p>• Durable and reliable for standard use.</p>
                        </div>
                    </div>

                    {/* Otani/Deestone/Others */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                            <h4 className="font-bold text-xl text-charcoal-900">Other Brands (Otani, Deestone)</h4>
                            <ShieldCheck className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Standard Manufacturer Warranty</p>
                        <div className="space-y-2 text-sm text-gray-700">
                            <p>• Typically 3-5 Years manufacturing warranty.</p>
                            <p>• Defect coverage only.</p>
                        </div>
                    </div>
                </div>

                {/* Claim Process */}
                <div className="mt-12 bg-blue-50 border border-blue-100 rounded-xl p-8">
                    <h3 className="flex items-center gap-3 text-xl font-bold text-blue-900 mb-4">
                        <AlertCircle />
                        How to Claim Warranty?
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8 text-blue-800">
                        <div>
                            <span className="block text-4xl font-black text-blue-200 mb-2">01</span>
                            <h4 className="font-bold mb-2">Keep Your Receipt</h4>
                            <p className="text-sm">Always retain your original purchase invoice and warranty card (if provided).</p>
                        </div>
                        <div>
                            <span className="block text-4xl font-black text-blue-200 mb-2">02</span>
                            <h4 className="font-bold mb-2">Contact Us</h4>
                            <p className="text-sm">Bring the tire to our shop for inspection. We will assess the damage initially.</p>
                        </div>
                        <div>
                            <span className="block text-4xl font-black text-blue-200 mb-2">03</span>
                            <h4 className="font-bold mb-2">Official Inspection</h4>
                            <p className="text-sm">For defect claims, tires are sent to the manufacturer for technical analysis (1-2 weeks).</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
