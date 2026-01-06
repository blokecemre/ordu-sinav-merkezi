"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Phone, ArrowRight, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CountdownHero() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    })

    // Set the date we're counting down to (e.g., June 15, 2026 09:00:00)
    // In a real app, this could come from the "Settings" or "Next Exam" API
    const targetDate = new Date("2026-06-15T09:00:00").getTime()

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime()
            const difference = targetDate - now

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                })
            }
        }

        const timer = setInterval(calculateTimeLeft, 1000)
        calculateTimeLeft() // Initial call

        return () => clearInterval(timer)
    }, [])

    return (
        <div className="min-h-[90vh] relative overflow-hidden flex items-center justify-center bg-background">
            {/* Gradient Background */}
            <div className="absolute inset-0 hero-gradient opacity-10 dark:opacity-20" />

            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse-glow" />
                <div className="absolute bottom-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-8 border border-primary/20 backdrop-blur-sm">
                    <Timer className="w-4 h-4" />
                    <span>Sınava Kalan Süre</span>
                </div>

                <h1 className="mb-6 text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
                    Ordu Sınav Merkezi
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                    Başarıya giden yolda profesyonel kadromuz ve modern eğitim sistemimizle yanınızdayız.
                </p>

                {/* Countdown Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16">
                    <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center card-lift">
                        <span className="text-4xl md:text-5xl font-bold text-primary mb-2">{timeLeft.days}</span>
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Gün</span>
                    </div>
                    <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center card-lift">
                        <span className="text-4xl md:text-5xl font-bold text-primary mb-2">{timeLeft.hours}</span>
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Saat</span>
                    </div>
                    <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center card-lift">
                        <span className="text-4xl md:text-5xl font-bold text-primary mb-2">{timeLeft.minutes}</span>
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Dakika</span>
                    </div>
                    <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center card-lift">
                        <span className="text-4xl md:text-5xl font-bold text-primary mb-2">{timeLeft.seconds}</span>
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Saniye</span>
                    </div>
                </div>

                <Link href="/iletisim">
                    <Button
                        size="lg"
                        className="h-14 px-8 text-lg font-semibold rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/50 transition-all duration-300 group btn-glow"
                    >
                        <Phone className="w-5 h-5 mr-3" />
                        İletişime Geç
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>
        </div>
    )
}
