import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { CountdownHero } from "@/components/CountdownHero"

export default function CounterPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <SiteHeader />
            <main className="flex-1">
                <CountdownHero />
            </main>
            <SiteFooter />
        </div>
    )
}
