import React from 'react'
import { getSettings } from '@/app/admin/settings/actions'

export default async function PrivacyPolicyPage() {
    const privacyContent = await getSettings('privacy_content')

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-heading font-black text-white mb-8 uppercase italic border-b-4 border-blue-500 inline-block pr-6">
                นโยบายความเป็นส่วนตัว (Privacy Policy)
            </h1>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                {privacyContent ? (
                    <div
                        className="prose prose-slate max-w-none text-gray-700 space-y-6 whitespace-pre-line prose-headings:text-charcoal-900 prose-a:text-blue-600"
                        dangerouslySetInnerHTML={{ __html: privacyContent }}
                    />
                ) : (
                    <div className="prose prose-slate max-w-none text-gray-700 space-y-6 prose-headings:text-charcoal-900">
                        <p>
                            ยินดีต้อนรับสู่ TireSelect (&quot;เรา&quot;, &quot;พวกเรา&quot; หรือ &quot;ของเรา&quot;) เราให้ความสำคัญกับความเป็นส่วนตัวของคุณและมุ่งมั่นที่จะปกป้องข้อมูลส่วนบุคคลของคุณ
                            นโยบายความเป็นส่วนตัวนี้จะอธิบายถึงวิธีการที่เราเก็บรวบรวม ใช้ เปิดเผย และรักษาข้อมูลของคุณเมื่อคุณเข้าชมเว็บไซต์ของเรา
                        </p>

                        <section>
                            <h2 className="text-xl font-semibold text-charcoal-900 mb-3">1. ข้อมูลที่เราเก็บรวบรวม</h2>
                            <p>เราอาจเก็บรวบรวมข้อมูลประเภทต่างๆ ดังต่อไปนี้:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>ข้อมูลส่วนบุคคล:</strong> เช่น ชื่อ, ที่อยู่, เบอร์โทรศัพท์, อีเมล เมื่อคุณทำการสั่งซื้อหรือสมัครสมาชิก</li>
                                <li><strong>ข้อมูลการชำระเงิน:</strong> รายละเอียดที่จำเป็นสำหรับการประมวลผลการชำระเงิน (เราไม่เก็บข้อมูลบัตรเครดิตโดยตรง แต่ใช้ผู้ให้บริการชำระเงินที่ปลอดภัย)</li>
                                <li><strong>ข้อมูลการใช้งาน:</strong> เช่น IP Address, ประเภทของเบราว์เซอร์, และหน้าเว็บที่คุณเข้าชมเพื่อการวิเคราะห์และปรับปรุงระบบ</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-charcoal-900 mb-3">2. การใช้ข้อมูลของคุณ</h2>
                            <p>เราใช้ข้อมูลที่เก็บรวบรวมเพื่อ:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>ประมวลผลและจัดการคำสั่งซื้อของคุณ</li>
                                <li>ติดต่อและแจ้งสถานะการจัดส่งสินค้า</li>
                                <li>ปรับปรุงประสบการณ์การใช้งานเว็บไซต์และการบริการลูกค้า</li>
                                <li>ส่งข่าวสารและโปรโมชั่น (หากคุณยินยอมรับข้อมูลข่าวสาร)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-charcoal-900 mb-3">3. การเปิดเผยข้อมูล</h2>
                            <p>
                                เราจะไม่ขาย หรือให้เช่าข้อมูลส่วนบุคคลของคุณแก่บุคคลที่สาม
                                เว้นแต่จะเป็นการแบ่งปันข้อมูลให้กับผู้ให้บริการที่เกี่ยวข้องกับการดำเนินงานของเรา (เช่น บริษัทขนส่ง)
                                หรือตามที่กฎหมายกำหนด
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-charcoal-900 mb-3">4. ความปลอดภัยของข้อมูล</h2>
                            <p>
                                เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อปกป้องข้อมูลส่วนบุคคลของคุณจากการเข้าถึงโดยไม่ได้รับอนุญาต
                                การเปิดเผย หรือการทำลาย อย่างไรก็ตาม โปรดทราบว่าไม่มีวิธีการส่งข้อมูลผ่านอินเทอร์เน็ตใดที่ปลอดภัย 100%
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-charcoal-900 mb-3">5. การติดต่อเรา</h2>
                            <p>
                                หากคุณมีคำถามหรือข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ โปรดติดต่อเราผ่านช่องทางที่ระบุไว้ในหน้า "ติดต่อเรา"
                            </p>
                        </section>
                    </div>
                )}
            </div>
        </div>
    )
}
