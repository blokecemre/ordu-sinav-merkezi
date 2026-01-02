"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart2, User, LayoutDashboard, LogOut, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSession, signOut } from "next-auth/react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function MobileMenuOverlay({ isOpen, onClose, session }: { isOpen: boolean; onClose: () => void; session: any }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted || !isOpen) return null

    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-[#0088cc] text-white flex flex-col md:hidden" style={{ minHeight: '100vh', height: '100%' }}>
            <div className="flex items-center justify-between p-4 border-b border-white/20">
                <div className="flex items-center gap-2">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="h-8 w-auto object-contain brightness-0 invert"
                    />
                    <span className="font-extrabold text-2xl tracking-tight text-white">Ordu Sınav Merkezi</span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 hover:text-white"
                    onClick={onClose}
                >
                    <X className="w-6 h-6" />
                </Button>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                <Link
                    href="/paketler"
                    className="p-4 text-lg font-medium text-white hover:bg-white/10 rounded-lg transition-colors"
                    onClick={onClose}
                >
                    Paketler
                </Link>
                <Link
                    href="/sinavlar"
                    className="p-4 text-lg font-medium text-white hover:bg-white/10 rounded-lg transition-colors"
                    onClick={onClose}
                >
                    Sınavlar
                </Link>
                <Link
                    href="/cevap-anahtarlari"
                    className="p-4 text-lg font-medium text-white hover:bg-white/10 rounded-lg transition-colors"
                    onClick={onClose}
                >
                    Cevap Anahtarları
                </Link>
                <Link
                    href="/blog"
                    className="p-4 text-lg font-medium text-white hover:bg-white/10 rounded-lg transition-colors"
                    onClick={onClose}
                >
                    Blog
                </Link>

                <Link
                    href="/iletisim"
                    className="p-4 text-lg font-medium text-white hover:bg-white/10 rounded-lg transition-colors"
                    onClick={onClose}
                >
                    İletişim
                </Link>

                <div className="mt-8 flex gap-4 px-2">
                    {session ? (
                        <Link href="/dashboard" className="flex-1" onClick={onClose}>
                            <Button className="w-full bg-white text-[#0088cc] hover:bg-white/90">
                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                Panel
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="flex-1" onClick={onClose}>
                                <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-[#0088cc] bg-transparent">
                                    Giriş Yap
                                </Button>
                            </Link>
                            <Link href="/register" className="flex-1" onClick={onClose}>
                                <Button className="w-full bg-white text-[#0088cc] hover:bg-white/90">
                                    Üye Ol
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </div>,
        document.body
    )
}

export function SiteHeader() {
    const { data: session, status } = useSession()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 ml-4">
                        <img
                            src="/logo.png"
                            alt="Ordu Sınav Merkezi Logo"
                            className="h-12 w-auto object-contain"
                        />
                        <span className="font-extrabold text-xl text-foreground tracking-tight hidden sm:inline-block">Ordu Sınav Merkezi</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/paketler" className="text-sm font-medium text-muted-foreground hover:text-foreground">Paketler</Link>
                        <Link href="/sinavlar" className="text-sm font-medium hover:text-blue-600 transition-colors">Sınavlar</Link>
                        <Link href="/cevap-anahtarlari" className="text-sm font-medium hover:text-blue-600 transition-colors">Cevap Anahtarları</Link>
                        <Link href="/blog" className="text-sm font-medium hover:text-blue-600 transition-colors">Blog</Link>

                        <Link href="/iletisim" className="text-sm font-medium text-muted-foreground hover:text-foreground">İletişim</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-4">
                            <ThemeToggle />
                            {status === "loading" ? (
                                <div className="w-20 h-9 bg-muted animate-pulse rounded-md" />
                            ) : session ? (
                                <div className="flex items-center gap-2">
                                    <Link href="/dashboard">
                                        <Button variant="ghost" className="gap-2">
                                            <LayoutDashboard className="w-4 h-4" />
                                            Panel
                                        </Button>
                                    </Link>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="rounded-full">
                                                <User className="w-5 h-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                                                    <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard" className="cursor-pointer">
                                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                                    <span>Panel</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-red-600 cursor-pointer focus:text-red-600"
                                                onClick={() => signOut({ callbackUrl: "/" })}
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Çıkış Yap</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="outline">Giriş Yap</Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button>Üye Ol</Button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button - Visible only on mobile */}
                        <div className="flex md:hidden items-center gap-2">
                            <ThemeToggle />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-primary"
                                onClick={() => setIsMobileMenuOpen(true)}
                            >
                                <Menu className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay - Rendered via Portal outside header */}
            <MobileMenuOverlay
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                session={session}
            />
        </>
    )
}

