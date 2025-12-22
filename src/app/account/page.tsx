import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, User as UserIcon, Shield } from "lucide-react"

export default async function AccountPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect("/login")
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="container max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-heading font-black text-white mb-2 uppercase italic border-b-4 border-blue-500 inline-block">
                บัญชีของฉัน
            </h1>
            <p className="text-gray-400 mb-8">ยินดีต้อนรับกลับ, {profile?.full_name || user.email}</p>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Profile Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <UserIcon className="w-6 h-6 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">ข้อมูลส่วนตัว</h2>
                        </div>
                        <Link href="/account/edit">
                            <Button variant="outline" size="sm" className="text-xs text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-gray-300">แก้ไขข้อมูล</Button>
                        </Link>
                    </div>
                    <div className="space-y-3 text-sm text-gray-600">
                        <p className="grid grid-cols-[80px_1fr]"><span className="font-semibold text-gray-900">อีเมล:</span> {user.email}</p>
                        <p className="grid grid-cols-[80px_1fr]"><span className="font-semibold text-gray-900">ชื่อ:</span> {profile?.full_name || '-'}</p>
                        <p className="grid grid-cols-[80px_1fr]"><span className="font-semibold text-gray-900">เบอร์โทร:</span> {profile?.phone || '-'}</p>
                        <div className="grid grid-cols-[80px_1fr]">
                            <span className="font-semibold text-gray-900">ที่อยู่:</span>
                            <span>
                                {profile?.address || '-'}
                                {profile?.district && <br />}
                                {profile?.district && `${profile.district} ${profile.amphoe}`}
                                {profile?.province && <br />}
                                {profile?.province && `${profile.province} ${profile.zipcode}`}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-start">
                    <div className="flex items-center gap-3 mb-4">
                        <Package className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900">คำสั่งซื้อของฉัน</h2>
                    </div>
                    <p className="text-gray-500 text-sm mb-6 flex-1">
                        ดูประวัติการสั่งซื้อและติดตามสถานะการจัดส่งสินค้า
                    </p>
                    <Link href="/account/orders" className="w-full">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" variant="default">ดูรายการคำสั่งซื้อ</Button>
                    </Link>
                </div>

                {/* Admin Card (Only if Admin) */}
                {profile?.role === 'admin' && (
                    <div className="md:col-span-2 bg-charcoal-900 text-white p-6 rounded-lg shadow-lg border border-blue-500/30 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Shield className="w-6 h-6 text-blue-500" />
                                <h2 className="text-xl font-bold">ระบบจัดการร้านค้า</h2>
                            </div>
                            <p className="text-gray-400 text-sm">จัดการสินค้า คำสั่งซื้อ และตั้งค่าร้านค้า</p>
                        </div>
                        <Link href="/admin">
                            <Button className="bg-blue-600 text-white hover:bg-blue-700 font-bold border-none">
                                ไปที่แดชบอร์ด
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
