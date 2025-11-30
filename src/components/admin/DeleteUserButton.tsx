"use client"

import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import { deleteUser } from "@/app/actions/user"
import { toast } from "sonner"
import { useState } from "react"

interface DeleteUserButtonProps {
    userId: string
    username: string
}

export function DeleteUserButton({ userId, username }: DeleteUserButtonProps) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        try {
            const result = await deleteUser(userId)
            if (result.success) {
                toast.success(result.message)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error("Silme işlemi sırasında bir hata oluştu")
        } finally {
            setLoading(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" /> Sil
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Kullanıcıyı silmek istediğinize emin misiniz?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bu işlem geri alınamaz. <b>{username}</b> kullanıcısı ve ilişkili tüm verileri (sınav sonuçları, analizler vb.) kalıcı olarak silinecektir.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>İptal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={loading}>
                        {loading ? "Siliniyor..." : "Evet, Sil"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
