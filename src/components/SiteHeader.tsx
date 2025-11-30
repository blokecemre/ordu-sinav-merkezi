import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                        <BarChart2 className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-xl text-foreground">Ordu Sınav Merkezi</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/paketler" className="text-sm font-medium text-muted-foreground hover:text-foreground">Paketler</Link>
                    <Link href="/kurumsal" className="text-sm font-medium text-muted-foreground hover:text-foreground">Kurumsal</Link>
                    <Link href="/sinavlar" className="text-sm font-medium text-muted-foreground hover:text-foreground">Sınavlar</Link>
                    <Link href="/cevap-anahtarlari" className="text-sm font-medium text-muted-foreground hover:text-foreground">Cevap Anahtarları</Link>
                    <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground">Blog</Link>
                    <Link href="/hakkimizda" className="text-sm font-medium text-muted-foreground hover:text-foreground">Hakkımızda</Link>
                    <Link href="/iletisim" className="text-sm font-medium text-muted-foreground hover:text-foreground">İletişim</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link href="/login">
                        <Button variant="outline">Giriş Yap</Button>
                    </Link>
                    <Link href="/register">
                        <Button>Üye Ol</Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
