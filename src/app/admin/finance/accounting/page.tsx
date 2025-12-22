import { getFinancialStats, getRecentTransactions } from "./actions"
import { AccountingForm } from "./AccountingForm"
import { ArrowUpCircle, ArrowDownCircle, Banknote } from "lucide-react"

export const dynamic = 'force-dynamic' // Ensure stats are always fresh

export default async function AccountingPage() {
    const stats = await getFinancialStats()
    const transactions = await getRecentTransactions()

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-heading font-bold text-charcoal-900">Accounting (Google Sheets)</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Income</p>
                            <h3 className="text-2xl font-bold text-green-600 mt-1">฿{stats.income.toLocaleString()}</h3>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <ArrowUpCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Expenses</p>
                            <h3 className="text-2xl font-bold text-red-600 mt-1">฿{stats.expense.toLocaleString()}</h3>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <ArrowDownCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Net Profit</p>
                            <h3 className={`text-2xl font-bold mt-1 ${stats.profit >= 0 ? 'text-charcoal-900' : 'text-red-600'}`}>
                                ฿{stats.profit.toLocaleString()}
                            </h3>
                        </div>
                        <div className="bg-gold-100 p-3 rounded-full">
                            <Banknote className="w-6 h-6 text-gold-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <AccountingForm />
                </div>

                {/* Recent Transactions List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="font-bold text-lg text-charcoal-900">Recent Transactions</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Category</th>
                                        <th className="px-6 py-3">Description</th>
                                        <th className="px-6 py-3 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                No transactions found in Sheet.
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.map((tx, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-6 py-3 whitespace-nowrap text-gray-600">{tx.date}</td>
                                                <td className="px-6 py-3 font-medium text-charcoal-900">{tx.category}</td>
                                                <td className="px-6 py-3 text-gray-500">{tx.description}</td>
                                                <td className={`px-6 py-3 text-right font-bold ${tx.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {tx.type === 'Income' ? '+' : '-'}฿{tx.amount.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
