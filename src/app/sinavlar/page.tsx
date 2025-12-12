import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    BarChart2,
    ArrowLeft,
    FileText,
    Calendar,
    BookOpen,
    TrendingUp,
    Target,
    Search,
    Brain,
    Eye,
    Zap,
    Layers,
    XCircle,
    Clock,
    CheckCircle2
} from "lucide-react"
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
                    <div className="text-center mb-16">
                        <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Sınavlar
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Desteklediğimiz sınavlar ve analiz hizmetlerimiz
                        </p>
                    </div>

                    {/* Analiz Hizmetlerimiz Section (Moved to Top) */}
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-4">
                                🚀 Web Sitesi İçeriği: Akıllı Analiz Sistemlerimiz
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Sadece Sınava Girmek Yetmez; <br className="hidden md:block" />
                                <span className="text-blue-600">Başarı, Doğru Analizle Gelir</span>
                            </h2>
                            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                                Ordu Sınav Merkezi olarak, öğrencilerimizi sadece sınavlarla test etmiyor;
                                sonuçlarını yapay zeka destekli gelişmiş sistemlerle analiz ediyoruz.
                                Başarıya giden yol, "neden yanlış yaptığını" anlamaktan geçer.
                                İşte size sunduğumuz iki devrimsel analiz hizmeti:
                            </p>
                        </div>

                        <div className="space-y-12">
                            {/* Hizmet 1: Bütüncül Deneme Takip */}
                            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100">
                                <div className="flex items-start gap-6 flex-col md:flex-row">
                                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                        <TrendingUp className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            1. Bütüncül Deneme Takip ve Trend Analizi
                                        </h3>
                                        <p className="text-blue-600 font-medium italic mb-6">
                                            "Büyük resmi görün, rotanızı kaybetmeyin."
                                        </p>
                                        <p className="text-gray-600 mb-6 text-lg">
                                            LGS maratonu uzun bir süreçtir. Tek bir denemenin sonucu, gerçek potansiyelinizi göstermez.
                                            "Deneme Analiz Sistemimiz" ile öğrencinin tüm sınav geçmişini birleştirerek size stratejik bir yol haritası sunuyoruz.
                                        </p>

                                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                                            <div className="flex gap-3">
                                                <div className="mt-1"><BarChart2 className="w-5 h-5 text-blue-500" /></div>
                                                <div>
                                                    <strong className="text-gray-900 block mb-1">📊 Kesintisiz Trend Takibi</strong>
                                                    <p className="text-gray-600 text-sm">Öğrencinin ilk denemeden son denemeye kadar olan puan ve net değişimlerini grafiklerle takip ediyoruz. Yükseliş, düşüş veya duraklama dönemlerini anında tespit ediyoruz.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="mt-1"><Target className="w-5 h-5 text-blue-500" /></div>
                                                <div>
                                                    <strong className="text-gray-900 block mb-1">🎯 Puan Bandı Sistemi</strong>
                                                    <p className="text-gray-600 text-sm">Öğrencinin bulunduğu seviyeyi (Yeşil, Mavi, Sarı bantlar gibi) belirleyerek, bir üst banda çıkması için gereken net sayısını hesaplıyoruz.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="mt-1"><BookOpen className="w-5 h-5 text-blue-500" /></div>
                                                <div>
                                                    <strong className="text-gray-900 block mb-1">🧩 Kazanım Odaklı Eksik Tespiti</strong>
                                                    <p className="text-gray-600 text-sm">Hangi dersin, hangi ünitesinde eksiklik var? Sistemimiz, yüzlerce kazanım arasından öğrencinin "tam öğrenemediği" konuları nokta atışı belirler.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="mt-1"><TrendingUp className="w-5 h-5 text-blue-500" /></div>
                                                <div>
                                                    <strong className="text-gray-900 block mb-1">📉 Kurum ve Geçmiş Kıyaslaması</strong>
                                                    <p className="text-gray-600 text-sm">Öğrencinin kendi geçmişiyle ve kurum ortalamasıyla olan durumunu kıyaslayarak gerçekçi bir sıralama analizi yapıyoruz.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-600">
                                            <strong className="text-blue-900 block mb-2">Öğrenciye Faydası:</strong>
                                            <p className="text-blue-800">
                                                Rastgele ders çalışmak yerine, nokta atışı eksiklerine odaklanarak zaman kazanır ve netlerini istikrarlı bir şekilde artırır.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hizmet 2: Soru Türü Analizi */}
                            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100">
                                <div className="flex items-start gap-6 flex-col md:flex-row">
                                    <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                                        <Search className="w-8 h-8 text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            2. Derinlemesine Soru Türü Analizi ve Kök Neden Tespiti
                                        </h3>
                                        <p className="text-red-600 font-medium italic mb-6">
                                            "Soruyu neden kaçırdığınızı biliyor musunuz?"
                                        </p>
                                        <p className="text-gray-600 mb-6 text-lg">
                                            Her yanlış cevap, "bilgi eksikliği" değildir. Bazen dikkat, bazen zaman yönetimi, bazen de sorunun tuzağına düşmek yanlışı getirir.
                                            Sektörde bir ilk olan <strong className="text-gray-900">7 Kategorili Soru Analiz Sistemimiz</strong> ile yanlışların "DNA'sını" inceliyoruz.
                                        </p>

                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                                <Brain className="w-5 h-5 text-purple-600" />
                                                <span className="text-gray-700 text-sm font-medium">1. Bilgi Sorusu (Konu eksiği)</span>
                                            </div>
                                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                                <Eye className="w-5 h-5 text-blue-600" />
                                                <span className="text-gray-700 text-sm font-medium">2. Dikkat Sorusu</span>
                                            </div>
                                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                                <Zap className="w-5 h-5 text-yellow-600" />
                                                <span className="text-gray-700 text-sm font-medium">3. Yeni Nesil Soru</span>
                                            </div>
                                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                                <Layers className="w-5 h-5 text-indigo-600" />
                                                <span className="text-gray-700 text-sm font-medium">4. Hibrit Soru</span>
                                            </div>
                                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                <span className="text-gray-700 text-sm font-medium">5. Kazanım Sorusu</span>
                                            </div>
                                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                                <XCircle className="w-5 h-5 text-red-600" />
                                                <span className="text-gray-700 text-sm font-medium">6. X Çeldirici Sorusu</span>
                                            </div>
                                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                                <Clock className="w-5 h-5 text-orange-600" />
                                                <span className="text-gray-700 text-sm font-medium">7. Yan Kesici Soru</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <div className="flex gap-3">
                                                <div className="mt-1"><Search className="w-5 h-5 text-red-500" /></div>
                                                <div>
                                                    <strong className="text-gray-900 block mb-1">🔍 Kök Neden Analizi (Root Cause Analysis)</strong>
                                                    <p className="text-gray-600 text-sm">Sadece "yanlış" deyip geçmeyiz. Hatanın kaynağını (Dikkat, Bilgi, Zaman Baskısı, Kavram Yanılgısı) tespit ederiz.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="mt-1"><Target className="w-5 h-5 text-red-500" /></div>
                                                <div>
                                                    <strong className="text-gray-900 block mb-1">🛡️ Kişiselleştirilmiş Çözüm Stratejileri</strong>
                                                    <p className="text-gray-600 text-sm">Öğrenciye özel "Dikkat hatalarını azaltmak için soru kökünü daire içine al" veya "Çeldirici sorularda şık eleme yöntemini kullan" gibi somut taktikler veririz.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-600">
                                            <strong className="text-red-900 block mb-2">Öğrenciye Faydası:</strong>
                                            <p className="text-red-800">
                                                Öğrenci "Ben bu konuyu anlamıyorum" yanılgısından kurtulur. Sorunu (örneğin dikkat eksikliği veya çeldiriciye takılma) tam olarak tanımladığı için, aynı hatayı tekrar yapmamayı öğrenir.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="mt-12 text-center bg-gray-900 rounded-2xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                <div className="absolute right-0 top-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute left-0 bottom-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl md:text-3xl font-bold mb-4">Ordu Sınav Merkezi'nde tesadüfe yer yok.</h3>
                                <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                                    Veriye dayalı analizler ve kişiye özel stratejilerle potansiyelinizi zirveye taşıyın.
                                    Gelin, eksiklerinizi birlikte keşfedelim ve başarı hikayenizi yazalım.
                                </p>
                                <Link href="/iletisim">
                                    <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-8">
                                        Hemen İletişime Geç
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Sınav Türleri (Original Content) */}
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
