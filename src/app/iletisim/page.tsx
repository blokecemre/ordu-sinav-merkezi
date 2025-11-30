import { SiteHeader } from "@/components/SiteHeader"
import { Card } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { getSettings } from "@/app/actions/settings"

export default async function ContactPage() {
    const settingsResult = await getSettings()
    const settings = settingsResult.success ? settingsResult.data : {}

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <SiteHeader />

            <main className="flex-1 container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold text-gray-900">İletişim</h1>
                        <p className="text-xl text-gray-600">
                            Sorularınız için bize ulaşın veya kurumumuzu ziyaret edin.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <Card className="p-6 space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Adres</h3>
                                        <p className="text-gray-600">
                                            {settings?.address || "Adres bilgisi girilmemiş."}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Telefon</h3>
                                        <p className="text-gray-600">
                                            {settings?.phone ? (
                                                <a href={`tel:${settings.phone}`} className="hover:text-blue-600 transition-colors">
                                                    {settings.phone}
                                                </a>
                                            ) : "Telefon bilgisi girilmemiş."}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">E-posta</h3>
                                        <p className="text-gray-600">
                                            {settings?.email ? (
                                                <a href={`mailto:${settings.email}`} className="hover:text-blue-600 transition-colors">
                                                    {settings.email}
                                                </a>
                                            ) : "E-posta bilgisi girilmemiş."}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Çalışma Saatleri</h3>
                                        <p className="text-gray-600">
                                            Pazartesi - Cumartesi: 09:00 - 19:00<br />
                                            Pazar: Kapalı
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Map */}
                        <div className="h-[400px] bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.578676234378!2d37.87846537654354!3d40.98813897135316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40643c6666666667%3A0x6666666666666666!2sOrdu!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
