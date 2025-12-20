"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, Eye, EyeOff, GraduationCap, BookOpen, Users, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await signIn("credentials", {
                username: email,
                password,
                redirect: false,
            })

            if (result?.error) {
                toast.error("Giriş başarısız. Bilgilerinizi kontrol edin.")
            } else {
                toast.success("Giriş başarılı!")
                router.push("/dashboard")
                router.refresh()
            }
        } catch (err) {
            toast.error("Bir hata oluştu.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Hero Section */}
            <div className="hidden lg:flex lg:w-1/2 hero-gradient relative overflow-hidden">
                <div className="absolute inset-0 pattern-dots" />

                {/* Floating decorative elements */}
                <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white/10 blur-2xl float" />
                <div className="absolute bottom-40 right-20 w-48 h-48 rounded-full bg-white/10 blur-3xl float-delayed" />

                <div className="relative z-10 flex flex-col justify-center p-12 lg:p-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-12">
                        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                            <GraduationCap className="h-8 w-8 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">
                            Ordu Sınav Merkezi
                        </span>
                    </div>

                    {/* Hero Content */}
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                        Başarıya Giden
                        <br />
                        Yolda İlk Adım
                    </h1>

                    <p className="text-lg text-white/80 mb-12 max-w-md">
                        Ordu Sınav Merkezi&apos;ne hoş geldiniz. Hesabınıza giriş yapın veya yeni bir hesap oluşturarak yolculuğunuza başlayın.
                    </p>

                    {/* Features */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-white/90">
                            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <span>Kapsamlı sınav hazırlık materyalleri</span>
                        </div>
                        <div className="flex items-center gap-4 text-white/90">
                            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                                <Users className="h-5 w-5" />
                            </div>
                            <span>Uzman eğitmenlerden birebir destek</span>
                        </div>
                        <div className="flex items-center gap-4 text-white/90">
                            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <span>Başarıya giden en kısa yol</span>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="mt-12 relative">
                        <div className="absolute -inset-4 bg-white/5 rounded-3xl blur-xl" />
                        <img
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                            alt="Öğrenciler birlikte çalışıyor"
                            className="relative rounded-2xl shadow-2xl w-full max-w-md object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="p-2 rounded-xl bg-primary/10">
                            <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xl font-bold text-foreground">
                            Ordu Sınav Merkezi
                        </span>
                    </div>

                    {/* Form Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-foreground mb-2">
                            Giriş Yap
                        </h2>
                        <p className="text-muted-foreground">
                            Hesabınıza erişmek için bilgilerinizi girin.
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email/Username Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                Kullanıcı Adı / E-posta
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="Kullanıcı adınız veya e-postanız"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-12 h-14 bg-muted/30 border-border/50 focus:border-primary/50 rounded-xl text-foreground placeholder:text-muted-foreground"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                Şifre
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Şifrenizi girin"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-12 pr-12 h-14 bg-muted/30 border-border/50 focus:border-primary/50 rounded-xl text-foreground placeholder:text-muted-foreground"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex justify-end">
                            <Link
                                href="/sifremi-unuttum"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Şifremi Unuttum?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-14 text-lg font-semibold rounded-xl"
                            size="lg"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Giriş Yap"}
                        </Button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-8 text-center">
                        <p className="text-muted-foreground">
                            Hesabınız yok mu?{" "}
                            <Link
                                href="/register"
                                className="text-primary font-semibold hover:underline"
                            >
                                Üye Ol
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
