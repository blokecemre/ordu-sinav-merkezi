"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, Save } from "lucide-react"
import { resetPasswordDirectly } from "@/app/actions/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

export default function ForgotPasswordPage() {
    const router = useRouter()

    // Form States
    const [phone, setPhone] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    // UI States
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDirectReset = async () => {
        if (!phone) {
            toast.error("Lütfen telefon numaranızı girin.")
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error("Şifreler eşleşmiyor.")
            return
        }

        // Basic password validation
        if (newPassword.length < 8) {
            toast.error("Şifre en az 8 karakter olmalıdır.")
            return
        }

        const hasLetter = /[a-zA-Z]/.test(newPassword);
        const hasNumber = /[0-9]/.test(newPassword);

        if (!hasLetter || !hasNumber) {
            toast.error("Şifre en az bir harf ve bir rakam içermelidir.")
            return;
        }

        setLoading(true)
        try {
            const result = await resetPasswordDirectly(phone, newPassword)

            if (result.success) {
                toast.success(result.message)
                // Redirect to login after short delay
                setTimeout(() => {
                    router.push("/login")
                }, 2000)
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            toast.error("Bir hata oluştu.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-0">
                <CardHeader className="space-y-1 text-center pb-2">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        Şifre Sıfırlama
                    </CardTitle>
                    <p className="text-xs text-blue-500 mt-2">
                        Telefon numaranızı girerek yeni şifrenizi belirleyebilirsiniz.<br />
                        Şifre minimum 8, maksimum 30 karakterden oluşmalıdır.
                    </p>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Portala Kayıtlı Telefon Numaranız</Label>
                        <Input
                            id="phone"
                            placeholder="0 (5__) ___ __ __"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="bg-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="new-password">Yeni Şifre</Label>
                        <div className="relative">
                            <Input
                                id="new-password"
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="bg-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Yeni Şifre - Tekrar</Label>
                        <div className="relative">
                            <Input
                                id="confirm-password"
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="bg-white"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-xs text-orange-500 font-medium hover:underline focus:outline-none flex items-center gap-1 mt-1 border border-orange-200 px-2 py-1 rounded"
                            >
                                {showPassword ? "Şifrelerimi Gizle" : "Şifrelerimi Göster"}
                            </button>
                        </div>
                    </div>

                    <Button
                        className="w-full bg-green-600 hover:bg-green-700 mt-4"
                        onClick={handleDirectReset}
                        disabled={loading || !phone || !newPassword || !confirmPassword}
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Şifremi Güncelle
                    </Button>

                    <div className="pt-4 border-t mt-4 text-center">
                        <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900">
                            Giriş ekranına dön
                        </Link>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
