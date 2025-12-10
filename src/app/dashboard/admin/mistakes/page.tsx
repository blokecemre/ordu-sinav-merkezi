"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Loader2, User as UserIcon, ChevronRight, Image as ImageIcon } from "lucide-react"

interface User {
    id: string
    name: string
    surname: string
    username: string
    classLevel: string | null
    mistakeCount: number
}

export default function AdminMistakesPage() {
    const [students, setStudents] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchStudents()
    }, [])

    const fetchStudents = async (query = "") => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/admin/users?role=STUDENT&includeMistakeCount=true&query=${query}`)
            if (res.ok) {
                const data = await res.json()
                setStudents(data)
            }
        } catch (error) {
            console.error("Failed to fetch students", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        fetchStudents(searchQuery)
    }

    // Group students by classLevel
    const groupedStudents = useMemo(() => {
        const groups: Record<string, User[]> = {}
        students.forEach(student => {
            const key = student.classLevel ? `${student.classLevel}. Sınıf` : "Sınıf Belirtilmemiş"
            if (!groups[key]) {
                groups[key] = []
            }
            groups[key].push(student)
        })

        // Sort each group alphabetically by name, then surname
        Object.values(groups).forEach(group => {
            group.sort((a, b) => {
                const nameCompare = a.name.localeCompare(b.name, 'tr')
                if (nameCompare !== 0) return nameCompare
                return a.surname.localeCompare(b.surname, 'tr')
            })
        })

        // Sort groups by class level (numeric)
        const sortedKeys = Object.keys(groups).sort((a, b) => {
            const aNum = parseInt(a) || 99
            const bNum = parseInt(b) || 99
            return aNum - bNum
        })

        return sortedKeys.map(key => ({ classLevel: key, students: groups[key] }))
    }, [students])

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Yanlış Soru Defteri - Öğrenci Seçimi</h1>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Öğrenci ara (isim, soyisim, kullanıcı adı)..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button type="submit">Ara</Button>
            </form>

            {isLoading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            ) : students.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                    Öğrenci bulunamadı.
                </div>
            ) : (
                <div className="space-y-8">
                    {groupedStudents.map(group => (
                        <div key={group.classLevel} className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">{group.classLevel}</h2>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {group.students.map((student) => (
                                    <Link key={student.id} href={`/dashboard/admin/mistakes/${student.id}`}>
                                        <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
                                            <CardContent className="p-6 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <UserIcon className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{student.name} {student.surname}</h3>
                                                        <p className="text-sm text-gray-500">@{student.username}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                                                                <ImageIcon className="h-3 w-3" />
                                                                {student.mistakeCount} soru
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronRight className="h-5 w-5 text-gray-400" />
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
