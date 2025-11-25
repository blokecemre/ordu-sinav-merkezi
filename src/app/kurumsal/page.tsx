import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart2, ArrowLeft, Building, Target, Users, Award } from "lucide-react"

export default function KurumsalPage() {
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
                        <Building className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Kurumsal</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Ordu Sınav Merkezi olarak öğrencilerimizin başarısı için çalışıyoruz
                        </p>
                    </div>

                    {/* Content */}
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {/* Hakkımızda */}
                        <div className="bg-white rounded-lg p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Target className="w-6 h-6 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Hakkımızda</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Ordu Sınav Merkezi, öğrencilerimizin merkezi sınavlara en iyi şekilde hazırlanması
                                için detaylı analiz ve takip sistemi sunan öncü bir eğitim teknolojisi platformudur.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                2024 yılında kurulan merkezimiz, modern teknolojileri eğitim ile birleştirerek
                                öğrencilerimizin eksiklerini tespit etmelerine ve hedeflerine ulaşmalarına
                                yardımcı olmaktadır.
                            </p>
                        </div>

                        {/* Misyonumuz */}
                        <div className="bg-white rounded-lg p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-6 h-6 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Misyonumuz</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Her öğrencinin potansiyelini keşfetmesine ve hedeflerine ulaşmasına yardımcı
                                olmak için kişiselleştirilmiş eğitim çözümleri sunmak.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Veri odaklı analiz ve öğretmen takibi ile öğrenci başarısını maksimize etmek,
                                aileleri süreçte aktif tutmak ve eğitimde fırsat eşitliği sağlamak.
                            </p>
                        </div>

                        {/* Vizyonumuz */}
                        <div className="bg-white rounded-lg p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Award className="w-6 h-6 text-purple-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Vizyonumuz</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                Türkiye'nin en güvenilir ve etkili sınav hazırlık platformu olmak.
                                Teknoloji destekli eğitim çözümlerimizle binlerce öğrencinin hayallerine
                                kavuşmasına vesile olmak.
                            </p>
                        </div>

                        {/* Değerlerimiz */}
                        <div className="bg-white rounded-lg p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <BarChart2 className="w-6 h-6 text-orange-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Değerlerimiz</h2>
                            </div>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span>Öğrenci odaklılık ve bireysel gelişim</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span>Şeffaflık ve güvenilirlik</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span>Sürekli gelişim ve yenilikçilik</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span>Eğitimde fırsat eşitliği</span>
                                </li>
                            </ul>
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
