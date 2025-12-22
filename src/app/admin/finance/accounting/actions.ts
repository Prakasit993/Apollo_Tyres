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

export async function addTransaction(prevState: any, formData: FormData) {
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
            return { message: validated.error.errors[0].message }
        }

        const { type, category, amount, description, date } = validated.data
        const sheet = await getTransactionsSetup()

        await sheet.addRow({
            'Date': date,
            'Type': type,
            'Category': category,
            'Amount': amount,
            'Description': description || '',
            'ReferenceID': `MANUAL-${Date.now()}`
        })

        revalidatePath('/admin/finance/accounting')
        return { success: true, message: "Transaction added successfully" }

    } catch (e: any) {
        console.error("Google Sheet Error:", e)
        return { message: "Failed to add transaction: " + e.message }
    }
}

export async function getRecentTransactions() {
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
