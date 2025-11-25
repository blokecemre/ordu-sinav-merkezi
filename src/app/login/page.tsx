"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const result = await signIn("credentials", {
                username,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError("Kullanıcı adı veya şifre hatalı.")
            } else {
                router.push("/dashboard") // Redirect to dashboard after login
                router.refresh()
            }
        } catch (err) {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Giriş Yap</CardTitle>
                    <CardDescription className="text-center">
                        Ordu Sınav Merkezi hesabınıza giriş yapın
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="username">Kullanıcı Adı</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="kullaniciadi"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Şifre</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Giriş Yap
                        </Button>

                        <div className="text-center text-sm text-gray-600">
                            Hesabınız yok mu?{" "}
                            <Link href="/register" className="text-blue-600 hover:underline font-medium">
                                Üye Ol
                            </Link>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-gray-500">
                    Hesabınız yoksa yöneticinizle iletişime geçin.
                </CardFooter>
            </Card>
        </div>
    )
}
