"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react"

interface Mistake {
    id: string
    imageData: string
    description: string | null
    createdAt: string
}

export default function AdminStudentMistakesPage() {
    const params = useParams()
    const router = useRouter()
    const [mistakes, setMistakes] = useState<Mistake[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchMistakes = async () => {
            try {
                const res = await fetch(`/api/mistakes?studentId=${params.studentId}`)
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

        if (params.studentId) {
            fetchMistakes()
        }
    }, [params.studentId])

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

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Öğrenci Yanlış Soruları</h1>
            </div>

            {mistakes.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                    Bu öğrenci henüz yanlış soru yüklememiş.
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {mistakes.map((mistake) => (
                        <Card key={mistake.id} className="overflow-hidden group">
                            <div className="aspect-[3/4] relative bg-gray-100">
                                <img
                                    src={mistake.imageData}
                                    alt="Mistake"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
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
            )}
        </div>
    )
}
