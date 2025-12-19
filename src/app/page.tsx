import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import { SiteHeader } from "@/components/SiteHeader"
import { getSettings } from "@/app/actions/settings"

import { HomepageSlider } from "@/components/HomepageSlider"
import { Features } from "@/components/Features"
import { WhyUs } from "@/components/WhyUs"

export default async function Home() {
  const settingsResult = await getSettings()
  const settings = settingsResult.success && settingsResult.data ? settingsResult.data : {} as Record<string, string>

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
                <div className="flex items-start gap-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                  <span>{settings.address || "Ordu Merkez, Eğitim Sokak No: 1"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-blue-400 transition-colors">
                    {settings.phone || "0500 123 45 67"}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-blue-400 transition-colors">
                    {settings.email || "info@ordusinav.com"}
                  </a>
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
                © {new Date().getFullYear()} Ordu Sınav Merkezi. Tüm hakları saklıdır.
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

