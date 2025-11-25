import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart2, ArrowLeft, FileText, Calendar, BookOpen } from "lucide-react"

export default function SinavlarPage() {
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
                        <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Sınavlar</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Desteklediğimiz sınavlar ve analiz hizmetlerimiz
                        </p>
                    </div>

                    {/* Sınav Türleri */}
                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">TYT</h3>
                            <p className="text-gray-600 mb-4">
                                Temel Yeterlilik Testi için detaylı analiz ve ders bazlı net takibi
                            </p>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Türkçe - Matematik</li>
                                <li>• Fen Bilimleri - Sosyal Bilimler</li>
                                <li>• Soru bazlı çözümleme</li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <BookOpen className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">AYT</h3>
                            <p className="text-gray-600 mb-4">
                                Alan Yeterlilik Testi için branş bazlı detaylı raporlama
                            </p>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Sayısal - Sözel - Eşit Ağırlık</li>
                                <li>• Dil sınavları</li>
                                <li>• Konu bazlı analiz</li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <Calendar className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">LGS</h3>
                            <p className="text-gray-600 mb-4">
                                Liseye Geçiş Sınavı için kapsamlı hazırlık ve takip sistemi
                            </p>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Türkçe - Matematik</li>
                                <li>• Fen - Sosyal - İnkılap - Din</li>
                                <li>• Kazanım bazlı analiz</li>
                            </ul>
                        </div>
                    </div>

                    {/* Hizmetlerimiz */}
                    <div className="bg-white rounded-lg p-8 shadow-sm max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Analiz Hizmetlerimiz</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">📊 Detaylı Sınav Analizi</h3>
                                <p className="text-gray-600 text-sm">
                                    Her sınav sonrası ders bazlı, konu bazlı detaylı analiz raporları
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">📈 Gelişim Grafikleri</h3>
                                <p className="text-gray-600 text-sm">
                                    Sınavdan sınava ilerlemenizi gösteren görsel grafikler
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">🎯 Hedef Takibi</h3>
                                <p className="text-gray-600 text-sm">
                                    Hedef belirleme ve hedefe ulaşma yüzdenizi anlık takip
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">👨‍🏫 Öğretmen Değerlendirmesi</h3>
                                <p className="text-gray-600 text-sm">
                                    Öğretmenlerinizin hazırladığı özel analiz ve tavsiyelere erişim
                                </p>
                            </div>
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
