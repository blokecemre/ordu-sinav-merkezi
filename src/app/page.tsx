import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart2, CheckCircle, Users } from "lucide-react"
import { SiteHeader } from "@/components/SiteHeader"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <SiteHeader />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Başarınızı <span className="text-blue-600">Analiz Edin</span>, Geleceğinizi Planlayın
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
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
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <BarChart2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Detaylı Analiz</h3>
                <p className="text-gray-600">
                  Ders bazlı netleriniz, puanlarınız ve sıralamalarınızla eksiklerinizi anında görün.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Öğretmen Takibi</h3>
                <p className="text-gray-600">
                  Öğretmenleriniz gelişiminizi yakından takip etsin, size özel çalışma programları hazırlasın.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Hedef Odaklı</h3>
                <p className="text-gray-600">
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
