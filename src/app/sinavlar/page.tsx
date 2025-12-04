import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart2, ArrowLeft, FileText, Calendar, BookOpen } from "lucide-react"
import { SiteHeader } from "@/components/SiteHeader"

export default function SinavlarPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <SiteHeader />

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
                    <div className="flex justify-center mb-12">
                        <div className="bg-white rounded-lg p-8 shadow-sm max-w-2xl w-full border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Lise Geçiş Sınavı (LGS)</h3>
                            </div>

                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Liselere Geçiş Sistemi (LGS) kapsamında yapılan merkezi sınava yönelik deneme sınavları ve detaylı performans analizi.
                            </p>

                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-center gap-2">
                                    <span className="text-blue-500">✓</span>
                                    Türkçe, Matematik, Fen Bilimleri
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-blue-500">✓</span>
                                    T.C. İnkılap Tarihi ve Atatürkçülük
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-blue-500">✓</span>
                                    Din Kültürü ve Ahlak Bilgisi, Yabancı Dil
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-blue-500">✓</span>
                                    Kazanım bazlı değerlendirme ve eksik tamamlama
                                </li>
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
