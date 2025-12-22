"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Clock } from "lucide-react"

interface OrderTimerProps {
    createdAt: string
    onExpire?: () => void
}

export function OrderTimer({ createdAt, onExpire }: OrderTimerProps) {
    const router = useRouter()
    const [timeLeft, setTimeLeft] = useState<string>("")
    const [isExpired, setIsExpired] = useState(false)

    useEffect(() => {
        const orderTime = new Date(createdAt).getTime()
        const expireTime = orderTime + (60 * 60 * 1000) // 1 Hour

        const updateTimer = () => {
            const now = new Date().getTime()
            const difference = expireTime - now

            if (difference <= 0) {
                setTimeLeft("00:00")
                setIsExpired(true)
                if (onExpire) {
                    onExpire()
                } else {
                    router.refresh()
                }
                return
            }

            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((difference % (1000 * 60)) / 1000)

            setTimeLeft(
                `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
            )
        }

        // Initial call
        updateTimer()

        const interval = setInterval(updateTimer, 1000)

        return () => clearInterval(interval)
    }, [createdAt, router, onExpire])

    if (isExpired) return <span className="text-red-600 font-bold">หมดเวลาชำระเงิน</span>

    return (
        <div className="flex items-center gap-1.5 text-orange-600 font-medium bg-orange-50 px-3 py-1 rounded-full text-xs">
            <Clock size={14} />
            <span>ชำระภายใน {timeLeft}</span>
        </div>
    )
}
