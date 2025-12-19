"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { getSliderImages } from "@/app/actions/slider"
import Link from "next/link"

// Default fallback slides if no data is present
const DEFAULT_SLIDES = [
    {
        title: "DOĞRU DENEME ANALİZİ",
        subtitle: "Öğrencinizi Türkiye geneli kurumsal denemelerle test edin",
        description: "Nokta atışı analizlerle eksikleri belirleyin",
        highlight: "20 Yıllık Tecrübe",
        bgClass: "from-blue-600 to-blue-900",
    },
    {
        title: "TÜRKİYE GENELİ SIRALAMA",
        subtitle: "Binlerce öğrenci arasında yerinizi görün",
        description: "Detaylı performans raporları ile gelişimi takip edin",
        highlight: "5000+ Öğrenci",
        bgClass: "from-purple-600 to-indigo-900",
    },
    {
        title: "KİŞİSEL GELİŞİM PLANI",
        subtitle: "Her öğrenciye özel çalışma programı",
        description: "Zayıf alanları güçlendirin, başarıyı yakalayın",
        highlight: "%92 Memnuniyet",
        bgClass: "from-teal-600 to-emerald-900",
    },
]

export function HomepageSlider() {
    const [images, setImages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        const fetchImages = async () => {
            const result = await getSliderImages()
            if (result.success && result.data && result.data.length > 0) {
                setImages(result.data)
            }
            setLoading(false)
        }
        fetchImages()
    }, [])

    const slides = images.length > 0 ? images : DEFAULT_SLIDES
    const totalSlides = slides.length

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides)
        }, 5000)
        return () => clearInterval(timer)
    }, [totalSlides])

    const goToSlide = (index: number) => setCurrentSlide(index)
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides)

    if (loading) {
        return <div className="w-full h-[70vh] flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin w-8 h-8 text-blue-500" /></div>
    }

    return (
        <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden">
            {/* Background Slides */}
            {slides.map((slide, index) => {
                const isActive = index === currentSlide
                // For DB images, we check if there's an ID (meaning it's from DB and has an image url)
                // For default slides, we use gradient only.
                const hasImage = !!slide.id

                return (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        {/* 1. Underlying Base: Either Image or Gradient */}
                        {hasImage ? (
                            <img
                                src={`/api/slider/${slide.id}/image`}
                                alt={slide.title || "Slider"}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ) : (
                            // Fallback if no images are uploaded: use solid gradient
                            <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgClass || "from-blue-900 to-slate-900"}`} />
                        )}

                        {/* 2. Overlay: Always add a gradient overlay to ensure text readability */}
                        {/* If there is an image, use a dark overlay. If no image, the gradient above is enough? 
                            Actually, to be safe and consistent with the "design", let's always add a semi-transparent gradient
                            that matches the slide's theme color or just dark. */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${hasImage ? 'from-black/80 via-black/40 to-transparent' : 'from-black/20 to-transparent'}`} />

                        {/* Also add the colored gradient from the design but with mix-blend-mode if image exists? */}
                        {hasImage && slide.bgClass && (
                            <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgClass} opacity-60 mix-blend-multiply`} />
                        )}
                    </div>
                )
            })}

            {/* Pattern Overlay - Inline SVG style for pattern-dots */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)',
                backgroundSize: '30px 30px'
            }} />

            {/* Floating Shapes */}
            <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-white/10 blur-2xl float animate-blob" />
            <div className="absolute bottom-1/4 right-20 w-32 h-32 rounded-full bg-white/10 blur-3xl float-delayed animate-blob animation-delay-2000" />

            <div className="container mx-auto px-4 relative z-10 pt-20">
                <div className="max-w-4xl mx-auto text-center text-white">
                    {/* Content Layer */}
                    {slides.map((slide, index) => {
                        return (
                            <div
                                key={index}
                                className={`transition-all duration-700 ease-in-out absolute inset-0 flex flex-col items-center justify-center ${index === currentSlide
                                        ? "opacity-100 translate-y-0 relative"
                                        : "opacity-0 translate-y-8 pointer-events-none"
                                    }`}
                                style={{ display: index === currentSlide ? 'flex' : 'none' }}
                            >
                                {/* Badge */}
                                {slide.highlight && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                        {slide.highlight}
                                    </div>
                                )}

                                {/* Title */}
                                {slide.title && (
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 drop-shadow-lg animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                                        {slide.title}
                                    </h1>
                                )}

                                {/* Subtitle */}
                                {slide.subtitle && (
                                    <p className="text-xl md:text-2xl font-medium mb-2 text-white/95 drop-shadow-md animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
                                        {slide.subtitle}
                                    </p>
                                )}

                                {/* Description */}
                                {slide.description && (
                                    <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto drop-shadow animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                                        {slide.description}
                                    </p>
                                )}

                                {/* CTA */}
                                <div className="flex justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
                                    <Link href="/register">
                                        <Button size="lg" className="group bg-white text-blue-900 hover:bg-blue-50 border-0 font-bold h-12 px-8 rounded-full">
                                            Hemen Başla
                                            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-20"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-20"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 rounded-full ${index === currentSlide
                                ? "bg-white w-8 h-3"
                                : "bg-white/40 w-3 h-3 hover:bg-white/60"
                            }`}
                    />
                ))}
            </div>

            {/* Bottom Wave decoration (optional, keeping from user snippet) */}
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full text-white dark:text-background">
                    <path
                        d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
                        fill="currentColor"
                        className="fill-background"
                    />
                </svg>
            </div>
        </section>
    )
}
