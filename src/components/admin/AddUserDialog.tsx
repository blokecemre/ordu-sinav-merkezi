"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import { createUser } from "@/app/actions/user"
import { Plus } from "lucide-react"
import { useFormStatus } from "react-dom"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Ekleniyor..." : "Kullanıcı Ekle"}
        </Button>
    )
}

export function AddUserDialog() {
    const [open, setOpen] = useState(false)
    const [state, setState] = useState<{ message: string; success: boolean } | null>(null)

    async function clientAction(formData: FormData) {
        const result = await createUser(null, formData)
        setState(result)
        if (result.success) {
            setOpen(false)
            // Reset form or state if needed
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Yeni Kullanıcı
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
                    <DialogDescription>
                        Öğrenci, öğretmen veya yönetici ekleyin.
                    </DialogDescription>
                </DialogHeader>
                <form action={clientAction} className="grid gap-4 py-4">
                    {state?.message && !state.success && (
                        <div className="text-red-500 text-sm">{state.message}</div>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            İsim
                        </Label>
                        <Input id="name" name="name" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="surname" className="text-right">
                            Soyisim
                        </Label>
                        <Input id="surname" name="surname" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Kullanıcı Adı
                        </Label>
                        <Input id="username" name="username" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Şifre
                        </Label>
                        <Input id="password" name="password" type="password" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Rol
                        </Label>
                        <div className="col-span-3">
                            <Select name="role" defaultValue="STUDENT" required>
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
                    <DialogFooter>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
