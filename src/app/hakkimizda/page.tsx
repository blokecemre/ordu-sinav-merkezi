import { SiteHeader } from "@/components/SiteHeader"
import { getSystemSetting } from "@/app/actions/settings"
import { Card } from "@/components/ui/card"

// Countdown Component
function CountdownTimer({ targetDate }: { targetDate: string }) {
    if (!targetDate) return null;

    // This is a server component, but for a live countdown we need client-side logic.
    // We'll create a client component wrapper or just inline the client logic here for simplicity if allowed, 
    // but better to separate. Let's make a client component for the timer.
    return <ClientCountdown targetDate={targetDate} />
}

import { ClientCountdown } from "./client-countdown"

export default async function AboutPage() {
    const lgsDateSetting = await getSystemSetting("lgsDate")
    const lgsDate = lgsDateSetting.value

    const partners = [
        { name: "Algoritma Yayınları", logo: "algoritma" },
        { name: "Özdebir Yayınları", logo: "ozdebir" },
        { name: "Töder Yayınları", logo: "toder" },
        { name: "Fenomen Yayınları", logo: "fenomen" },
        { name: "Ankara Yayıncılık", logo: "ankara" },
        { name: "Sinan Kuzucu Yayınları", logo: "sinan-kuzucu" },
        { name: "Nartest Yayınları", logo: "nartest" },
        { name: "Aydın Yayınları", logo: "aydin" },
        { name: "Mozaik Yayınları", logo: "mozaik" },
        { name: "Okyanus Yayınları", logo: "okyanus" },
        { name: "Palme Yayınevi", logo: "palme" },
        { name: "3D Yayınları", logo: "3d" },
        { name: "Paraf Yayınları", logo: "paraf" },
        { name: "Muba Yayınları", logo: "muba" },
        { name: "Miray Yayınları", logo: "miray" },
        { name: "Günay Yayınları", logo: "gunay" },
        { name: "Karekök Yayınları", logo: "karekok" },
        { name: "Newton Yayınları", logo: "newton" },
        { name: "Omage Yayınları", logo: "omage" },
        { name: "Türkiye Özel Okullar Derneği", logo: "tozok" },
        { name: "Ulti Yayınları", logo: "ulti" },
        { name: "Yanıt Yayınları", logo: "yanit" },
        { name: "Kafadengi Yayınları", logo: "kafadengi" },
        { name: "Üçdörtbeş Yayınları", logo: "ucdortbes" },
        { name: "Sonuç Yayınları", logo: "sonuc" },
        { name: "İsem Yayıncılık", logo: "isem" },
        { name: "Ünlüler Karması Yayınları", logo: "unluler-karmasi" },
        { name: "Hız Yayınları", logo: "hiz" },
        { name: "Eksen Yayınları", logo: "eksen" },
        { name: "Retro Yayıncılık", logo: "retro" },
        { name: "Beyin Takımı Yayınları", logo: "beyin-takimi" },
        { name: "Av Yayınları", logo: "av" },
        { name: "Nitelik Yayınları", logo: "nitelik" },
        { name: "Çalışkan Yayınları", logo: "caliskan" },
    ]

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
                            <p className="text-gray-500">Sınav tarihi henüz belirlenmedi.</p>
                        )}
                    </div>
                </section>

                {/* Partners Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-light text-center text-gray-700 mb-16">
                            Birlikte Çalıştığımız Yayınlar
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12">
                            {partners.map((partner, index) => (
                                <div key={index} className="flex flex-col items-center justify-center group">
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center p-4 mb-4 group-hover:shadow-md transition-shadow relative overflow-hidden">
                                        {/* Since we don't have actual logos, we'll use text placeholders styled to look like logos */}
                                        <div className="text-center text-xs font-bold text-gray-400">
                                            {partner.name.split(" ")[0]}
                                        </div>
                                    </div>
                                    <span className="text-[10px] md:text-xs font-bold text-blue-500 text-center uppercase tracking-wide">
                                        {partner.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
