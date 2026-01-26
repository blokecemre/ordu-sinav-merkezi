export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { AddUserDialog } from "@/components/admin/AddUserDialog"
import { UserDetailDialog } from "@/components/admin/UserDetailDialog"
import { EditUserDialog } from "@/components/admin/EditUserDialog"
import { DeleteUserButton } from "@/components/admin/DeleteUserButton"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

import { UserFilters } from "@/components/admin/UserFilters"
import { Prisma } from "@prisma/client"
import Link from "next/link"
import { TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function UsersPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams

    const role = (searchParams.role as string) || "ALL"
    const classLevel = (searchParams.classLevel as string) || "ALL"
    const school = (searchParams.school as string) || ""
    const search = (searchParams.search as string) || ""

    const where: Prisma.UserWhereInput = {}

    if (role !== "ALL") {
        where.role = role as any
    }

    if (classLevel !== "ALL") {
        where.classLevel = classLevel
    }

    if (school) {
        where.school = {
            contains: school,
            mode: "insensitive"
        }
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { surname: { contains: search, mode: "insensitive" } },
            { username: { contains: search, mode: "insensitive" } },
        ]
    }

    const users = await prisma.user.findMany({
        where,
        orderBy: [
            { role: "asc" }, // Group by role
            { name: "asc" }  // Then sort by name
        ],
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Kullanıcılar ({users.length})</h1>
                <AddUserDialog />
            </div>

            <UserFilters />

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ad Soyad</TableHead>
                            <TableHead>Kullanıcı Adı</TableHead>
                            <TableHead>Sınıf</TableHead>
                            <TableHead>Okul</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Kayıt Tarihi</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    Kullanıcı bulunamadı.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        {user.name} {user.surname}
                                    </TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.classLevel || "-"}</TableCell>
                                    <TableCell>{user.school || "-"}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            user.role === "ADMIN" ? "destructive" :
                                                user.role === "TEACHER" ? "default" : "secondary"
                                        }>
                                            {user.role === "ADMIN" ? "Yönetici" :
                                                user.role === "TEACHER" ? "Öğretmen" : "Öğrenci"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(user.createdAt), "d MMMM yyyy", { locale: tr })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {user.role === "STUDENT" && (
                                                <Link href={`/dashboard/admin/users/${user.id}`}>
                                                    <Button variant="ghost" size="icon" title="Detaylı Görünüm">
                                                        <TrendingUp className="w-4 h-4 text-indigo-600" />
                                                    </Button>
                                                </Link>
                                            )}
                                            <UserDetailDialog user={user} />
                                            <EditUserDialog user={user} />
                                            <DeleteUserButton userId={user.id} username={user.username} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
