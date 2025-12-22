import Link from "next/link"
import { getDashboardStats } from "./dashboard-actions"
import { DashboardCharts } from "./DashboardCharts"

export default async function AdminDashboard() {
    const stats = await getDashboardStats()

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-charcoal-900">Dashboard Overview</h1>
            </div>

            <DashboardCharts data={stats} />


        </div>
    )
}
