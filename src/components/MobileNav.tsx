"use client"

import Link from "next/link"
import { Home, Menu, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MobileNav() {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    // Hide on desktop
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe">
            <div className="grid grid-cols-2 h-16">
                {/* Home Button */}
                <Link href="/" className={cn(
                    "flex flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors",
                    pathname === "/" && "text-primary"
                )}>
                    <Home className="w-5 h-5" />
                    <span>Anasayfa</span>
                </Link>

                {/* Menu Button (Center) */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <button className="flex flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                            <div className="bg-blue-600 text-white p-3 rounded-full -mt-6 shadow-lg border-4 border-white">
                                <Menu className="w-6 h-6" />
                            </div>
                            <span>Menü</span>
                        </button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[100dvh] rounded-none border-none">
                        <SheetHeader className="mb-6 text-left">
                            <SheetTitle>Navigasyon</SheetTitle>
                        </SheetHeader>
                        <div className="grid gap-2 overflow-y-auto pb-20 h-full">
                            <MobileLink href="/paketler" icon="📦" label="Paketler" setOpen={setOpen} />
                            <MobileLink href="/kurumsal" icon="🏢" label="Kurumsal" setOpen={setOpen} />
                            <MobileLink href="/sinavlar" icon="📝" label="Sınavlar" setOpen={setOpen} />
                            <MobileLink href="/cevap-anahtarlari" icon="🔑" label="Cevap Anahtarları" setOpen={setOpen} />
                            <MobileLink href="/blog" icon="📰" label="Blog" setOpen={setOpen} />
                            <MobileLink href="/hakkimizda" icon="ℹ️" label="Hakkımızda" setOpen={setOpen} />
                            <MobileLink href="/iletisim" icon="📞" label="İletişim" setOpen={setOpen} />

                            <div className="my-4 border-t border-gray-100" />

                            <MobileLink href="/login" icon="👤" label="Giriş Yap" setOpen={setOpen} />
                            <MobileLink href="/register" icon="✨" label="Üye Ol" setOpen={setOpen} />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}

function MobileLink({
    href,
    icon,
    label,
    setOpen
}: {
    href: string
    icon: string
    label: string
    setOpen: (open: boolean) => void
}) {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
        <Link
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
                "flex items-center gap-4 p-4 rounded-xl transition-colors",
                isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50 text-gray-700"
            )}
        >
            <span className="text-xl">{icon}</span>
            <span className="font-medium">{label}</span>
        </Link>
    )
}
