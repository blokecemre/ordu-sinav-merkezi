"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState, useActionState, useEffect } from "react"
import { updateUser } from "@/app/actions/user"
import { toast } from "sonner"
import { Pencil } from "lucide-react"
import { User } from "@prisma/client"

const initialState = {
    message: "",
    success: false,
}

interface EditUserDialogProps {
    user: User
}

export function EditUserDialog({ user }: EditUserDialogProps) {
    const [open, setOpen] = useState(false)
    const [state, formAction, isPending] = useActionState(updateUser, initialState)

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast.success(state.message)
                setOpen(false)
            } else {
                toast.error(state.message)
            }
        }
    }, [state])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Pencil className="w-4 h-4 mr-2" /> Düzenle
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Kullanıcı Düzenle</DialogTitle>
                </DialogHeader>
                <form action={formAction} className="grid gap-4 py-4">
                    <input type="hidden" name="id" value={user.id} />

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            İsim
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={user.name}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="surname" className="text-right">
                            Soyisim
                        </Label>
                        <Input
                            id="surname"
                            name="surname"
                            defaultValue={user.surname}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Kullanıcı Adı
                        </Label>
                        <Input
                            id="username"
                            name="username"
                            defaultValue={user.username}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Şifre
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Değiştirmek için girin"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Rol
                        </Label>
                        <div className="col-span-3">
                            <Select name="role" defaultValue={user.role}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Rol seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="STUDENT">Öğrenci</SelectItem>
                                    <SelectItem value="TEACHER">Öğretmen</SelectItem>
                                    <SelectItem value="ADMIN">Yönetici</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Güncelleniyor..." : "Güncelle"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
