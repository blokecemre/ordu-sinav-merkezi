import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
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
      <SiteFooter />

    </div >
  )
}

