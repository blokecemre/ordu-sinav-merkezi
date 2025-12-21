import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { CountdownTimer } from "@/components/CountdownTimer"
import { Partners } from "@/components/Partners"
import { getSettings } from "@/app/actions/settings"
import { getPartners } from "@/app/actions/partner"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function HakkimizdaPage() {
    const settingsResult = await getSettings()
    const settings = settingsResult.success && settingsResult.data ? settingsResult.data : {}

    const partnersResult = await getPartners()
    const partners = partnersResult.success ? partnersResult.data : []

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <SiteHeader />

            <main className="flex-1 pt-20">
                {/* Countdown Section */}
                <CountdownTimer
                    lgsDate={settings.lgsDate}
                    tytDate={settings.tytDate}
                    aytDate={settings.aytDate}
                />

                {/* Partners Section */}
                <Partners partners={partners || []} />
            </main>

            <SiteFooter />
        </div>
    )
}
