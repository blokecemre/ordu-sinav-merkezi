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

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Kullanıcılar</h1>
                <AddUserDialog />
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ad Soyad</TableHead>
                            <TableHead>Kullanıcı Adı</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Kayıt Tarihi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                    {user.name} {user.surname}
                                </TableCell>
                                <TableCell>{user.username}</TableCell>
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
                                        <UserDetailDialog user={user} />
                                        <EditUserDialog user={user} />
                                        <DeleteUserButton userId={user.id} username={user.username} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
