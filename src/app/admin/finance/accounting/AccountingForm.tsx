'use client'

import { useState } from "react"
import { addTransaction } from "./actions"
import { Button } from "@/components/ui/button"
import { PlusCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function AccountingForm() {
    const [isPending, setIsPending] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsPending(true)

        try {
            const result = await addTransaction(null, formData)
            if (result.success) {
                toast.success("เพิ่มรายการเรียบร้อยแล้ว")
                // Reset form manually since we're not using action state for reset
                const form = document.getElementById("accounting-form") as HTMLFormElement
                form?.reset()
            } else {
                toast.error(result.message)
            }
        } catch (e) {
            toast.error("บันทึกไม่สำเร็จ")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-charcoal-900">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                เพิ่มรายการ
            </h3>

            <form id="accounting-form" action={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">วันที่</label>
                        <input
                            type="date"
                            name="date"
                            required
                            defaultValue={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ประเภท</label>
                        <select
                            name="type"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                        >
                            <option value="Expense">รายจ่าย (Expense)</option>
                            <option value="Income">รายรับ (Income)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
                    <input
                        type="text"
                        name="category"
                        placeholder="เช่น ค่าเช่า, ค่าน้ำ, เงินเดือน"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนเงิน (บาท)</label>
                    <input
                        type="number"
                        name="amount"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด (เลือกใส่ได้)</label>
                    <textarea
                        name="description"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    ></textarea>
                </div>

                <Button type="submit" className="w-full bg-charcoal-900 hover:bg-black text-white" disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            กำลังบันทึก...
                        </>
                    ) : (
                        "บันทึกข้อมูล"
                    )}
                </Button>
            </form>
        </div>
    )
}
