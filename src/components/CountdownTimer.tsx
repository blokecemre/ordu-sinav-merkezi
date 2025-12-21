"use client"

import { useState, useEffect } from "react"
import { Calendar } from "lucide-react"

interface ExamData {
    id: string
    name: string
    fullName: string
    date: Date
    displayDate: string
    bgClass: string
    glowColor: string
}

interface CountdownTimerProps {
    lgsDate?: string | null
    tytDate?: string | null
    aytDate?: string | null
}

export function CountdownTimer({ lgsDate, tytDate, aytDate }: CountdownTimerProps) {
    const exams: ExamData[] = [
        {
            id: "lgs",
            name: "LGS",
            fullName: "Liselere Geçiş Sınavı",
            date: lgsDate ? new Date(lgsDate) : new Date("2025-06-08T10:00:00"),
            displayDate: lgsDate
                ? new Date(lgsDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", weekday: "long" })
                : "8 Haziran 2025, Pazar",
            bgClass: "from-blue-600 via-blue-500 to-cyan-500",
            glowColor: "bg-blue-400/20",
        },
        {
            id: "tyt",
            name: "TYT",
            fullName: "Temel Yeterlilik Testi",
            date: tytDate ? new Date(tytDate) : new Date("2025-06-14T10:00:00"),
            displayDate: tytDate
                ? new Date(tytDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", weekday: "long" })
                : "14 Haziran 2025, Cumartesi",
            bgClass: "from-emerald-600 via-green-500 to-teal-500",
            glowColor: "bg-emerald-400/20",
        },
        {
            id: "ayt",
            name: "AYT",
            fullName: "Alan Yeterlilik Testi",
            date: aytDate ? new Date(aytDate) : new Date("2025-06-15T10:00:00"),
            displayDate: aytDate
                ? new Date(aytDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", weekday: "long" })
                : "15 Haziran 2025, Pazar",
            bgClass: "from-purple-600 via-violet-500 to-fuchsia-500",
            glowColor: "bg-purple-400/20",
        },
    ]

    const [selectedExam, setSelectedExam] = useState(exams[0])
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date().getTime()
            const difference = selectedExam.date.getTime() - now

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000),
                })
            }
        }

        calculateTime()
        const timer = setInterval(calculateTime, 1000)
        return () => clearInterval(timer)
    }, [selectedExam])

    const timeUnits = [
        { label: "GÜN", value: timeLeft.days },
        { label: "SAAT", value: timeLeft.hours },
        { label: "DAKİKA", value: timeLeft.minutes },
        { label: "SANİYE", value: timeLeft.seconds },
    ]

    return (
        <section className="relative py-16 md:py-24 overflow-hidden">
            {/* Dynamic Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${selectedExam.bgClass} transition-all duration-700`} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />

            {/* Floating Elements */}
            <div className={`absolute top-10 left-10 w-32 h-32 rounded-full ${selectedExam.glowColor} blur-3xl animate-pulse`} />
            <div className={`absolute bottom-10 right-10 w-48 h-48 rounded-full ${selectedExam.glowColor} blur-3xl animate-pulse delay-1000`} />

            <div className="container mx-auto px-4 relative z-10">
                {/* Exam Selector Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex bg-white/10 backdrop-blur-md rounded-2xl p-2 gap-2 border border-white/20">
                        {exams.map((exam) => (
                            <button
                                key={exam.id}
                                onClick={() => setSelectedExam(exam)}
                                className={`relative px-6 py-3 md:px-10 md:py-4 rounded-xl font-bold text-sm md:text-base transition-all duration-300 ${selectedExam.id === exam.id
                                    ? "bg-white text-primary shadow-lg"
                                    : "text-white/70 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                {exam.name}
                                {selectedExam.id === exam.id && (
                                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/80 whitespace-nowrap font-normal">
                                        {exam.fullName}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-12 mt-8">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                        {selectedExam.name}'ye Kalan Süre
                    </h2>
                    <p className="text-white/80 text-lg">Hedefe Geri Sayım</p>
                    <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                        <Calendar className="w-4 h-4 text-white/80" />
                        <span className="text-white/90 text-sm font-medium">{selectedExam.displayDate}</span>
                    </div>
                </div>

                {/* Countdown Display */}
                <div className="flex justify-center items-center gap-3 md:gap-6 flex-wrap">
                    {timeUnits.map((unit, index) => (
                        <div key={unit.label} className="flex items-center gap-3 md:gap-6">
                            <div className="relative group">
                                {/* Glow Effect */}
                                <div className={`absolute -inset-2 ${selectedExam.glowColor} rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`} />

                                {/* Card */}
                                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-8 min-w-[80px] md:min-w-[120px]">
                                    <div className="text-4xl md:text-7xl font-black text-white tabular-nums tracking-tight">
                                        {String(unit.value).padStart(2, "0")}
                                    </div>
                                    <div className="text-xs md:text-sm font-semibold text-white/60 mt-2 tracking-widest">
                                        {unit.label}
                                    </div>
                                </div>
                            </div>

                            {/* Separator */}
                            {index < timeUnits.length - 1 && (
                                <div className="text-4xl md:text-6xl font-bold text-white/40 animate-pulse">:</div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Motivational Text */}
                <p className="text-center text-white/70 mt-12 text-lg font-medium">
                    Her saniye değerli. Şimdi hazırlanma zamanı!
                </p>
            </div>
        </section>
    )
}
