'use server'

import { getTransactionsSetup } from "@/lib/google-sheets"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const TransactionSchema = z.object({
    type: z.enum(['Income', 'Expense']),
    category: z.string().min(1, "Category is required"),
    amount: z.coerce.number().min(1, "Amount must be greater than 0"),
    description: z.string().optional(),
    date: z.string() // YYYY-MM-DD
})

import { createClient } from "@/lib/supabase-server"

// Helper for programmatic access
export async function recordTransaction(data: {
    date: string,
    type: 'Income' | 'Expense',
    category: string,
    amount: number,
    description?: string,
    referenceId?: string
}) {
    try {
        const sheet = await getTransactionsSetup()
        await sheet.addRow({
            'Date': data.date,
            'Type': data.type,
            'Category': data.category,
            'Amount': data.amount,
            'Description': data.description || '',
            'ReferenceID': data.referenceId || `MANUAL-${Date.now()}`
        })
        return { success: true }
    } catch (e: any) {
        console.error("Record Transaction Error:", e)
        return { success: false, message: e.message }
    }
}

// Helper to delete transaction by ReferenceID
export async function deleteTransactionByReference(referenceId: string) {
    try {
        const sheet = await getTransactionsSetup()
        const rows = await sheet.getRows()

        // Find rows causing duplicates? delete all matching
        const rowsToDelete = rows.filter(row => {
            const data = row.toObject()
            return data.ReferenceID === referenceId
        })

        for (const row of rowsToDelete) {
            await row.delete()
        }

        return { success: true, count: rowsToDelete.length }
    } catch (e: any) {
        console.error("Delete Transaction Error:", e)
        return { success: false, message: e.message }
    }
}

export async function addTransaction(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { message: "Unauthorized" }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return { message: "Forbidden" }

    try {
        const rawData = {
            type: formData.get('type'),
            category: formData.get('category'),
            amount: formData.get('amount'),
            description: formData.get('description'),
            date: formData.get('date'),
        }

        const validated = TransactionSchema.safeParse(rawData)

        if (!validated.success) {
            return { message: validated.error.issues[0].message }
        }

        const { type, category, amount, description, date } = validated.data

        const result = await recordTransaction({
            date,
            type,
            category,
            amount,
            description,
        })

        if (!result.success) throw new Error(result.message)

        revalidatePath('/admin/finance/accounting')
        return { success: true, message: "Transaction added successfully" }

    } catch (e: any) {
        console.error("Google Sheet Error:", e)
        return { message: "Failed to add transaction: " + e.message }
    }
}

export async function getRecentTransactions() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return []

    try {
        const sheet = await getTransactionsSetup()
        const rows = await sheet.getRows({ limit: 20, offset: 0 }) // Get recent 20

        // Reverse to show newest first (Sheet appends to bottom)
        return rows.reverse().map(row => {
            const data = row.toObject()
            return {
                date: data.Date,
                type: data.Type,
                category: data.Category,
                amount: parseFloat(data.Amount || '0'),
                description: data.Description,
            }
        })

    } catch (e) {
        console.error("Fetch Sheet Error:", e)
        return []
    }
}

export async function getFinancialStats() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { income: 0, expense: 0, profit: 0 }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return { income: 0, expense: 0, profit: 0 }

    try {
        const sheet = await getTransactionsSetup()
        const rows = await sheet.getRows() // Get all rows for calculation

        let totalIncome = 0
        let totalExpense = 0

        rows.forEach(row => {
            const data = row.toObject()
            const amount = parseFloat(data.Amount || '0')
            const type = data.Type

            if (type === 'Income') totalIncome += amount
            if (type === 'Expense') totalExpense += amount
        })

        return {
            income: totalIncome,
            expense: totalExpense,
            profit: totalIncome - totalExpense
        }

    } catch (e) {
        console.error("Stats Error:", e)
        return { income: 0, expense: 0, profit: 0 }
    }
}
