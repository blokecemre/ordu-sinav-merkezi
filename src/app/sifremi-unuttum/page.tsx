"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react"
import { requestPasswordReset, resetPassword } from "@/app/actions/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

export default function ForgotPasswordPage() {
    const router = useRouter()

    // Form States
    const [phone, setPhone] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [code, setCode] = useState("")

    // UI States
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState<"REQUEST" | "VERIFY">("REQUEST")
    const [cooldown, setCooldown] = useState(0)

    const handleRequestCode = async () => {
        if (!phone) {
            toast.error("Lütfen telefon numaranızı girin.")
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error("Şifreler eşleşmiyor.")
            return
        }

        // Basic password validation before even sending SMS
        if (newPassword.length < 8) {
            toast.error("Şifre en az 8 karakter olmalıdır.")
            return
        }

        setLoading(true)
        try {
            const result = await requestPasswordReset(phone)

            if (result.success) {
                toast.success(result.message)
                setStep("VERIFY")
                // Start cooldown timer
                setCooldown(180)
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            toast.error("Bir hata oluştu.")
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyAndReset = async () => {
        if (!code || code.length !== 6) {
            toast.error("Lütfen 6 haneli onay kodunu girin.")
            return
        }

        setLoading(true)
        try {
            const result = await resetPassword(phone, code, newPassword)

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
                        Şifremi Unuttum
                    </CardTitle>
                    <p className="text-xs text-blue-500 mt-2">
                        Şifre minimum 8, maksimum 30 karakterden oluşmalıdır<br />
                        En az bir harf ve bir sayı içermelidir.
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
                            disabled={step === "VERIFY"}
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
                                disabled={step === "VERIFY"}
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
                                disabled={step === "VERIFY"}
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

                    {step === "REQUEST" && (
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
                            onClick={handleRequestCode}
                            disabled={loading || !phone || !newPassword}
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Onay Kodu İste
                        </Button>
                    )}

                    {step === "VERIFY" && (
                        <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="space-y-2">
                                <Label htmlFor="code" className="font-semibold">6 haneli onay kodu</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="code"
                                        placeholder="XXXXXX"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="bg-white tracking-widest text-center text-lg"
                                        maxLength={6}
                                    />
                                    {/* Optional: Add Resend Button */}
                                </div>
                            </div>

                            <Button
                                className="w-full bg-green-600 hover:bg-green-700"
                                onClick={handleVerifyAndReset}
                                disabled={loading || code.length !== 6}
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                                Onayla ve Giriş Yap
                            </Button>

                            <button
                                type="button"
                                onClick={() => setStep("REQUEST")}
                                className="text-xs text-muted-foreground w-full text-center hover:underline"
                            >
                                Telefon numarasını veya şifreyi değiştir
                            </button>
                        </div>
                    )}

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
