import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { User } from "@prisma/client"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

interface UserDetailDialogProps {
    user: User
}

export function UserDetailDialog({ user }: UserDetailDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-2" /> Detay
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Kullanıcı Detayları: {user.name} {user.surname}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-6 py-4">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-blue-600 border-b pb-1">Temel Bilgiler</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="font-medium">Kullanıcı Adı:</span>
                            <span>{user.username}</span>
                            <span className="font-medium">Rol:</span>
                            <span>{user.role === "ADMIN" ? "Yönetici" : user.role === "TEACHER" ? "Öğretmen" : "Öğrenci"}</span>
                            <span className="font-medium">Kayıt Tarihi:</span>
                            <span>{format(new Date(user.createdAt), "d MMMM yyyy", { locale: tr })}</span>
                        </div>
                    </div>

                    {user.role === "STUDENT" && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-blue-600 border-b pb-1">Öğrenci Bilgileri</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="font-medium">Sınıf:</span>
                                <span>{user.classLevel || "-"}</span>
                                <span className="font-medium">Okul:</span>
                                <span>{user.school || "-"}</span>
                                <span className="font-medium">Seans:</span>
                                <span>{user.session || "-"}</span>
                                <span className="font-medium">Sınav Merkezi:</span>
                                <span>{user.examCenter || "-"}</span>
                            </div>
                        </div>
                    )}

                    {user.role === "STUDENT" && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-purple-600 border-b pb-1">Veli Bilgileri</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="font-medium">Veli Adı:</span>
                                <span>{user.parentName || "-"}</span>
                                <span className="font-medium">Veli Soyadı:</span>
                                <span>{user.parentSurname || "-"}</span>
                                <span className="font-medium">İl:</span>
                                <span>{user.city || "-"}</span>
                                <span className="font-medium">İlçe:</span>
                                <span>{user.district || "-"}</span>
                                <span className="font-medium">Telefon:</span>
                                <span>{user.phone || "-"}</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="font-semibold text-pink-600 border-b pb-1">Diğer Bilgiler</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="font-medium">Referans:</span>
                            <span>{user.referenceSource || "-"}</span>
                            <span className="font-medium">KVKK Onayı:</span>
                            <span>{user.kvkkConsent ? "Onaylandı" : "Onaylanmadı"}</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
