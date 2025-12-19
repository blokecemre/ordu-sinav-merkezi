"use client";

import { Clock, Target, TrendingUp, Award, Sparkles, Shield } from "lucide-react";

const reasons = [
    {
        icon: Clock,
        title: "Zaman Yönetimi",
        description: "Gereksiz konulara vakit harcamadan, sadece ihtiyaç duyulan alanlara odaklanın.",
        color: "bg-gradient-to-br from-blue-500 to-cyan-500",
    },
    {
        icon: Target,
        title: "Nokta Atışı Destek",
        description: "Veri odaklı analizlerle eksikleri tespit edip, hedefli çalışma programları oluşturuyoruz.",
        color: "bg-gradient-to-br from-teal-500 to-green-500",
    },
    {
        icon: TrendingUp,
        title: "Sürekli Gelişim",
        description: "Düzenli takip ve raporlama ile öğrencinin gelişimini adım adım izliyoruz.",
        color: "bg-gradient-to-br from-purple-500 to-pink-500",
    },
    {
        icon: Award,
        title: "Uzman Kadro",
        description: "20 yıllık tecrübeye sahip eğitimciler ve rehberlik uzmanlarından oluşan ekibimiz.",
        color: "bg-gradient-to-br from-orange-500 to-red-500",
    },
    {
        icon: Sparkles,
        title: "Kişiselleştirilmiş Plan",
        description: "Her öğrencinin öğrenme stiline uygun, bireysel çalışma programları hazırlıyoruz.",
        color: "bg-gradient-to-br from-indigo-500 to-purple-500",
    },
    {
        icon: Shield,
        title: "Güvenilir Sınavlar",
        description: "Türkiye geneli kurumsal denemelerle gerçekçi sıralama ve analiz imkanı.",
        color: "bg-gradient-to-br from-emerald-500 to-teal-500",
    },
];

export function WhyUs() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 hero-gradient opacity-95" />

            {/* Animated shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full float" />
                <div className="absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full float-delayed" />
                <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-white/10 rounded-full float" />
                <div className="absolute bottom-40 right-1/3 w-16 h-16 bg-white/5 rounded-full float-delayed" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold mb-6 border border-white/20">
                        <Sparkles className="w-4 h-4" />
                        Farkımız
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
                        Neden{" "}
                        <span className="relative inline-block">
                            Ordu Sınav Merkezi?
                            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-white/50 rounded-full" />
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-white/80">
                        Başarıya giden yolda size özel çözümler sunuyoruz.
                    </p>
                </div>

                {/* Reasons Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reasons.map((reason, index) => (
                        <div
                            key={reason.title}
                            className="group relative opacity-0 animate-fade-in-up"
                            style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                        >
                            <div className="relative h-full bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-500 overflow-hidden">
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Icon */}
                                <div className={`relative w-14 h-14 ${reason.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                                    <reason.icon className="w-7 h-7 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-heading font-bold text-white mb-3 group-hover:translate-x-1 transition-transform">
                                    {reason.title}
                                </h3>
                                <p className="text-white/70 leading-relaxed text-sm group-hover:text-white/90 transition-colors">
                                    {reason.description}
                                </p>

                                {/* Decorative corner */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                    <a
                        href="/iletisim"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary font-bold rounded-full hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-2xl shadow-white/20"
                    >
                        <span>Hemen Başlayın</span>
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Target className="w-4 h-4" />
                        </div>
                    </a>
                </div>
            </div>
        </section>
    );
}
