"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    Users,
    BookOpen,
    FileText,
    Settings,
    Package, // Added as per instruction
    Image as ImageIcon,
    LogOut,
    Menu,
    X,
    TrendingUp,
    BarChart2, // Added by user instruction
    UserPlus, // Added by user instruction
    Calendar // Added for Study Plan
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

    // Role based navigation items could be defined here
    const navItems = [
        { href: "/dashboard", label: "Genel Bakış", icon: LayoutDashboard },
        // Admin items
        ...(session?.user?.role === "ADMIN" ? [
            { href: "/dashboard/admin/users", label: "Kullanıcılar", icon: Users }, // Kept original Users item
            { href: "/dashboard/admin/exams", label: "Sınavlar", icon: FileText },
            { href: "/dashboard/admin/analyses", label: "Analiz", icon: TrendingUp }, // Added Analiz for Admin
            { href: "/dashboard/admin/assignments", label: "Atamalar", icon: Users }, // Added Atamalar for Admin
            { href: "/dashboard/admin/answer-keys", label: "Cevap Anahtarları", icon: FileText }, // Added Answer Keys for Admin
            { href: "/dashboard/admin/blog", label: "Blog", icon: BookOpen }, // Added Blog for Admin
            { href: "/dashboard/admin/study-plan", label: "Ders Programı", icon: Calendar },
        ] : []),
        // Teacher items
        ...(session?.user?.role === "TEACHER" ? [
            { href: "/dashboard/teacher/students", label: "Öğrencilerim", icon: Users },
            { href: "/dashboard/teacher/analysis", label: "Analiz", icon: BookOpen },
        ] : []),
        // Student items
        ...(session?.user?.role === "STUDENT" ? [
            { href: "/dashboard/student/analyses", label: "Analizler", icon: BookOpen },
            { href: "/dashboard/student/analysis", label: "Gelişim Grafiği", icon: TrendingUp },
            { href: "/dashboard/student/study-plan", label: "Çalışma Planı", icon: Calendar },
            { href: "/dashboard/student/mistakes", label: "Yanlış Soru Defteri", icon: ImageIcon },
        ] : []),
    ]

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
                <div className="h-16 flex items-center justify-between px-6 border-b">
                    <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                        Sınav Merkezi
                    </Link>
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="flex flex-col h-[calc(100vh-4rem)]">
                    <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href

                            return (
                                <Link key={item.href} href={item.href} onClick={() => setIsSidebarOpen(false)}>
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        className={`w-full justify-start ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}
                                    >
                                        <Icon className="mr-2 w-5 h-5" />
                                        {item.label}
                                    </Button>
                                </Link>
                            )
                        })}
                        {session?.user?.role === "ADMIN" && (
                            <>
                                <Link href="/dashboard/admin/settings" onClick={() => setIsSidebarOpen(false)}>
                                    <Button
                                        variant={pathname === "/dashboard/admin/settings" ? "secondary" : "ghost"}
                                        className={`w-full justify-start ${pathname === "/dashboard/admin/settings" ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}
                                    >
                                        <Settings className="mr-2 w-5 h-5" />
                                        Ayarlar
                                    </Button>
                                </Link>
                                <Link href="/dashboard/admin/packages" onClick={() => setIsSidebarOpen(false)}>
                                    <Button
                                        variant={pathname === "/dashboard/admin/packages" ? "secondary" : "ghost"}
                                        className={`w-full justify-start ${pathname === "/dashboard/admin/packages" ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}
                                    >
                                        <Package className="mr-2 w-5 h-5" />
                                        Paketler
                                    </Button>
                                </Link>
                                <Link href="/dashboard/admin/slider" onClick={() => setIsSidebarOpen(false)}>
                                    <Button
                                        variant={pathname === "/dashboard/admin/slider" ? "secondary" : "ghost"}
                                        className={`w-full justify-start ${pathname === "/dashboard/admin/slider" ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}
                                    >
                                        <ImageIcon className="mr-2 w-5 h-5" />
                                        Slider
                                    </Button>
                                </Link>
                                <Link href="/dashboard/admin/partners" onClick={() => setIsSidebarOpen(false)}>
                                    <Button
                                        variant={pathname === "/dashboard/admin/partners" ? "secondary" : "ghost"}
                                        className={`w-full justify-start ${pathname === "/dashboard/admin/partners" ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}
                                    >
                                        <Users className="mr-2 w-5 h-5" />
                                        Partnerler
                                    </Button>
                                </Link>
                                <Link href="/dashboard/admin/mistakes" onClick={() => setIsSidebarOpen(false)}>
                                    <Button
                                        variant={pathname.startsWith("/dashboard/admin/mistakes") ? "secondary" : "ghost"}
                                        className={`w-full justify-start ${pathname.startsWith("/dashboard/admin/mistakes") ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}
                                    >
                                        <ImageIcon className="mr-2 w-5 h-5" />
                                        Yanlış Soru Defteri
                                    </Button>
                                </Link>
                            </>
                        )}
                    </nav>

                    <div className="p-4 border-t bg-white">
                        <div className="px-4 py-2 mb-2">
                            <p className="text-sm font-medium text-gray-900">{session?.user?.name || "Kullanıcı"}</p>
                            <p className="text-xs text-gray-500 capitalize">{session?.user?.role?.toLowerCase() || "Rol"}</p>
                        </div>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => signOut({ callbackUrl: "/login" })}
                        >
                            <LogOut className="mr-2 w-5 h-5" />
                            Çıkış Yap
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
                        <Menu className="w-5 h-5" />
                    </Button>
                    <div className="ml-auto flex items-center gap-4">
                        {/* Header actions can go here */}
                    </div>
                </header>

                <main className="flex-1 p-4 pb-24 md:p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
