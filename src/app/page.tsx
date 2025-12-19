import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from "lucide-react"
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
      <footer className="bg-[#0d1b2a] text-white">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Sol - Marka ve İletişim */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Ordu Sınav Merkezi</h3>
              <p className="text-gray-400 leading-relaxed">
                20 yıllık tecrübeyle öğrencilerimizi geleceğe hazırlıyoruz. Doğru analiz, doğru yönlendirme, kesin başarı.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span>Ordu Merkez, Eğitim Sokak No: 1</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span>0500 123 45 67</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span>info@ordusinav.com</span>
                </div>
              </div>
            </div>

            {/* Orta - Hizmetler */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold">Hizmetler</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/sinavlar" className="text-gray-400 hover:text-white transition-colors">
                    Deneme Sınavları
                  </Link>
                </li>
                <li>
                  <Link href="/paketler" className="text-gray-400 hover:text-white transition-colors">
                    Özel Dersler
                  </Link>
                </li>
                <li>
                  <Link href="/paketler" className="text-gray-400 hover:text-white transition-colors">
                    Performans Analizi
                  </Link>
                </li>
                <li>
                  <Link href="/hakkimizda" className="text-gray-400 hover:text-white transition-colors">
                    Rehberlik
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sağ - Boş veya ek içerik için alan */}
            <div className="space-y-6 hidden lg:block">
              {/* İleride eklenebilecek içerik için boş alan */}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2024 Ordu Sınav Merkezi. Tüm hakları saklıdır.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div >
  )
}
