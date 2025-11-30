import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart2 } from "lucide-react"

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <BarChart2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl text-gray-900">Ordu Sınav Merkezi</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/kurumsal" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Kurumsal</Link>
                    <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Blog</Link>
                    <Link href="/cevap-anahtarlari" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Cevap Anahtarları</Link>
                    <Link href="/sinavlar" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Sınavlar</Link>
                    <Link href="/iletisim" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">İletişim</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/register">
                        <Button variant="outline">Üye Ol</Button>
                    </Link>
                    <Link href="/login">
                        <Button>Giriş Yap</Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
