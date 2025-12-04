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
    const [mode, setMode] = useState<"login" | "register">("login")
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

    const handleRegisterRedirect = () => {
        router.push("/register")
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-foreground">
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

                        {/* Segmented Buttons */}
                        <div className="flex h-12 w-full items-center justify-center rounded-xl bg-[#282e39] p-1.5 mb-8">
                            <button
                                onClick={() => setMode("login")}
                                className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-all ${mode === "login" ? "bg-primary-new shadow-lg text-white" : "text-[#9da6b9] hover:text-white"}`}
                            >
                                <span className="truncate">Giriş Yap</span>
                            </button>
                            <button
                                onClick={() => setMode("register")}
                                className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-all ${mode === "register" ? "bg-primary-new shadow-lg text-white" : "text-[#9da6b9] hover:text-white"}`}
                            >
                                <span className="truncate">Kayıt Ol</span>
                            </button>
                        </div>

                        {mode === "login" ? (
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
                                <a className="text-[#9da6b9] text-sm font-normal leading-normal text-right underline hover:text-primary-new transition-colors" href="#">Şifremi Unuttum?</a>

                                {/* Primary Action Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary-new text-white text-base font-bold leading-normal tracking-[0.015em] mt-6 hover:bg-primary-new/90 transition-colors shadow-lg shadow-primary-new/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <span className="truncate">Giriş Yap</span>}
                                </button>
                            </form>
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-6 text-center py-8">
                                <p className="text-gray-300">
                                    Yeni bir hesap oluşturmak için kayıt sayfasına yönlendirileceksiniz.
                                </p>
                                <button
                                    onClick={handleRegisterRedirect}
                                    className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary-new text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary-new/90 transition-colors shadow-lg shadow-primary-new/30"
                                >
                                    Kayıt Formuna Git
                                </button>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="flex items-center my-8">
                            <hr className="flex-grow border-t border-[#3b4354]" />
                            <span className="px-4 text-sm text-[#9da6b9]">veya</span>
                            <hr className="flex-grow border-t border-[#3b4354]" />
                        </div>

                        {/* Social Login Buttons */}
                        <div className="flex flex-col gap-4">
                            <button
                                type="button"
                                onClick={() => toast.info("Google ile giriş yakında aktif olacak.")}
                                className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#3b4354] bg-[#1c1f27] px-4 py-3 text-white transition-colors hover:bg-[#282e39]"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_3031_103)"><path d="M21.9999 12.2452C21.9999 11.4595 21.9304 10.6977 21.7964 9.96364H12.2222V14.2205H17.7954C17.5754 15.6582 16.8927 16.9241 15.8277 17.7559V20.5082H19.4999C21.1454 18.9832 21.9999 16.8118 21.9999 14.1273C21.9999 13.5227 21.9568 12.8918 21.8795 12.2764" fill="#4285F4"></path><path d="M12.2222 22C14.9909 22 17.3454 21.0945 19.5 19.4218L15.8273 16.6695C14.9318 17.2582 13.6818 17.6727 12.2222 17.6727C9.64545 17.6727 7.45909 15.9909 6.65454 13.7227H2.86363V16.55C4.01818 19.8682 7.79545 22 12.2222 22Z" fill="#34A853"></path><path d="M6.65455 13.7227C6.44091 13.1182 6.32273 12.4718 6.32273 11.7955C6.32273 11.1191 6.44091 10.4727 6.65455 9.86818V7.04091H2.86364C2.31818 8.17636 2 9.44227 2 10.7955C2 12.1486 2.31818 13.4145 2.86364 14.55L6.65455 13.7227Z" fill="#FBBC05"></path><path d="M12.2222 5.91818C13.7818 5.91818 15.1091 6.47273 16.1954 7.48182L19.5727 4.10455C17.3454 2.09091 14.9909 1 12.2222 1C7.79545 1 4.01818 3.13182 2.86364 6.45L6.65454 9.27727C7.45909 6.99091 9.64545 5.91818 12.2222 5.91818Z" fill="#EA4335"></path></g><defs><clipPath id="clip0_3031_103"><rect fill="white" height="20" transform="translate(2 2)" width="20"></rect></clipPath></defs></svg>
                                <span className="text-sm font-medium">Google ile Devam Et</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
