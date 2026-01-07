"use client"

import { useState, useEffect, useRef } from "react"
import { Maximize, Minimize, Volume2, VolumeX, Clock, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function ExamTimerPage() {
    const [endTime, setEndTime] = useState("")
    const [isRunning, setIsRunning] = useState(false)
    const [timeLeft, setTimeLeft] = useState<string | null>(null)
    const [isMuted, setIsMuted] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isFinished, setIsFinished] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Initialize audio
    useEffect(() => {
        audioRef.current = new Audio("/sounds/alarm.mp3")
        // Note: You might need to add an actual sound file or use a base64 string for a simple beep
    }, [])

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    const startTimer = () => {
        if (!endTime) return

        setIsRunning(true)
        setIsFinished(false)
    }

    const stopTimer = () => {
        setIsRunning(false)
        setEndTime("")
        setTimeLeft(null)
    }

    useEffect(() => {
        let interval: NodeJS.Timeout

        if (isRunning && endTime) {
            interval = setInterval(() => {
                const now = new Date()
                const [targetHours, targetMinutes] = endTime.split(":").map(Number)
                const target = new Date()
                target.setHours(targetHours, targetMinutes, 0, 0)

                // If target is in the past (e.g. 09:00 but it's 14:00), assume it's tomorrow? 
                // For an exam timer, usually it's today. If it's passed, it's 0.
                if (target.getTime() < now.getTime()) {
                    // Check if it was meant for tomorrow? Simplest logic: if < now, it's finished.
                    // But actually, maybe user entered 15:30 and it is 14:30.
                    // If user enters 09:00 and it is 10:00, it's finished.
                }

                const diff = target.getTime() - now.getTime()

                if (diff <= 0) {
                    setIsRunning(false)
                    setIsFinished(true)
                    setTimeLeft("00:00:00")
                    if (!isMuted) {
                        // Play beep
                        // simple beep fallback if file not found
                        const beep = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU") // short fallback
                        beep.play().catch(e => console.log("Audio play failed", e))
                    }
                } else {
                    const hours = Math.floor(diff / (1000 * 60 * 60))
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

                    setTimeLeft(
                        `${hours.toString().padStart(2, "0")}:${minutes
                            .toString()
                            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
                    )
                }
            }, 1000)
        }

        return () => clearInterval(interval)
    }, [isRunning, endTime, isMuted])

    return (
        <div ref={containerRef} className="min-h-screen bg-white flex flex-col relative transition-colors duration-300">
            {/* Top Controls */}
            <div className="absolute top-6 right-6 flex items-center gap-4 z-50">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full w-12 h-12"
                >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full w-12 h-12"
                >
                    {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center space-y-12">

                    {/* Title */}
                    {!isRunning && !isFinished && (
                        <div className="space-y-4 animate-fade-in-up">
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
                                Sınav Sayacı
                            </h1>
                            <p className="text-slate-500 text-lg">
                                Sınav Bitiş Saati
                            </p>
                        </div>
                    )}

                    {/* Input Mode */}
                    {!isRunning && !isFinished && (
                        <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                    <Clock className="h-6 w-6 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                                </div>
                                <Input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="pl-16 h-20 text-3xl md:text-4xl bg-slate-50 border-0 shadow-inner rounded-2xl focus:ring-0 text-slate-700 tracking-widest text-center transition-all hover:bg-slate-100 focus:bg-white focus:shadow-lg"
                                />
                            </div>

                            <Button
                                onClick={startTimer}
                                className="w-full h-16 text-xl font-medium bg-slate-500 hover:bg-slate-600 text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                            >
                                <Play className="w-6 h-6 mr-3 fill-current" />
                                Sayacı Başlat
                            </Button>
                        </div>
                    )}

                    {/* Countdown Mode */}
                    {(isRunning || isFinished) && (
                        <div className="animate-fade-in-up space-y-12">
                            <div>
                                <h2 className="text-slate-400 text-xl font-medium mb-4 uppercase tracking-widest">Kalan Süre</h2>
                                <div className={cn(
                                    "text-7xl md:text-9xl font-bold tracking-tighter tabular-nums transition-colors duration-300",
                                    isFinished ? "text-red-500 animate-pulse" : "text-slate-800"
                                )}>
                                    {timeLeft || "Hesaplanıyor..."}
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                onClick={stopTimer}
                                className="h-12 border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 px-8 rounded-full"
                            >
                                Sayacı Durdur
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-8 text-center">
                <p className="text-slate-300 font-medium text-lg">
                    Ordu Sınav Merkezi
                </p>
            </div>
        </div>
    )
}
