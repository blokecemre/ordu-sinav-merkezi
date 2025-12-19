
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, BarChart2 } from "lucide-react"
import { SiteHeader } from "@/components/SiteHeader"

import { HomepageSlider } from "@/components/HomepageSlider"
import { Features } from "@/components/Features"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <SiteHeader />

      <main className="flex-1">
        <HomepageSlider />



        {/* Bölüm 2: Sistemimiz Nasıl İşliyor? */}
        {/* Bölüm 2: Sistemimiz Nasıl İşliyor? - YENİ TASARIM */}
        <Features />

        {/* Bölüm 3: Fark Yaratan Yaklaşımımız */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              {/* Sol Görsel */}
              <div className="w-full lg:w-1/2 relative">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
                  <img
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop"
                    alt="Öğrenci ve Öğretmen Çalışırken"
                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Sağ Metin */}
              <div className="w-full lg:w-1/2 space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                  Neden <span className="text-blue-600">Ordu Sınav Merkezi?</span>
                </h2>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-gray-200">Zaman Yönetimi</h4>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Öğrencinin zaten bildiği konuları tekrar dinlemesi yerine, sadece eksik olduğu "nokta atışı" konulara odaklanmasını sağlıyoruz.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-gray-200">Butik Eğitim</h4>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Kalabalık sınıflar yok. Özel derslerimiz bire bir ya da en fazla iki öğrenci ile gerçekleştirilir.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-gray-200">Bütünsel Rehberlik</h4>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Sınav süreci sadece akademik bir yarış değildir; psikolojik ve stratejik bir yönetim gerektirir. Uzman rehber öğretmenimiz sürecin her anında öğrencinin yanındadır.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-gray-200">Tecrübe</h4>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Tüm bu sistem, 20 yıllık meslek tecrübesinin süzgecinden geçirilmiş, denenmiş ve başarısı kanıtlanmış yöntemlerle yönetilir.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bölüm 4: Harekete Geçirici Mesaj (CTA) */}
        <section className="py-20 bg-[#001D4A] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 max-w-4xl mx-auto leading-tight">
              Başarınızı Analiz Edin, <span className="text-blue-400">Geleceğinizi Şansa Bırakmayın.</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/iletisim">
                <Button size="lg" className="h-14 px-10 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1">
                  Hemen Bilgi Alın <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
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
    </div >
  )
}
