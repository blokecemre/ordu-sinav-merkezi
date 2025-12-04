import Link from "next/link"
import { ShieldCheck, Rocket, Eye, BarChart2 } from "lucide-react"

export default function KurumsalPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-[#111318] dark:text-gray-200">
            <div className="layout-container flex h-full grow flex-col">
                <header className="sticky top-0 z-50 flex w-full items-center justify-center border-b border-solid border-gray-200/80 dark:border-gray-800/80 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
                    <div className="flex items-center justify-between whitespace-nowrap px-4 sm:px-10 py-3 w-full max-w-6xl">
                        <Link href="/" className="flex items-center gap-4 text-primary-new">
                            <div className="size-6">
                                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
                                </svg>
                            </div>
                            <h2 className="text-lg font-bold tracking-[-0.015em] text-[#111318] dark:text-white">Ordu Sınav Merkezi</h2>
                        </Link>
                        <div className="hidden md:flex flex-1 justify-end items-center gap-8">
                            <nav className="flex items-center gap-9">
                                <Link className="text-sm font-medium text-[#111318] dark:text-gray-300 hover:text-primary-new dark:hover:text-primary-new transition-colors" href="#misyon">Misyon & Vizyon</Link>
                                <Link className="text-sm font-medium text-[#111318] dark:text-gray-300 hover:text-primary-new dark:hover:text-primary-new transition-colors" href="#hizmetler">Hizmetler</Link>
                                <Link className="text-sm font-medium text-[#111318] dark:text-gray-300 hover:text-primary-new dark:hover:text-primary-new transition-colors" href="#basarilar">Başarılar</Link>
                                <Link className="text-sm font-medium text-[#111318] dark:text-gray-300 hover:text-primary-new dark:hover:text-primary-new transition-colors" href="/iletisim">İletişim</Link>
                            </nav>
                            <Link href="/iletisim">
                                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary-new text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary-new/90 transition-colors">
                                    <span className="truncate">Bize Ulaşın</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </header>
                <main className="flex-1">
                    <section className="w-full py-20 lg:py-32">
                        <div className="px-4 md:px-6">
                            <div className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-center justify-center p-4 text-center" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDC49981GpwnVwYCqYUH50caIXRjjSbgDJ_3ETNY0YtknTCuZ12-O-ziTONAwQrjehk_n93Gbu0fQkCvyPyHf7f5dfteDO-U6mDVKVqbq74DDdwhieLNUvTDHs3IhET_1X5qgGAmv8NOdgzf7o-3eM72gZTme6DWR3nvZ47ghy2pbAIzMeMWotJE7b4AjlGWuAOqNSUbzvz-kdg_gAJV2o0WwOH73i-dQKXxiGdVyzhklFyt1gs307hhKY32YKKozqyCo0ApKrsJOI')" }}>
                                <div className="flex flex-col gap-4 max-w-3xl">
                                    <h1 className="text-white text-4xl font-black leading-tight tracking-tighter sm:text-5xl md:text-6xl">
                                        Başarıya Giden Yolda Güvenilir Rehberiniz
                                    </h1>
                                    <p className="text-gray-200 text-base font-normal leading-normal md:text-lg">
                                        Ordu Sınav Merkezi olarak, modern eğitim anlayışımız ve uzman kadromuzla hedeflerinize ulaşmanız için yanınızdayız.
                                    </p>
                                </div>
                                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary-new text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary-new/90 transition-colors">
                                    <span className="truncate">Hizmetlerimizi Keşfedin</span>
                                </button>
                            </div>
                        </div>
                    </section>
                    <section className="w-full py-12 md:py-24" id="misyon">
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
                <footer className="w-full py-6 md:py-8 border-t border-gray-200 dark:border-gray-800">
                    <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">© 2024 Ordu Sınav Merkezi. Tüm hakları saklıdır.</p>
                        <nav className="flex gap-4 sm:gap-6">
                            <Link className="text-sm hover:underline underline-offset-4 text-gray-600 dark:text-gray-400 hover:text-primary-new dark:hover:text-primary-new" href="#">Gizlilik Politikası</Link>
                            <Link className="text-sm hover:underline underline-offset-4 text-gray-600 dark:text-gray-400 hover:text-primary-new dark:hover:text-primary-new" href="#">Kullanım Şartları</Link>
                        </nav>
                    </div>
                </footer>
            </div>
        </div>
    )
}
