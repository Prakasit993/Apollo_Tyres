import Link from "next/link"
import { MapPin, Phone, Mail, Clock, Facebook, MessageCircle } from "lucide-react"
import { getContactSettings } from "@/app/admin/contact/actions"

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
    const settings = await getContactSettings()

    return (
        <div className="bg-cream-50 min-h-screen pb-20">
            {/* Hero Section */}
            <div className="bg-charcoal-900 text-white py-16 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="font-heading text-4xl md:text-5xl font-black italic tracking-tighter text-gold-500 mb-4">
                        CONTACT US
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        We are here to help! Visit our shop or reach out for inquiries.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="grid md:grid-cols-2 gap-12">

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-gold-500">
                            <h2 className="text-2xl font-black text-charcoal-900 mb-6 uppercase flex items-center gap-3">
                                <MapPin className="text-gold-500" />
                                Visit Our Shop
                            </h2>
                            <address className="not-italic text-gray-600 mb-6 leading-relaxed whitespace-pre-wrap">
                                {settings.address || "123 Rama 9 Road, Suan Luang,\nBangkok 10250, Thailand"}
                            </address>
                            <a
                                href={settings.mapUrl ? `https://www.google.com/maps?q=${settings.address}` : "https://maps.app.goo.gl/u8xZxi6XjyWpgm54A"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-gold-600 font-bold hover:text-gold-700 hover:underline"
                            >
                                Get Directions <MapPin size={16} />
                            </a>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-lg text-charcoal-900 mb-3 flex items-center gap-2">
                                    <Phone className="text-chartreuse-500" size={20} /> Call Us
                                </h3>
                                <p className="text-gray-600 font-mono text-lg font-bold">{settings.phone1 || "02-123-4567"}</p>
                                <p className="text-gray-600 font-mono text-lg font-bold">{settings.phone2 || "089-999-999"}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-lg text-charcoal-900 mb-3 flex items-center gap-2">
                                    <Clock className="text-blue-500" size={20} /> Opening Hours
                                </h3>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <div className="flex justify-between">
                                        <span>Mon - Sat:</span>
                                        <span className="font-bold">{settings.hoursWeekdays || "08:30 - 18:00"}</span>
                                    </div>
                                    <div className="flex justify-between text-red-500">
                                        <span>Sunday:</span>
                                        <span className="font-bold">{settings.hoursWeekend || "Closed"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-charcoal-900 text-white p-8 rounded-2xl shadow-lg">
                            <h3 className="text-xl font-bold text-gold-500 mb-6">Connect With Us</h3>
                            <div className="flex gap-4">
                                {settings.facebook && (
                                    <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors">
                                        <Facebook size={24} />
                                    </a>
                                )}
                                {settings.line && (
                                    <a href={settings.line} target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-colors">
                                        <MessageCircle size={24} />
                                    </a>
                                )}
                                {settings.email && (
                                    <a href={`mailto:${settings.email}`} className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-colors">
                                        <Mail size={24} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Google Map */}
                    <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white h-[600px] relative bg-gray-200">
                        <iframe
                            src={settings.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15495.666270659424!2d100.6200000!3d13.7500000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ1JzAwLjAiTiAxMDDCsDM3JzEyLjAiRQ!5e0!3m2!1sen!2sth!4v1620000000000!5m2!1sen!2sth"}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0 w-full h-full"
                        ></iframe>
                    </div>

                </div>
            </div>
        </div>
    )
}
