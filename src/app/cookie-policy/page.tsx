'use client'

import Link from 'next/link'

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium mb-4 inline-block"
                    >
                        ← กลับหน้าหลัก
                    </Link>
                    <h1 className="text-4xl font-black text-neutral-900 dark:text-white mb-2">
                        นโยบายคุกกี้
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        ปรับปรุงล่าสุด: {new Date().toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8 space-y-8">
                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                            คุกกี้คืออะไร?
                        </h2>
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                            คุกกี้ (Cookies) คือไฟล์ข้อความขนาดเล็กที่เว็บไซต์บันทึกไว้ในอุปกรณ์ของคุณ (คอมพิวเตอร์
                            แท็บเล็ต หรือมือถือ) เมื่อคุณเข้าเยี่ยมชมเว็บไซต์ คุกกี้ช่วยให้เว็บไซต์จดจำข้อมูลเกี่ยวกับ
                            การเข้าชมของคุณ เช่น ภาษาที่ต้องการ รายการสินค้าในตะกร้า หรือการตั้งค่าต่างๆ
                        </p>
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            เราใช้คุกกี้เพื่อปรับปรุงประสบการณ์การใช้งานของคุณ และเพื่อทำความเข้าใจว่าผู้เข้าชม
                            ใช้เว็บไซต์ของเราอย่างไร
                        </p>
                    </section>

                    {/* Cookie Types */}
                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                            ประเภทของคุกกี้ที่เราใช้
                        </h2>

                        <div className="space-y-6">
                            {/* Necessary Cookies */}
                            <div className="border-l-4 border-blue-600 pl-4">
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                                    1. คุกกี้ที่จำเป็น (Strictly Necessary Cookies)
                                </h3>
                                <p className="text-neutral-700 dark:text-neutral-300 mb-3 leading-relaxed">
                                    คุกกี้เหล่านี้จำเป็นต่อการทำงานของเว็บไซต์ และไม่สามารถปิดการใช้งานได้
                                </p>
                                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
                                    <p className="text-sm font-medium text-neutral-900 dark:text-white mb-2">
                                        วัตถุประสงค์:
                                    </p>
                                    <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1 list-disc list-inside">
                                        <li>การเข้าสู่ระบบและการจัดการบัญชีผู้ใช้</li>
                                        <li>การจดจำสินค้าในตะกร้าสินค้า</li>
                                        <li>การรักษาความปลอดภัยและป้องกันการโจมตี</li>
                                        <li>การจดจำการยินยอมคุกกี้ของคุณ</li>
                                    </ul>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3">
                                        <strong>ตัวอย่าง:</strong> <code className="bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded">sb-*-auth-token</code> (Supabase Authentication)
                                    </p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                                        <strong>ระยะเวลา:</strong> 7 วัน (Session Cookies)
                                    </p>
                                </div>
                            </div>

                            {/* Analytics Cookies */}
                            <div className="border-l-4 border-green-600 pl-4">
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                                    2. คุกกี้เพื่อการวิเคราะห์ (Analytics Cookies)
                                </h3>
                                <p className="text-neutral-700 dark:text-neutral-300 mb-3 leading-relaxed">
                                    คุกกี้เหล่านี้ช่วยให้เราเข้าใจว่าผู้เข้าชมใช้งานเว็บไซต์อย่างไร เพื่อนำมาปรับปรุงบริการ
                                </p>
                                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
                                    <p className="text-sm font-medium text-neutral-900 dark:text-white mb-2">
                                        วัต��ุประสงค์:
                                    </p>
                                    <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1 list-disc list-inside">
                                        <li>นับจำนวนผู้เข้าชมและแหล่งที่มาของการเข้าชม</li>
                                        <li>วิเคราะห์หน้าที่ได้รับความนิยม</li>
                                        <li>เข้าใจพฤติกรรมการใช้งานของผู้ใช้</li>
                                        <li>ปรับปรุงประสิทธิภาพของเว็บไซต์</li>
                                    </ul>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3">
                                        <strong>ตัวอย่าง:</strong> Google Analytics (ถ้ามีการใช้งาน)
                                    </p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                                        <strong>ระยะเวลา:</strong> สูงสุด 2 ปี
                                    </p>
                                </div>
                            </div>

                            {/* Marketing Cookies */}
                            <div className="border-l-4 border-purple-600 pl-4">
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                                    3. คุกกี้เพื่อการตลาด (Marketing Cookies)
                                </h3>
                                <p className="text-neutral-700 dark:text-neutral-300 mb-3 leading-relaxed">
                                    คุกกี้เหล่านี้ใช้เพื่อแสดงโฆษณาที่เกี่ยวข้องกับคุณบนเว็บไซต์อื่นๆ
                                </p>
                                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
                                    <p className="text-sm font-medium text-neutral-900 dark:text-white mb-2">
                                        วัตถุประสงค์:
                                    </p>
                                    <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1 list-disc list-inside">
                                        <li>แสดงโฆษณาที่เกี่ยวข้องกับความสนใจของคุณ</li>
                                        <li>จำกัดจำนวนครั้งที่คุณเห็นโฆษณาเดียวกัน</li>
                                        <li>วัดประสิทธิภาพของแคมเปญโฆษณา</li>
                                    </ul>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3">
                                        <strong>ตัวอย่าง:</strong> Facebook Pixel, Google Ads (ถ้ามีการใช้งาน)
                                    </p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                                        <strong>ระยะเวลา:</strong> สูงสุด 1 ปี
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* User Rights */}
                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                            สิทธิของคุณ
                        </h2>
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                            ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) คุณมีสิทธิ์ในการ:
                        </p>
                        <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-2">✓</span>
                                <span>ยอมรับหรือปฏิเสธการใช้คุกกี้ที่ไม่จำเป็น</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-2">✓</span>
                                <span>เปลี่ยนแปลงการตั้งค่าคุกกี้ของคุณได้ตลอดเวลา</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-2">✓</span>
                                <span>ลบคุกกี้ที่มีอยู่ในเบราว์เซอร์ของคุณ</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-2">✓</span>
                                <span>ขอให้เราลบข้อมูลส่วนบุคคลของคุณ</span>
                            </li>
                        </ul>
                    </section>

                    {/* How to Control */}
                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                            วิธีจัดการคุกกี้
                        </h2>

                        <div className="space-y-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <h3 className="font-bold text-neutral-900 dark:text-white mb-2">
                                    1. ผ่านเว็บไซต์ของเรา
                                </h3>
                                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                    คุณสามารถคลิกที่ปุ่ม "ตั้งค่าคุกกี้" ด้านล่างนี้เพื่อเปลี่ยนแปลงการตั้งค่าคุกกี้ของคุณได้ตลอดเวลา
                                </p>
                            </div>

                            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                                <h3 className="font-bold text-neutral-900 dark:text-white mb-2">
                                    2. ผ่านเบราว์เซอร์
                                </h3>
                                <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">
                                    เบราว์เซอร์ส่วนใหญ่อนุญาตให้คุณควบคุมคุกกี้ผ่านการตั้งค่า คลิกลิงก์ด้านล่างเพื่อเรียนรู้วิธีการ:
                                </p>
                                <ul className="text-sm space-y-1 text-blue-600 dark:text-blue-400">
                                    <li>
                                        <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            → Google Chrome
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            → Mozilla Firefox
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            → Safari
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            → Microsoft Edge
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                            ติดต่อเรา
                        </h2>
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                            หากคุณมีคำถามเกี่ยวกับนโยบายคุกกี้นี้ หรือต้องการใช้สิทธิ์ของคุณ กรุณาติดต่อเราที่:
                        </p>
                        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4 space-y-2 text-sm">
                            <p className="text-neutral-700 dark:text-neutral-300">
                                <strong className="text-neutral-900 dark:text-white">อีเมล:</strong> privacy@tireselect.com
                            </p>
                            <p className="text-neutral-700 dark:text-neutral-300">
                                <strong className="text-neutral-900 dark:text-white">โทรศัพท์:</strong> (ดูข้อมูลจากหน้าติดต่อเรา)
                            </p>
                            <p className="text-neutral-700 dark:text-neutral-300">
                                <strong className="text-neutral-900 dark:text-white">ที่อยู่:</strong> (ดูข้อมูลจากหน้าติดต่อเรา)
                            </p>
                        </div>
                    </section>

                    {/* Footer Links */}
                    <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                            เอกสารที่เกี่ยวข้อง:
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/privacy"
                                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                            >
                                นโยบายความเป็นส่วนตัว
                            </Link>
                            <Link
                                href="/terms"
                                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                            >
                                เงื่อนไขการใช้งาน
                            </Link>
                            <Link
                                href="/contact"
                                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                            >
                                ติดต่อเรา
                            </Link>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => {
                            localStorage.removeItem('cookie-consent')
                            window.location.reload()
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block"
                    >
                        🍪 เปลี่ยนการตั้งค่าคุกกี้
                    </button>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3">
                        คลิกที่นี่เพื่อเปิดหน้าต่างตั้งค่าคุกกี้อีกครั้ง
                    </p>
                </div>
            </div>
        </div>
    )
}
