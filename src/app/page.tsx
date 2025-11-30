
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart2, CheckCircle, Users } from "lucide-react"
import { SiteHeader } from "@/components/SiteHeader"

import { HomepageSlider } from "@/components/HomepageSlider"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <SiteHeader />

      {/* Hero Section */}
      <main className="flex-1">
        <HomepageSlider />

        <section className="py-20 md:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Başarınızı <span className="text-blue-600 dark:text-blue-400">Analiz Edin</span>, Geleceğinizi Planlayın
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Detaylı sınav analizleri, gelişim grafikleri ve kişiselleştirilmiş raporlar ile hedeflerinize bir adım daha yaklaşın.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="h-12 px-8 text-lg">
                  Sonuçlarını Gör <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                  <BarChart2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Detaylı Analiz</h3>
                <p className="text-muted-foreground">
                  Ders bazlı netleriniz, puanlarınız ve sıralamalarınızla eksiklerinizi anında görün.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Öğretmen Takibi</h3>
                <p className="text-muted-foreground">
                  Öğretmenleriniz gelişiminizi yakından takip etsin, size özel çalışma programları hazırlasın.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Hedef Odaklı</h3>
                <p className="text-muted-foreground">
                  Geçmiş sınavlarla karşılaştırmalı raporlar sayesinde hedeflerinize ne kadar yaklaştığınızı ölçün.
                </p>
              </div>
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
    </div>
  )
}
