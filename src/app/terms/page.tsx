import React from 'react'
import { getSettings } from '@/app/admin/settings/actions'

export default async function TermsPage() {
    const termsContent = await getSettings('terms_content')

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-heading font-black text-white mb-8 uppercase italic border-b-4 border-blue-500 inline-block pr-6">
                เงื่อนไขการให้บริการ (Terms of Service)
            </h1>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                {termsContent ? (
                    <div
                        className="prose prose-slate max-w-none text-gray-700 space-y-6 whitespace-pre-line prose-headings:text-charcoal-900 prose-a:text-blue-600"
                        dangerouslySetInnerHTML={{ __html: termsContent }}
                    />
                ) : (
                    <div className="prose prose-slate max-w-none text-gray-700 space-y-6 prose-headings:text-charcoal-900">
                        <p>
                            ยินดีต้อนรับสู่ TireSelect กรุณาอ่านเงื่อนไขการให้บริการเหล่านี้อย่างละเอียดก่อนใช้งานเว็บไซต์หรือสั่งซื้อสินค้าจากเรา
                            การเข้าใช้งานเว็บไซต์นี้ถือว่าคุณยอมรับข้อกำหนดและเงื่อนไขทั้งหมดที่ระบุไว้
                        </p>

                        <section>
                            <h2 className="text-xl font-semibold text-charcoal-900 mb-3">1. ข้อมูลทั่วไป</h2>
                            <p>
                                เว็บไซต์นี้ดำเนินการโดย TireSelect ตลอดทั้งไซต์ คำว่า &quot;เรา&quot;, &quot;พวกเรา&quot; และ &quot;ของเรา&quot; หมายถึง TireSelect
                                เราขอสงวนสิทธิ์ในการแก้ไขหรือเปลี่ยนแปลงเงื่อนไขเหล่านี้ได้ตลอดเวลาโดยไม่ต้องแจ้งให้ทราบล่วงหน้า
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-charcoal-900 mb-3">2. สินค้าและบริการ</h2>
                            <p>
                                เราพยายามแสดงรายละเอียด สี และภาพของสินค้าให้ถูกต้องที่สุดเท่าที่จะทำได้
                                อย่างไรก็ตาม เราไม่สามารถรับประกันได้ว่าการแสดงผลบนหน้าจอคอมพิวเตอร์ของคุณจะถูกต้องแม่นยำทุกประการ
                                เราขอสงวนสิทธิ์ในการจำกัดการขายสินค้าให้กับบุคคลใดๆ หรือภูมิภาคใดๆ ตามดุลยพินิจของเรา
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-charcoal-900 mb-3">3. ราคาและการชำระเงิน</h2>
                            <p>
                                ราคาสินค้าทั้งหมดแสดงในสกุลเงินบาท (THB) และอาจมีการเปลี่ยนแปลงโดยไม่ต้องแจ้งให้ทราบล่วงหน้า
                                เราขอสงวนสิทธิ์ในการยกเลิกคำสั่งซื้อหากพบว่ามีการแสดงราคาผิดพลาด หรือสินค้าหมดสต๊อก
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-charcoal-900 mb-3">4. การจัดส่งสินค้า</h2>
                            <p>
                                เราจะดำเนินการจัดส่งสินค้าตามที่อยู่ที่คุณระบุไว้ในคำสั่งซื้อ ระยะเวลาการจัดส่งเป็นเพียงการประมาณการ
                                และอาจเปลี่ยนแปลงได้ขึ้นอยู่กับพื้นที่จัดส่งและเหตุสุดวิสัย
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-charcoal-900 mb-3">5. การคืนสินค้าและการรับประกัน</h2>
                            <p>
                                สินค้าที่ซื้อไปแล้ว สามารถเปลี่ยนหรือคืนได้ภายใต้เงื่อนไขการรับประกันของเรา
                                โปรดตรวจสอบรายละเอียดในหน้า "การรับประกัน" หรือติดต่อฝ่ายบริการลูกค้าภายใน 7 วันหลังจากได้รับสินค้า หากพบปัญหา
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-charcoal-900 mb-3">6. กฎหมายที่ใช้บังคับ</h2>
                            <p>
                                เงื่อนไขการให้บริการเหล่านี้อยู่ภายใต้และตีความตามกฎหมายของประเทศไทย
                            </p>
                        </section>
                    </div>
                )}
            </div>
        </div>
    )
}
