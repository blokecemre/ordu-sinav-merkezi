"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { startOfDay, subDays, format } from "date-fns"
import { tr } from "date-fns/locale"

export async function getSubjects() {
    try {
        let subjects = await prisma.subject.findMany({
            orderBy: { name: 'asc' }
        })

        // Check for required subjects and add if missing
        const requiredSubjects = [
            "Fen Bilimleri",
            "Kitap Okuma",
            "Sosyal Bilgiler",
            "İnkılap Tarihi ve Atatürkçülük",
            "Matematik",
            "Türkçe",
            "Din Kültürü ve Ahlak Bilgisi",
            "İngilizce"
        ]

        const existingNames = subjects.map(s => s.name)
        const missingSubjects = requiredSubjects.filter(name => !existingNames.includes(name))

        if (missingSubjects.length > 0) {
            await prisma.subject.createMany({
                data: missingSubjects.map(name => ({ name }))
            })
            // Refresh list
            subjects = await prisma.subject.findMany({ orderBy: { name: 'asc' } })
        }

        return { success: true, subjects }
    } catch (error) {
        return { success: false, error: "Dersler getirilemedi." }
    }
}

export async function logActivity(data: {
    studentId: string
    subjectId: string
    correctCount: number
    wrongCount: number
    readingPage: number
    date?: Date
}) {
    try {
        await prisma.dailyLog.create({
            data: {
                studentId: data.studentId,
                subjectId: data.subjectId,
                correctCount: data.correctCount,
                wrongCount: data.wrongCount,
                readingPage: data.readingPage,
                date: data.date || new Date()
            }
        })

        revalidatePath("/dashboard/student/performance")
        return { success: true, message: "Aktivite kaydedildi." }
    } catch (error) {
        return { success: false, message: "Kayıt sırasında bir hata oluştu." }
    }
}

export async function getStats(studentId: string) {
    try {
        const today = new Date()
        const last7Days = subDays(today, 6)

        // 1. Get raw logs for last 7 days
        const logs = await prisma.dailyLog.findMany({
            where: {
                studentId,
                date: {
                    gte: startOfDay(last7Days)
                }
            },
            include: {
                subject: true
            },
            orderBy: { date: 'asc' }
        })

        // 2. Calculate Streak
        // Find distinct days with activity
        const activityDays = await prisma.dailyLog.groupBy({
            by: ['date'],
            where: { studentId },
            orderBy: { date: 'desc' },
            take: 30
        })

        let streak = 0
        // Simple streak logic (consecutive days) needs careful date comparison
        // For now, let's just check if there is activity in the last 3 days for the warning

        const lastActivity = await prisma.dailyLog.findFirst({
            where: { studentId },
            orderBy: { date: 'desc' }
        })

        const daysSinceLastActivity = lastActivity
            ? Math.floor((today.getTime() - new Date(lastActivity.date).getTime()) / (1000 * 60 * 60 * 24))
            : 999

        const disciplineWarning = daysSinceLastActivity >= 3

        // 3. Prepare Chart Data
        // Stacked Bar: Date -> Correct/Wrong
        const dailyStatsMap = new Map<string, { correct: number, wrong: number, date: string }>()

        // Initialize last 7 days empty
        for (let i = 0; i < 7; i++) {
            const d = subDays(today, 6 - i)
            const key = format(d, "d MMM", { locale: tr })
            dailyStatsMap.set(key, { correct: 0, wrong: 0, date: key })
        }

        logs.forEach(log => {
            const key = format(new Date(log.date), "d MMM", { locale: tr })
            if (dailyStatsMap.has(key)) {
                const existing = dailyStatsMap.get(key)!
                existing.correct += log.correctCount
                existing.wrong += log.wrongCount
            }
        })

        const dailyStats = Array.from(dailyStatsMap.values())

        // Stacked Bar: Subject Performance
        const subjectStatsMap = new Map<string, { correct: number, wrong: number }>()
        logs.forEach(log => {
            const current = subjectStatsMap.get(log.subject.name) || { correct: 0, wrong: 0 }
            subjectStatsMap.set(log.subject.name, {
                correct: current.correct + log.correctCount,
                wrong: current.wrong + log.wrongCount
            })
        })

        const subjectStats = Array.from(subjectStatsMap.entries()).map(([name, counts]) => ({
            name,
            correct: counts.correct,
            wrong: counts.wrong,
            total: counts.correct + counts.wrong
        }))

        // Line: Success Percentage Trend
        const successTrend = dailyStats.map(stat => ({
            date: stat.date,
            percentage: (stat.correct + stat.wrong) > 0
                ? Math.round((stat.correct / (stat.correct + stat.wrong)) * 100)
                : 0
        }))

        return {
            success: true,
            disciplineWarning,
            daysSinceLastActivity,
            dailyStats,
            subjectStats,
            successTrend,
            totalReading: logs.reduce((acc, curr) => acc + curr.readingPage, 0)
        }

    } catch (error) {
        console.error(error)
        return { success: false, message: "İstatistikler alınamadı." }
    }
}

export async function deleteActivity(logId: string) {
    try {
        await prisma.dailyLog.delete({
            where: { id: logId }
        })
        revalidatePath("/dashboard/admin/users")
        return { success: true, message: "Kayıt silindi." }
    } catch (error) {
        return { success: false, message: "Silme işlemi başarısız." }
    }
}

export async function updateActivity(data: {
    id: string
    correctCount: number
    wrongCount: number
    readingPage: number
}) {
    try {
        await prisma.dailyLog.update({
            where: { id: data.id },
            data: {
                correctCount: data.correctCount,
                wrongCount: data.wrongCount,
                readingPage: data.readingPage
            }
        })
        revalidatePath("/dashboard/admin/users")
        return { success: true, message: "Kayıt güncellendi." }
    } catch (error) {
        return { success: false, message: "Güncelleme başarısız." }
    }
}
