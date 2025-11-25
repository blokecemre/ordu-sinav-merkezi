"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { registerUser } from "@/app/actions/register"
import { Loader2, UserPlus } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [selectedRole, setSelectedRole] = useState<"STUDENT" | "TEACHER">("STUDENT")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        formData.set("role", selectedRole)

        try {
            const result = await registerUser(formData)

            if (result.success) {
                setSuccess(result.message)
                setTimeout(() => {
                    router.push("/login")
                }, 2000)
            } else {
                setError(result.message)
            }
        } catch (err) {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                            <UserPlus className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">Üye Ol</CardTitle>
                    <CardDescription className="text-center">
                        Sınav Merkezi'ne hoş geldiniz
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {success && (
                            <Alert className="bg-green-50 text-green-900 border-green-200">
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}

                        {/* Role Selection */}
                        <div className="space-y-2">
                            <Label>Kullanıcı Tipi</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setSelectedRole("STUDENT")}
                                    className={`p-4 rounded-lg border-2 transition-all ${selectedRole === "STUDENT"
                                            ? "border-blue-600 bg-blue-50 text-blue-900"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                >
                                    <div className="font-semibold">Öğrenci</div>
                                    <div className="text-xs text-gray-500">Sınav sonuçlarını görüntüle</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedRole("TEACHER")}
                                    className={`p-4 rounded-lg border-2 transition-all ${selectedRole === "TEACHER"
                                            ? "border-blue-600 bg-blue-50 text-blue-900"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                >
                                    <div className="font-semibold">Öğretmen</div>
                                    <div className="text-xs text-gray-500">Öğrencileri takip et</div>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Ad</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Adınız"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="surname">Soyad</Label>
                            <Input
                                id="surname"
                                name="surname"
                                type="text"
                                placeholder="Soyadınız"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username">Kullanıcı Adı</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="kullaniciadi"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Şifre</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Üye Ol
                        </Button>

                        <div className="text-center text-sm text-gray-600">
                            Zaten hesabınız var mı?{" "}
                            <Link href="/login" className="text-blue-600 hover:underline font-medium">
                                Giriş Yap
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
