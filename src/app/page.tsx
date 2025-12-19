import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart2 } from "lucide-react"
import { SiteHeader } from "@/components/SiteHeader"

import { HomepageSlider } from "@/components/HomepageSlider"
import { Features } from "@/components/Features"
import { WhyUs } from "@/components/WhyUs"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <SiteHeader />

      <main className="flex-1">
        <HomepageSlider />

        {/* Bölüm 2: Sistemimiz Nasıl İşliyor? - YENİ TASARIM */}
        <Features />

        {/* Bölüm 3: Neden Biz? - YENİ TASARIM */}
        <WhyUs />

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
