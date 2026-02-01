import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, CheckCircle2, BarChart2, Calendar, Target } from "lucide-react"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"

export default function HakkimizdaPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
                    <div className="container px-4 md:px-6 relative z-10 text-center">
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 mb-6">
                            Yapay Zeka Destekli Eğitim
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                            Eğitimde Yeni Bir Dönem
                        </h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl mb-8 leading-relaxed">
                            Öğrencilerimizin başarısını şansa bırakmıyoruz. Veri odaklı analizler ve kişiselleştirilmiş
                            çalışma planlarıyla geleceği birlikte inşa ediyoruz.
                        </p>
                    </div>

                    {/* Abstract Background Shapes */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
                </section>

                {/* Feature 1: Comparative Analysis */}
                <section className="py-16 md:py-24">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-12 lg:grid-cols-2 items-center">
                            <div className="relative group perspective-1000">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                                <div className="relative rounded-2xl border bg-card p-2 shadow-2xl transition-transform hover:scale-[1.01] duration-500">
                                    <Image
                                        src="/assets/about/analysis-comparison.png"
                                        alt="Karşılaştırmalı Analiz Tablosu"
                                        width={800}
                                        height={600}
                                        className="rounded-xl w-full h-auto object-cover"
                                    />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 text-blue-600 font-semibold">
                                    <BarChart2 className="w-5 h-5" />
                                    <span>Detaylı Analiz</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold">Gelişimi Adım Adım İzleyin</h2>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    Önceki denemelerle kıyaslamalı analizler sayesinde öğrencimin gelişimini
                                    sayısal verilerle takip ediyoruz. Sadece net sayılarına değil, soru türü
                                    dağılımına (Yeni Nesil, Bilgi, Dikkat vb.) odaklanarak nokta atışı tespitler yapıyoruz.
                                </p>
                                <ul className="space-y-3">
                                    {["Soru türüne göre performans değişimi", "Ders bazlı kümülatif karşılaştırma", "Yüzdelik değişim analizleri"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 2: Topic Breakdown */}
                <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-12 lg:grid-cols-2 items-center">
                            <div className="space-y-6 order-2 lg:order-1">
                                <div className="inline-flex items-center gap-2 text-purple-600 font-semibold">
                                    <Target className="w-5 h-5" />
                                    <span>Konu Bazlı Eksik Tespiti</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold">Nokta Atışı Eksik Tespiti</h2>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    Hangi konuda eksiğimiz var? "Paragrafta Anlam" mı, "Sözel Mantık" mı?
                                    Tüm denemelerin kümülatif analizi ile konu bazlı başarı oranlarını çıkarıyor,
                                    çalışma programını bu verilere göre şekillendiriyoruz.
                                </p>
                                <ul className="space-y-3">
                                    {["Ünite ve konu bazlı detaylı döküm", "Kümülatif başarı yüzdeleri", "Zaman içindeki değişim"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="order-1 lg:order-2 relative group perspective-1000">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                                <div className="relative rounded-2xl border bg-card p-2 shadow-2xl transition-transform hover:scale-[1.01] duration-500">
                                    <Image
                                        src="/assets/about/topic-analysis.png"
                                        alt="Konu Bazlı Analiz"
                                        width={800}
                                        height={600}
                                        className="rounded-xl w-full h-auto object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 3: Performance Charts */}
                <section className="py-16 md:py-24">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-12 lg:grid-cols-2 items-center">
                            <div className="relative group perspective-1000">
                                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                                <div className="relative rounded-2xl border bg-card p-2 shadow-2xl transition-transform hover:scale-[1.01] duration-500">
                                    <Image
                                        src="/assets/about/performance-chart.png"
                                        alt="Performans Grafikleri"
                                        width={800}
                                        height={600}
                                        className="rounded-xl w-full h-auto object-cover"
                                    />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 text-green-600 font-semibold">
                                    <BarChart2 className="w-5 h-5" />
                                    <span>Görselleştirilmiş Veri</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold">Verilerle Konuşan Başarı</h2>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    Karmaşık sayıları anlaşılır grafiklere döküyoruz. Velilerimiz ve öğrencilerimiz,
                                    ders bazlı başarı oranlarını, doğru/yanlış dağılımlarını ve haftalık değişimleri
                                    tek bir bakışta görebiliyor.
                                </p>
                                <Button size="lg" className="mt-4" asChild>
                                    <Link href="/iletisim">
                                        Hemen Başlayın <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 4: Study Plan */}
                <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-12 lg:grid-cols-2 items-center">
                            <div className="space-y-6 order-2 lg:order-1">
                                <div className="inline-flex items-center gap-2 text-orange-600 font-semibold">
                                    <Calendar className="w-5 h-5" />
                                    <span>Kişiye Özel Planlama</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold">Dinamik Ders Programı</h2>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    Analiz sonuçlarına göre şekillenen, dinamik bir ders çalışma programı.
                                    Hangi gün, hangi derse, hangi kazanıma çalışılacağı sistem tarafından belirleniyor
                                    ve öğrencinin gelişimine göre sürekli güncelleniyor.
                                </p>
                                <ul className="space-y-3">
                                    {["Kazanım odaklı günlük plan", "Süre ve hedef takibi", "Öğrenciye özel dinamik yapı"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="order-1 lg:order-2 relative group perspective-1000">
                                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                                <div className="relative rounded-2xl border bg-card p-2 shadow-2xl transition-transform hover:scale-[1.01] duration-500">
                                    <Image
                                        src="/assets/about/study-plan.png"
                                        alt="Akıllı Ders Programı"
                                        width={800}
                                        height={600}
                                        className="rounded-xl w-full h-auto object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    )
}
