'use client'

import { useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts'
import { Printer, TrendingUp, ShoppingCart, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardProps {
    data: {
        totalRevenue: number
        pendingOrders: number
        totalProducts: number
        monthlySales: { date: string, total: number, shortDate: string }[]
        orderStatusDistribution: { name: string, value: number }[]
    }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function DashboardCharts({ data }: DashboardProps) {
    const componentRef = useRef<HTMLDivElement>(null)
    const [printOptions, setPrintOptions] = useState({
        showStats: true,
        showSales: true,
        showStatus: true
    })

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Admin-Report-${new Date().toISOString().split('T')[0]}`,
    })

    return (
        <div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-6">
                    <span className="text-sm font-medium text-gray-700">Print Options:</span>
                    <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-charcoal-900">
                        <input
                            type="checkbox"
                            checked={printOptions.showStats}
                            onChange={(e) => setPrintOptions({ ...printOptions, showStats: e.target.checked })}
                            className="rounded border-gray-300 text-gold-500 focus:ring-gold-500"
                        />
                        Stats Cards
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-charcoal-900">
                        <input
                            type="checkbox"
                            checked={printOptions.showSales}
                            onChange={(e) => setPrintOptions({ ...printOptions, showSales: e.target.checked })}
                            className="rounded border-gray-300 text-gold-500 focus:ring-gold-500"
                        />
                        Sales Chart
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-charcoal-900">
                        <input
                            type="checkbox"
                            checked={printOptions.showStatus}
                            onChange={(e) => setPrintOptions({ ...printOptions, showStatus: e.target.checked })}
                            className="rounded border-gray-300 text-gold-500 focus:ring-gold-500"
                        />
                        Order Status
                    </label>
                </div>

                <Button onClick={() => handlePrint()} className="gap-2">
                    <Printer size={16} />
                    Export PDF / Print
                </Button>
            </div>

            <div ref={componentRef} className="p-4 bg-gray-50/50 min-h-screen">
                {/* Header for Print */}
                <div className="hidden print:block mb-8 text-center">
                    <h1 className="text-2xl font-bold">Admin Dashboard Report</h1>
                    <p className="text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
                </div>

                {/* Stats Cards */}
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ${!printOptions.showStats ? 'print:hidden' : ''}`}>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="text-2xl font-bold">฿{data.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-green-600 mt-1">Paid & Completed Orders</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
                            <ShoppingCart className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold">{data.pendingOrders}</div>
                        <p className="text-xs text-gray-500 mt-1">Needs Attention</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
                            <Package className="w-5 h-5 text-gold-500" />
                        </div>
                        <div className="text-2xl font-bold">{data.totalProducts}</div>
                        <p className="text-xs text-gray-500 mt-1">Active items</p>
                    </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 print:block print:space-y-8">

                    {/* Sales Chart */}
                    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 print:break-inside-avoid ${!printOptions.showSales ? 'print:hidden' : ''}`}>
                        <h3 className="font-bold text-lg mb-6 text-charcoal-900">Sales Trends (Last 30 Days)</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.monthlySales}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="shortDate" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `฿${value}`}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <Tooltip
                                        formatter={(value: any) => [`฿${Number(value).toLocaleString()}`, 'Revenue']}
                                        labelStyle={{ color: '#111' }}
                                    />
                                    <Area type="monotone" dataKey="total" stroke="#D4AF37" fillOpacity={1} fill="url(#colorTotal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Status Chart */}
                    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 print:break-inside-avoid ${!printOptions.showStatus ? 'print:hidden' : ''}`}>
                        <h3 className="font-bold text-lg mb-6 text-charcoal-900">Order Status Distribution</h3>
                        <div className="h-[300px] w-full flex justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.orderStatusDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.orderStatusDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
