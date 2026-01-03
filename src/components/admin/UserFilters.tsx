"use client"

import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function UserFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [search, setSearch] = useState(searchParams.get("search") || "")
    const [role, setRole] = useState(searchParams.get("role") || "ALL")
    const [classLevel, setClassLevel] = useState(searchParams.get("classLevel") || "ALL")
    const [school, setSchool] = useState(searchParams.get("school") || "")

    // Simple debounce implementation if hook doesn't exist
    useEffect(() => {
        const timer = setTimeout(() => {
            updateParams({ search, school })
        }, 500)
        return () => clearTimeout(timer)
    }, [search, school])

    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString())

        Object.entries(updates).forEach(([key, value]) => {
            if (value && value !== "ALL") {
                params.set(key, value)
            } else {
                params.delete(key)
            }
        })

        router.push(`?${params.toString()}`)
    }

    const handleRoleChange = (val: string) => {
        setRole(val)
        updateParams({ role: val })
    }

    const handleClassChange = (val: string) => {
        setClassLevel(val)
        updateParams({ classLevel: val })
    }

    return (
        <div className="space-y-4">
            <Tabs defaultValue={role} onValueChange={handleRoleChange} className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                    <TabsTrigger value="ALL">Tümü</TabsTrigger>
                    <TabsTrigger value="STUDENT">Öğrenci</TabsTrigger>
                    <TabsTrigger value="TEACHER">Öğretmen</TabsTrigger>
                    <TabsTrigger value="ADMIN">Yönetici</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="İsim veya kullanıcı adı ara..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8"
                    />
                </div>

                <Select value={classLevel} onValueChange={handleClassChange}>
                    <SelectTrigger className="w-full md:w-[150px]">
                        <SelectValue placeholder="Sınıf Seç" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tüm Sınıflar</SelectItem>
                        <SelectItem value="5">5. Sınıf</SelectItem>
                        <SelectItem value="6">6. Sınıf</SelectItem>
                        <SelectItem value="7">7. Sınıf</SelectItem>
                        <SelectItem value="8">8. Sınıf</SelectItem>
                        <SelectItem value="9">9. Sınıf</SelectItem>
                        <SelectItem value="10">10. Sınıf</SelectItem>
                        <SelectItem value="11">11. Sınıf</SelectItem>
                        <SelectItem value="12">12. Sınıf</SelectItem>
                        <SelectItem value="mezun">Mezun</SelectItem>
                    </SelectContent>
                </Select>

                <Input
                    placeholder="Okul adı filtrele..."
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full md:w-[200px]"
                />
            </div>
        </div>
    )
}
