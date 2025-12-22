import Link from "next/link"
import { ShieldCheck, CheckCircle, AlertCircle } from "lucide-react"


export default function WarrantyPage() {
    return (
        <div className="bg-cream-50 min-h-screen pb-20">
            {/* Hero Section */}
            <div className="bg-charcoal-900 text-white py-20 relative overflow-hidden text-center">
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="font-heading text-4xl md:text-6xl font-black italic tracking-tighter text-blue-500 mb-4">
                        ข้อมูลการรับประกัน
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        ความอุ่นใจของคุณคือสิ่งสำคัญของเรา เราเป็นตัวแทนจำหน่ายอย่างเป็นทางการที่มอบสิทธิประโยชน์และการรับประกันที่ดีที่สุดให้แก่คุณ
                    </p>
                </div>
                {/* Decorative background elements can go here */}
            </div>

            <div className="container mx-auto px-4 py-12 max-w-5xl">

                {/* Apollo Highlight */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-200 mb-12 transform hover:-translate-y-1 transition-transform duration-300">
                    <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-1">
                        <div className="bg-white p-8 md:p-12">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="md:w-1/3 flex justify-center">
                                    <div className="w-48 h-48 bg-blue-50 rounded-full flex items-center justify-center border-4 border-blue-500 shadow-inner">
                                        <div className="text-center">
                                            <ShieldCheck size={64} className="text-blue-500 mx-auto mb-2" />
                                            <span className="block text-3xl font-black text-charcoal-900">2 ปี</span>
                                            <span className="block text-sm font-bold text-gray-500">การรับประกัน</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:w-2/3 text-center md:text-left">
                                    <div className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-4">
                                        พาร์ทเนอร์ระดับพรีเมียม
                                    </div>
                                    <h2 className="text-3xl font-black text-charcoal-900 mb-4 uppercase">การรับประกันแบบไม่มีเงื่อนไขจาก Apollo</h2>
                                    <p className="text-gray-700 mb-6 text-lg">
                                        คุ้มครองความเสียหาย 2 ปีแรก จากอุบัติเหตุทางถนนทุกกรณี — ตะปูตำ, ตกหลุม, เบียดฟุตบาท, บาดบวมแตก
                                        <br /><span className="text-sm font-bold text-red-500">*ชดเชยตามความลึกดอกยางที่เหลืออยู่ (Pro-rata basis)</span>
                                    </p>
                                    <ul className="space-y-3 mb-8">
                                        <li className="flex items-center gap-3">
                                            <CheckCircle className="text-green-500 shrink-0" size={20} />
                                            <span className="font-medium text-gray-800">ครอบคลุมความเสียหายจากอุบัติเหตุ (บาด, บวม, แตก)</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle className="text-green-500 shrink-0" size={20} />
                                            <span className="font-medium text-gray-800">สิทธิพิเศษนาน 2 ปี นับจากวันที่ซื้อ</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle className="text-green-500 shrink-0" size={20} />
                                            <span className="font-medium text-gray-800">เปลี่ยนเส้นใหม่ฟรี กรณีความเสียหายเกิดจากการผลิต (5 ปี)</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <AlertCircle className="text-orange-500 shrink-0" size={20} />
                                            <span className="font-medium text-orange-700">ต้องลงทะเบียนออนไลน์ภายใน 30 วัน</span>
                                        </li>
                                    </ul>
                                    <div className="flex gap-4 flex-wrap justify-center md:justify-start">
                                        <Link href="https://www.apollotyres.com/th-th/warranty/" target="_blank" rel="noopener noreferrer">
                                            <button className="bg-blue-600 text-white px-8 py-3 font-bold rounded hover:bg-blue-700 transition-colors shadow-lg">
                                                ลงทะเบียนรับประกัน
                                            </button>
                                        </Link>
                                        <Link href="/products?brand=Apollo">
                                            <button className="bg-white text-charcoal-900 px-8 py-3 font-bold rounded hover:bg-gray-100 transition-colors border border-charcoal-300">
                                                เลือกซื้อยาง Apollo
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Other Brands Grid */}
                <h3 className="text-2xl font-bold text-charcoal-900 mb-6 border-l-4 border-blue-500 pl-4 uppercase italic">
                    การรับประกันแบรนด์อื่นๆ
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Bridgestone */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
                        <div className="flex items-start justify-between mb-4">
                            <h4 className="font-bold text-xl text-charcoal-900">Bridgestone</h4>
                            <ShieldCheck className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 mb-4">การรับประกันมาตรฐานจากผู้ผลิต</p>
                        <div className="space-y-2 text-sm text-gray-700">
                            <p>• รับประกัน 5 ปี กรณีความเสียหายจากการผลิต</p>
                            <p>• ไม่คุ้มครองความเสียหายจากอุบัติเหตุ (เช่น ตะปูตำ, บาด, บวม)</p>
                        </div>
                    </div>

                    {/* Michelin */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
                        <div className="flex items-start justify-between mb-4">
                            <h4 className="font-bold text-xl text-charcoal-900">Michelin</h4>
                            <ShieldCheck className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 mb-4">การรับประกันมาตรฐานจากผู้ผลิต</p>
                        <div className="space-y-2 text-sm text-gray-700">
                            <p>• รับประกัน 6 ปี กรณีความเสียหายจากการผลิต</p>
                            <p>• ต้องผ่านการตรวจสอบจากผู้ผลิตเพื่อเคลมสินค้า</p>
                        </div>
                    </div>

                    {/* Maxxis */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
                        <div className="flex items-start justify-between mb-4">
                            <h4 className="font-bold text-xl text-charcoal-900">Maxxis</h4>
                            <ShieldCheck className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 mb-4">การรับประกันมาตรฐานจากผู้ผลิต</p>
                        <div className="space-y-2 text-sm text-gray-700">
                            <p>• รับประกัน 5 ปี กรณีความเสียหายจากการผลิต</p>
                            <p>• ทนทานและคุ้มค่าสำหรับการใช้งานทั่วไป</p>
                        </div>
                    </div>

                    {/* Otani/Deestone/Others */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
                        <div className="flex items-start justify-between mb-4">
                            <h4 className="font-bold text-xl text-charcoal-900">แบรนด์อื่นๆ (Otani, Deestone)</h4>
                            <ShieldCheck className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 mb-4">การรับประกันมาตรฐานจากผู้ผลิต</p>
                        <div className="space-y-2 text-sm text-gray-700">
                            <p>• โดยทั่วไปรับประกัน 3-5 ปี (เฉพาะจากการผลิต)</p>
                            <p>• ครอบคลุมเฉพาะข้อบกพร่องจากโรงงานเท่านั้น</p>
                        </div>
                    </div>
                </div>

                {/* Claim Process */}
                <div className="mt-12 bg-blue-50 border border-blue-100 rounded-xl p-8">
                    <h3 className="flex items-center gap-3 text-xl font-bold text-blue-900 mb-4">
                        <AlertCircle />
                        ขั้นตอนการเคลมประกัน
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8 text-blue-800">
                        <div>
                            <span className="block text-4xl font-black text-blue-200 mb-2">01</span>
                            <h4 className="font-bold mb-2">เก็บใบเสร็จไว้เสมอ</h4>
                            <p className="text-sm">โปรดเก็บใบเสร็จรับเงินฉบับจริงและใบรับประกัน (ถ้ามี) ไว้เพื่อใช้เป็นหลักฐาน</p>
                        </div>
                        <div>
                            <span className="block text-4xl font-black text-blue-200 mb-2">02</span>
                            <h4 className="font-bold mb-2">ติดต่อเราเพื่อตรวจสอบ</h4>
                            <p className="text-sm">นำยางที่มีปัญหาเข้ามาให้เราตรวจสอบเบื้องต้น เราจะช่วยประเมินสาเหตุความเสียหาย</p>
                        </div>
                        <div>
                            <span className="block text-4xl font-black text-blue-200 mb-2">03</span>
                            <h4 className="font-bold mb-2">ส่งตรวจสอบกับผู้ผลิต</h4>
                            <p className="text-sm">กรณีเคลมคุณภาพการผลิต ยางจะถูกส่งไปยังโรงงานผู้ผลิตเพื่อตรวจสอบทางเทคนิค (ใช้เวลา 1-2 สัปดาห์)</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
