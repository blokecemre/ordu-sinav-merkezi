"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Mail, Lock, Eye, EyeOff, School } from "lucide-react"
import { toast } from "sonner"
import { SiteHeader } from "@/components/SiteHeader"

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // Login State
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Since the original login used username, but this design asks for email,
            // we might need to adjust. However, standard NextAuth usually supports either.
            // If the backend expects username, we might need to ask the user to enter username in the email field
            // or update the backend. For now, I'll assume the input can handle username or email.
            // The placeholder says "ornek@eposta.com", so it implies email.
            // But the existing login page used "username".
            // I will pass the value to "username" field of signIn for compatibility.

            const result = await signIn("credentials", {
                username: email, // Mapping email input to username field for backend compatibility
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
        <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark text-foreground">
            <SiteHeader />
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-2">
                {/* Left Pane: Branding & Welcome Message */}
                <div className="relative hidden lg:flex flex-col items-center justify-center p-12 bg-gray-100 dark:bg-background-dark">
                    <div
                        className="absolute inset-0 bg-center bg-no-repeat bg-cover"
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDYOl1HpZhA6h8lVd4VjqakRm5gevrcWMykywxBj3dm7kFFL2SlKP4w3baMpq5cIKQz3Wa56wRLHudjSoXPkyhRynTC-e-028zYHzhFCe7ICN9bf2QhgyAcpbBhuuN1jLr9FuFbg6FEo4A7geJLbAuzDXz4TehkmD6b4gygG4ZQEDQuBw_ZvaZbG4axjEGEgjXp0lPddwgTUrpj5JQoeMwqegtQ1_oB-qA4ZlNd60gIZrZkiV7KRZ6OqbVONcuCq_AnO5PzBG51HmU')" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
                    </div>
                    <div className="relative z-10 flex flex-col items-start w-full max-w-md text-white">
                        <div className="flex items-center gap-3 mb-6">
                            <School className="w-10 h-10 text-primary-new" />
                            <span className="text-2xl font-bold">Ordu Sınav Merkezi</span>
                        </div>
                        <h1 className="text-5xl font-black leading-tight tracking-tighter">
                            Başarıya Giden Yolda İlk Adım
                        </h1>
                        <p className="mt-4 text-lg text-gray-300">
                            Ordu Sınav Merkezi'ne hoş geldiniz. Hesabınıza giriş yapın veya yeni bir hesap oluşturarak yolculuğunuza başlayın.
                        </p>
                    </div>
                </div>

                {/* Right Pane: Login/Registration Form */}
                <div className="flex flex-col items-center justify-center w-full p-4 sm:p-8 bg-background-dark">
                    <div className="w-full max-w-md mx-auto">
                        <div className="lg:hidden flex items-center gap-3 mb-8 text-white">
                            <School className="w-8 h-8 text-primary-new" />
                            <span className="text-xl font-bold">Ordu Sınav Merkezi</span>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">Giriş Yap</h2>
                            <p className="text-gray-400">Hesabınıza erişmek için bilgilerinizi girin.</p>
                        </div>

                        <form onSubmit={handleLogin} className="flex flex-col gap-4">
                            {/* Email Field */}
                            <label className="flex flex-col w-full">
                                <p className="text-white text-sm font-medium leading-normal pb-2">Kullanıcı Adı / E-posta</p>
                                <div className="flex w-full flex-1 items-stretch rounded-lg">
                                    <span className="text-[#9da6b9] flex border border-[#3b4354] bg-[#1c1f27] items-center justify-center pl-[15px] rounded-l-lg border-r-0">
                                        <Mail className="w-5 h-5" />
                                    </span>
                                    <input
                                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary-new/50 border border-[#3b4354] bg-[#1c1f27] focus:border-primary-new h-14 placeholder:text-[#9da6b9] p-[15px] rounded-l-none border-l-0 text-base font-normal leading-normal"
                                        placeholder="Kullanıcı adınız veya e-postanız"
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </label>

                            {/* Password Field */}
                            <label className="flex flex-col w-full">
                                <p className="text-white text-sm font-medium leading-normal pb-2">Şifre</p>
                                <div className="flex w-full flex-1 items-stretch rounded-lg">
                                    <span className="text-[#9da6b9] flex border border-[#3b4354] bg-[#1c1f27] items-center justify-center pl-[15px] rounded-l-lg border-r-0">
                                        <Lock className="w-5 h-5" />
                                    </span>
                                    <input
                                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary-new/50 border border-[#3b4354] bg-[#1c1f27] focus:border-primary-new h-14 placeholder:text-[#9da6b9] p-[15px] rounded-r-none border-l-0 text-base font-normal leading-normal pr-12"
                                        placeholder="Şifrenizi girin"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-[#9da6b9] flex border border-[#3b4354] bg-[#1c1f27] items-center justify-center pr-[15px] rounded-r-lg border-l-0 -ml-10 z-10"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </label>
                            <a className="text-[#9da6b9] text-sm font-normal leading-normal text-right underline hover:text-primary-new transition-colors" href="/sifremi-unuttum">Şifremi Unuttum?</a>

                            {/* Primary Action Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary-new text-white text-base font-bold leading-normal tracking-[0.015em] mt-6 hover:bg-primary-new/90 transition-colors shadow-lg shadow-primary-new/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <span className="truncate">Giriş Yap</span>}
                            </button>
                        </form>

                        <div className="text-center text-sm text-gray-600 mt-8">
                            Hesabınız yok mu?{" "}
                            <Link href="/register" className="text-blue-500 hover:underline font-medium">
                                Üye Ol
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
