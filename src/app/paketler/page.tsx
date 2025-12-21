import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { getPackages } from "@/app/actions/package"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Target, MessageSquare, Zap, CheckCircle2 } from "lucide-react"
import Link from "next/link"

// Predefined styles for the cycle
const STYLE_CYCLE = [
    {
        theme: 'blue',
        gradient: "from-blue-600 via-blue-500 to-cyan-400",
        icon: Target,
        glowColor: "blue"
    },
    {
        theme: 'purple',
        gradient: "from-fuchsia-600 via-purple-500 to-pink-400",
        icon: MessageSquare,
        glowColor: "purple"
    },
    {
        theme: 'orange',
        gradient: "from-amber-500 via-orange-500 to-red-400",
        icon: Zap,
        glowColor: "orange"
    }
]

export default async function PackagesPage() {
    const result = await getPackages()
    const packages = result.success ? result.data : []

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SiteHeader />

            {/* Packages Section */}
            <main className="flex-1 pt-28 pb-16 md:pt-32 md:pb-24">
                <div className="container mx-auto px-4">
                    <div className="space-y-6 max-w-5xl mx-auto">
                        {packages && packages.length > 0 ? (
                            packages.map((pkg: any, index: number) => {
                                // Find style based on stored theme (default to blue if not found)
                                const theme = pkg.theme || 'blue'
                                const style = STYLE_CYCLE.find(s => s.theme === theme) || STYLE_CYCLE[0]
                                const IconComponent = style.icon

                                // Parse description into features
                                // Assuming description is plain text, split by newlines
                                const features = pkg.description ? pkg.description.split('\n').filter((line: string) => line.trim().length > 0) : []

                                return (
                                    <div
                                        key={pkg.id}
                                        className="group animate-in fade-in slide-in-from-bottom-4 duration-700"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-lg transition-shadow duration-300">
                                            <div className="flex flex-col md:flex-row min-h-[300px]">
                                                {/* Left: Package Header */}
                                                <div className={`md:w-64 lg:w-72 p-8 bg-gradient-to-br ${style.gradient} flex flex-col justify-center items-center text-center relative overflow-hidden`}>
                                                    {/* Background Pattern */}
                                                    <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

                                                    <div className="w-16 h-16 mb-6 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/10">
                                                        <IconComponent className="w-8 h-8 text-white" />
                                                    </div>

                                                    <h2 className="text-xl font-bold text-white tracking-tight mb-2 uppercase drop-shadow-sm">
                                                        {pkg.title}
                                                    </h2>
                                                    {/* Optional: Add a subtle badge or ID if needed, or subtitle if we had one */}
                                                    <div className="w-12 h-1 bg-white/30 rounded-full mt-4" />
                                                </div>

                                                {/* Right: Features */}
                                                <div className="flex-1 p-6 md:p-8 flex flex-col">
                                                    <div className="space-y-4 flex-1">
                                                        {features.map((line: string, i: number) => {
                                                            // Check if line has a colon for bold title
                                                            const hasColon = line.includes(':')
                                                            let title = ''
                                                            let desc = line

                                                            if (hasColon) {
                                                                const parts = line.split(':')
                                                                title = parts[0]
                                                                desc = parts.slice(1).join(':')
                                                            }

                                                            return (
                                                                <div key={i} className="flex items-start gap-3">
                                                                    <div className={`mt-1 p-1 rounded-full bg-${style.theme}-100 flex-shrink-0`}>
                                                                        <CheckCircle2 className={`w-4 h-4 text-${style.theme}-600`} style={{ color: style.theme === 'orange' ? '#f97316' : style.theme === 'purple' ? '#a855f7' : '#2563eb' }} />
                                                                    </div>
                                                                    <div className="text-sm leading-relaxed">
                                                                        {hasColon ? (
                                                                            <>
                                                                                <span className="font-bold text-foreground block md:inline md:mr-1">{title}:</span>
                                                                                <span className="text-muted-foreground">{desc}</span>
                                                                            </>
                                                                        ) : (
                                                                            <span className="text-muted-foreground">{line}</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>

                                                    {/* CTA */}
                                                    <div className="mt-8 flex justify-center md:justify-end pt-6 border-t border-border/50">
                                                        <Link href="/register">
                                                            <Button
                                                                className={`h-11 px-8 text-sm font-bold rounded-lg bg-gradient-to-r ${style.gradient} text-white hover:opacity-90 transition-all hover:scale-105 shadow-md`}
                                                            >
                                                                <ShoppingCart className="w-4 h-4 mr-2" />
                                                                Ön Kayıt
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-muted-foreground/20">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground">Henüz Paket Bulunmuyor</h3>
                                <p className="text-muted-foreground mt-2">Yeni dönem paketlerimiz çok yakında eklenecektir.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <SiteFooter />
        </div>
    )
}
