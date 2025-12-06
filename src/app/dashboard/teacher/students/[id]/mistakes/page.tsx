"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"

interface Mistake {
    id: string
    imageData: string
    description: string | null
    lesson: string
    createdAt: string
}

export default function StudentMistakesPage() {
    const params = useParams()
    const [mistakes, setMistakes] = useState<Mistake[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchMistakes = async () => {
            try {
                const res = await fetch(`/api/mistakes?studentId=${params.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setMistakes(data)
                } else {
                    setError("Veriler yüklenemedi")
                }
            } catch (err) {
                console.error(err)
                setError("Bir hata oluştu")
            } finally {
                setIsLoading(false)
            }
        }

        if (params.id) {
            fetchMistakes()
        }
    }, [params.id])

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8 text-red-500">
                <AlertCircle className="mr-2 h-5 w-5" />
                {error}
            </div>
        )
    }

    // Group mistakes by lesson
    const groupedMistakes = mistakes.reduce((acc, mistake) => {
        const lesson = mistake.lesson || "Genel"
        if (!acc[lesson]) {
            acc[lesson] = []
        }
        acc[lesson].push(mistake)
        return acc
    }, {} as Record<string, Mistake[]>)

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Öğrenci Yanlış Soru Defteri</h1>

            {mistakes.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                    Bu öğrenci henüz yanlış soru yüklememiş.
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedMistakes).map(([groupLesson, groupMistakes]) => (
                        <div key={groupLesson} className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">{groupLesson}</h2>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {groupMistakes.map((mistake) => (
                                    <Card key={mistake.id} className="overflow-hidden group">
                                        <div className="aspect-[3/4] relative bg-gray-100">
                                            <img
                                                src={mistake.imageData}
                                                alt="Mistake"
                                                className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 cursor-pointer"
                                                onClick={() => window.open(mistake.imageData, '_blank')}
                                            />
                                        </div>
                                        <CardContent className="p-4">
                                            <p className="text-xs text-gray-500 mb-1">
                                                {new Date(mistake.createdAt).toLocaleDateString("tr-TR", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </p>
                                            {mistake.description && (
                                                <p className="text-sm text-gray-700 line-clamp-2">{mistake.description}</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
