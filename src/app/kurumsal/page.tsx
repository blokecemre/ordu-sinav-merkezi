import Link from "next/link"
import { ShieldCheck, Rocket, Eye, BarChart2 } from "lucide-react"
import { SiteHeader } from "@/components/SiteHeader"

export default function KurumsalPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <SiteHeader />
            <main className="flex-1">
                <section className="w-full pt-6 lg:pt-10 pb-4 lg:pb-8">
                    <div className="px-4 md:px-6">
                        <div className="flex min-h-[350px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-center justify-center p-4 text-center" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDC49981GpwnVwYCqYUH50caIXRjjSbgDJ_3ETNY0YtknTCuZ12-O-ziTONAwQrjehk_n93Gbu0fQkCvyPyHf7f5dfteDO-U6mDVKVqbq74DDdwhieLNUvTDHs3IhET_1X5qgGAmv8NOdgzf7o-3eM72gZTme6DWR3nvZ47ghy2pbAIzMeMWotJE7b4AjlGWuAOqNSUbzvz-kdg_gAJV2o0WwOH73i-dQKXxiGdVyzhklFyt1gs307hhKY32YKKozqyCo0ApKrsJOI')" }}>
                            <div className="flex flex-col gap-4 max-w-3xl">
                                <h1 className="text-white text-4xl font-black leading-tight tracking-tighter sm:text-5xl md:text-6xl">
                                    Başarıya Giden Yolda Güvenilir Rehberiniz
                                </h1>
                                <p className="text-gray-200 text-base font-normal leading-normal md:text-lg">
                                    Ordu Sınav Merkezi olarak, modern eğitim anlayışımız ve uzman kadromuzla hedeflerinize ulaşmanız için yanınızdayız.
                                </p>
                            </div>
                            <Link href="/paketler">
                                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary-new text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary-new/90 transition-colors">
                                    <span className="truncate">Hizmetlerimizi Keşfedin</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>
                <section className="w-full py-8 md:py-16" id="misyon">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid gap-8 md:grid-cols-2">
                            <div className="flex flex-col gap-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-8">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                                        <ShieldCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-[#111318] dark:text-white">Hakkımızda</h2>
                                </div>
                                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                                    <p>Ordu Sınav Merkezi, öğrencilerimizin merkezi sınavlara en iyi şekilde hazırlanması için detaylı analiz ve takip sistemi sunan öncü bir eğitim teknolojisi platformudur.</p>
                                    <p>2024 yılında kurulan merkezimiz, modern teknolojileri eğitim ile birleştirerek öğrencilerimizin eksiklerini tespit etmelerine ve hedeflerine ulaşmalarına yardımcı olmaktadır.</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-8">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                                        <Rocket className="w-7 h-7 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-[#111318] dark:text-white">Misyonumuz</h2>
                                </div>
                                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                                    <p>Her öğrencinin potansiyelini keşfetmesine ve hedeflerine ulaşmasına yardımcı olmak için kişiselleştirilmiş eğitim çözümleri sunmak.</p>
                                    <p>Veri odaklı analiz ve öğretmen takibi ile öğrenci başarısını maksimize etmek, aileleri süreçte aktif tutmak ve eğitimde fırsat eşitliği sağlamak.</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-8">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                                        <Eye className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-[#111318] dark:text-white">Vizyonumuz</h2>
                                </div>
                                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                                    <p>Türkiye’nin en güvenilir ve etkili sınav hazırlık platformu olmak. Teknoloji destekli eğitim çözümlerimizle binlerce öğrencinin hayallerine kavuşmasına vesile olmak.</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-8">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/50">
                                        <BarChart2 className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-[#111318] dark:text-white">Değerlerimiz</h2>
                                </div>
                                <ul className="space-y-2 text-gray-600 dark:text-gray-400 list-disc pl-5">
                                    <li>Öğrenci odaklılık ve bireysel gelişim</li>
                                    <li>Şeffaflık ve güvenilirlik</li>
                                    <li>Sürekli gelişim ve yenilikçilik</li>
                                    <li>Eğitimde fırsat eşitliği</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                            <BarChart2 className="w-6 h-6 text-blue-400" />
                            <span className="font-bold text-xl">Ordu Sınav Merkezi</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            © 2024 Ordu Sınav Merkezi. Tüm hakları saklıdır.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
