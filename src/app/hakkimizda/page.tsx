import { SiteHeader } from "@/components/SiteHeader"
import { getSettings } from "@/app/actions/settings"
import { getPartners } from "@/app/actions/partner"
import { Card } from "@/components/ui/card"
import { ClientCountdown } from "./client-countdown"

// Countdown Component
function CountdownTimer({ targetDate }: { targetDate: string }) {
    if (!targetDate) return null;
    return <ClientCountdown targetDate={targetDate} />
}

export default async function AboutPage() {
    const settingsResult = await getSettings()
    const lgsDate = settingsResult.success && settingsResult.data ? settingsResult.data.lgsDate : null

    const partnersResult = await getPartners()
    const partners = partnersResult.success ? partnersResult.data : []

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <SiteHeader />

            <main className="flex-1">
                {/* Countdown Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 text-center">
                        {lgsDate ? (
                            <>
                                <h2 className="text-xl md:text-2xl text-red-400 mb-8 font-light">
                                    {new Date(lgsDate).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })} - {new Date(lgsDate).toLocaleDateString("tr-TR")} tarihinde yapılacak olan LGS Sınavı için geriye
                                </h2>
                                <CountdownTimer targetDate={lgsDate} />
                                <p className="text-xl md:text-2xl text-green-500 mt-8 font-light">
                                    Kaldı. Hazır mısın?
                                </p>
                            </>
                        ) : (
                            <div className="text-center space-y-4">
                                <p className="text-gray-500 text-lg">Sınav tarihi henüz belirlenmedi.</p>
                                <p className="text-sm text-gray-400">Yönetici panelinden sınav tarihini ayarlayabilirsiniz.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Partners Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-light text-center text-gray-700 mb-16">
                            Birlikte Çalıştığımız Yayınlar
                        </h2>

                        {partners && partners.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12">
                                {partners.map((partner: any) => (
                                    <div key={partner.id} className="flex flex-col items-center justify-center group">
                                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-4 group-hover:shadow-md transition-shadow overflow-hidden">
                                            <img
                                                src={`/api/partner/${partner.id}/logo`}
                                                alt={partner.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="text-[10px] md:text-xs font-bold text-blue-500 text-center uppercase tracking-wide">
                                            {partner.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">Henüz yayıncı eklenmemiş.</p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    )
}
