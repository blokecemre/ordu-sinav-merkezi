"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart2, User, LayoutDashboard, LogOut } from "lucide-react"
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

export function SiteHeader() {
    const { data: session, status } = useSession()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2 ml-4">
                    <span className="font-extrabold text-2xl text-foreground tracking-tight">Ordu Sınav Merkezi</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/paketler" className="text-sm font-medium text-muted-foreground hover:text-foreground">Paketler</Link>
                    <Link href="/sinavlar" className="text-sm font-medium hover:text-blue-600 transition-colors">Sınavlar</Link>
                    <Link href="/cevap-anahtarlari" className="text-sm font-medium hover:text-blue-600 transition-colors">Cevap Anahtarları</Link>
                    <Link href="/blog" className="text-sm font-medium hover:text-blue-600 transition-colors">Blog</Link>
                    <Link href="/hakkimizda" className="text-sm font-medium text-muted-foreground hover:text-foreground">Hakkımızda</Link>
                    <Link href="/iletisim" className="text-sm font-medium text-muted-foreground hover:text-foreground">İletişim</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <div className="hidden md:flex items-center gap-4">
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
                </div>
            </div>
        </header>
    )
}
