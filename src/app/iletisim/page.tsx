import { SiteHeader } from "@/components/SiteHeader"
import { Card } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { getSettings } from "@/app/actions/settings"

export default async function ContactPage() {
    const settingsResult = await getSettings()
    const settings = settingsResult.success ? settingsResult.data : {}

    return (
        <div className="min-h-screen relative overflow-hidden bg-background">
            {/* Gradient Background */}
            <div className="absolute inset-0 hero-gradient opacity-90" />

            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-40 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <SiteHeader />

                <main className="flex-1 container mx-auto px-4 py-12 flex flex-col justify-center">
                    <div className="max-w-6xl mx-auto space-y-12 w-full">
                        {/* Hero Header */}
                        <div className="text-center space-y-6 animate-fade-in-up">
                            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-md">
                                İletişim
                            </h1>
                            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-sm">
                                Sorularınız için bize ulaşın veya kurumumuzu ziyaret edin.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                            {/* Contact Info */}
                            <div className="space-y-6">
                                <Card className="p-8 space-y-8 glass-card border-white/20 bg-white/10 backdrop-blur-md shadow-2xl">
                                    <div className="flex items-start gap-5 group transition-transform duration-300 hover:translate-x-2">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-inner group-hover:bg-white/30 transition-colors">
                                            <MapPin className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-xl mb-1 text-white">Adres</h3>
                                            <p className="text-white/80 leading-relaxed">
                                                {settings?.address || "Adres bilgisi girilmemiş."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-5 group transition-transform duration-300 hover:translate-x-2">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-inner group-hover:bg-white/30 transition-colors">
                                            <Phone className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-xl mb-1 text-white">Telefon</h3>
                                            <p className="text-white/80">
                                                {settings?.phone ? (
                                                    <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors underline decoration-white/30 hover:decoration-white">
                                                        {settings.phone}
                                                    </a>
                                                ) : "Telefon bilgisi girilmemiş."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-5 group transition-transform duration-300 hover:translate-x-2">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-inner group-hover:bg-white/30 transition-colors">
                                            <Mail className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-xl mb-1 text-white">E-posta</h3>
                                            <p className="text-white/80">
                                                {settings?.email ? (
                                                    <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors underline decoration-white/30 hover:decoration-white">
                                                        {settings.email}
                                                    </a>
                                                ) : "E-posta bilgisi girilmemiş."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-5 group transition-transform duration-300 hover:translate-x-2">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-inner group-hover:bg-white/30 transition-colors">
                                            <Clock className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-xl mb-1 text-white">Çalışma Saatleri</h3>
                                            <p className="text-white/80 leading-relaxed">
                                                Pazartesi - Cumartesi: 09:00 - 19:00<br />
                                                Pazar: Kapalı
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Map */}
                            <div className="h-[500px] w-full bg-white/5 rounded-3xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-sm relative group">
                                <div className="absolute inset-0 z-0 bg-muted/20 animate-pulse" />
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.578676234378!2d37.87846537654354!3d40.98813897135316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40643c6666666667%3A0x6666666666666666!2sOrdu!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="relative z-10 opacity-90 group-hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
