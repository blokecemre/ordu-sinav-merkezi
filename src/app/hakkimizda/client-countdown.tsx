"use client"

import { useState, useEffect } from "react"

export function ClientCountdown({ targetDate }: { targetDate: string }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    })

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date()

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                })
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
            }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [targetDate])

    return (
        <div className="flex justify-center gap-4 md:gap-8">
            <TimeUnit value={timeLeft.days} label="GÜN" />
            <TimeUnit value={timeLeft.hours} label="SAAT" />
            <TimeUnit value={timeLeft.minutes} label="DAKİKA" />
            <TimeUnit value={timeLeft.seconds} label="SANİYE" />
        </div>
    )
}

function TimeUnit({ value, label }: { value: number, label: string }) {
    return (
        <div className="flex flex-col items-center">
            <div className="bg-[#007bff] text-white text-4xl md:text-6xl font-bold rounded-lg w-20 h-24 md:w-32 md:h-40 flex items-center justify-center shadow-lg mb-2">
                {value.toString().padStart(2, '0')}
            </div>
            <span className="text-xs md:text-sm text-gray-500 font-medium tracking-wider">{label}</span>
        </div>
    )
}
