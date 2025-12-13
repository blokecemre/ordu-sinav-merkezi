"use client"

import { useState, useEffect, useRef } from "react"

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
            <FlipUnit value={timeLeft.days} label="GÜN" />
            <FlipUnit value={timeLeft.hours} label="SAAT" />
            <FlipUnit value={timeLeft.minutes} label="DAKİKA" />
            <FlipUnit value={timeLeft.seconds} label="SANİYE" />
        </div>
    )
}

function FlipUnit({ value, label }: { value: number, label: string }) {
    const [prevValue, setPrevValue] = useState(value)
    const [isFlipping, setIsFlipping] = useState(false)

    useEffect(() => {
        if (prevValue !== value) {
            setIsFlipping(true)
            const timeout = setTimeout(() => {
                setPrevValue(value)
                setIsFlipping(false)
            }, 300)
            return () => clearTimeout(timeout)
        }
    }, [value, prevValue])

    const displayValue = value.toString().padStart(2, '0')
    const prevDisplayValue = prevValue.toString().padStart(2, '0')

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-20 h-24 md:w-32 md:h-40 perspective-1000">
                {/* Static background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0088ff] to-[#0066cc] rounded-lg shadow-lg overflow-hidden">
                    {/* Top half static */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[#0099ff] to-[#0077dd] flex items-end justify-center overflow-hidden">
                        <span className="text-white text-4xl md:text-6xl font-bold translate-y-1/2">
                            {displayValue}
                        </span>
                    </div>
                    {/* Bottom half static */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[#0066cc] to-[#0055aa] flex items-start justify-center overflow-hidden">
                        <span className="text-white text-4xl md:text-6xl font-bold -translate-y-1/2">
                            {displayValue}
                        </span>
                    </div>
                    {/* Center line */}
                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-black/20 -translate-y-1/2 z-10"></div>
                </div>

                {/* Flip animation layer */}
                {isFlipping && (
                    <>
                        {/* Top flap flipping down */}
                        <div
                            className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[#0099ff] to-[#0077dd] rounded-t-lg overflow-hidden origin-bottom animate-flip-down z-20"
                        >
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-white text-4xl md:text-6xl font-bold">
                                {prevDisplayValue}
                            </span>
                        </div>
                        {/* Bottom flap flipping up */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[#0066cc] to-[#0055aa] rounded-b-lg overflow-hidden origin-top animate-flip-up z-20"
                            style={{ animationDelay: '150ms' }}
                        >
                            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-4xl md:text-6xl font-bold">
                                {displayValue}
                            </span>
                        </div>
                    </>
                )}
            </div>
            <span className="text-xs md:text-sm text-gray-500 font-medium tracking-wider mt-2">{label}</span>

            <style jsx global>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                @keyframes flipDown {
                    0% {
                        transform: rotateX(0deg);
                    }
                    100% {
                        transform: rotateX(-90deg);
                    }
                }
                @keyframes flipUp {
                    0% {
                        transform: rotateX(90deg);
                    }
                    100% {
                        transform: rotateX(0deg);
                    }
                }
                .animate-flip-down {
                    animation: flipDown 0.3s ease-in forwards;
                    backface-visibility: hidden;
                }
                .animate-flip-up {
                    animation: flipUp 0.3s ease-out forwards;
                    backface-visibility: hidden;
                }
            `}</style>
        </div>
    )
}
