import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart2, ArrowLeft, Mail, Phone, MapPin } from "lucide-react"

export default function IletisimPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="border-b bg-white">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <BarChart2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-gray-900">Ordu Sınav Merkezi</span>
                    </Link>
                    <Link href="/">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Ana Sayfa
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 bg-gray-50">
                <div className="container mx-auto px-4 py-12">
                    {/* Hero */}
                    <div className="text-center mb-12">
                        <Mail className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">İletişim</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Bize ulaşın, sorularınızı yanıtlayalım
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                        {/* İletişim Bilgileri */}
                        <div className="bg-white rounded-lg p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">İletişim Bilgileri</h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Adres</h3>
                                        <p className="text-gray-600">
                                            Bahçelievler Mah. Cumhuriyet Cad.<br />
                                            No: 12/4 Altınordu/ORDU
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Telefon</h3>
                                        <p className="text-gray-600">
                                            +90 (452) 123 45 67<br />
                                            +90 (452) 123 45 68
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">E-posta</h3>
                                        <p className="text-gray-600">
                                            info@ordusinavmerkezi.com<br />
                                            destek@ordusinavmerkezi.com
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t">
                                <h3 className="font-semibold text-gray-900 mb-3">Çalışma Saatleri</h3>
                                <div className="space-y-2 text-gray-600">
                                    <p className="flex justify-between">
                                        <span>Pazartesi - Cuma:</span>
                                        <span className="font-medium">09:00 - 18:00</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Cumartesi:</span>
                                        <span className="font-medium">10:00 - 16:00</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Pazar:</span>
                                        <span className="font-medium text-red-600">Kapalı</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* İletişim Formu */}
                        <div className="bg-white rounded-lg p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Bize Yazın</h2>

                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Ad Soyad
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                        placeholder="Adınız ve soyadınız"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        E-posta
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                        placeholder="ornek@email.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Telefon
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                        placeholder="(5XX) XXX XX XX"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                        Mesajınız
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                        placeholder="Mesajınızı buraya yazın..."
                                    />
                                </div>

                                <Button type="submit" className="w-full">
                                    Gönder
                                </Button>
                            </form>

                            <p className="text-sm text-gray-500 mt-4 text-center">
                                * Form şu anda demo amaçlıdır
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-400 text-sm">
                        © 2024 Ordu Sınav Merkezi. Tüm hakları saklıdır.
                    </p>
                </div>
            </footer>
        </div>
    )
}
