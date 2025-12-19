"use client";

import { FileText, BarChart3, Calendar, Users, ArrowRight } from "lucide-react";

const features = [
    {
        icon: FileText,
        title: "Türkiye Geneli Kurumsal Denemeler",
        description: "Öğrencimiz, en kaliteli yayınların Türkiye geneli sınavlarına katılarak gerçek sıralamasını görür.",
        gradient: "from-blue-600 to-indigo-600", // Adjusted to match primary colors roughly
    },
    {
        icon: BarChart3,
        title: "Detaylı Performans Analizi",
        description: "Uzman rehberlik birimimiz, sonuçları en ince ayrıntısına kadar inceler. Veri odaklı tespit yapılır.",
        gradient: "from-indigo-600 to-blue-600",
    },
    {
        icon: Calendar,
        title: "Kişiye Özel Gerçekçi Planlama",
        description: "Analiz sonuçlarına göre, öğrenci merkezli ve 'uygulanabilir' bir ders çalışma programı hazırlanır.",
        gradient: "from-blue-600 to-indigo-600",
    },
    {
        icon: Users,
        title: "Nokta Atışı Özel Dersler",
        description: "Sadece eksik tespit edilen konularda, bire bir veya küçük gruplarda özel ders planlanır.",
        gradient: "from-indigo-600 to-blue-600",
    },
];

export function Features() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 text-sm font-semibold mb-6 border border-blue-100 dark:border-blue-900">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        Sistemimiz
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
                        Sistemimiz Nasıl{" "}
                        <span className="relative inline-block">
                            <span className="text-gradient">İşliyor?</span>
                            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8">
                                <path d="M0 7 Q50 0, 100 4 T200 7" fill="none" stroke="url(#underlineGradient)" strokeWidth="3" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="underlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="hsl(205, 90%, 50%)" />
                                        <stop offset="100%" stopColor="hsl(175, 80%, 45%)" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground">
                        Başarı tesadüf değildir. Zamanı ve enerjiyi verimli kullanma devri başladı.
                    </p>
                </div>

                {/* Features Timeline */}
                <div className="relative">
                    {/* Connection Line - Desktop */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200 dark:from-blue-900 dark:via-indigo-900 dark:to-blue-900 rounded-full -translate-y-1/2 opacity-20" />

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className="group relative animate-fade-in-up"
                                style={{ animationDelay: `${0.15 + index * 0.15}s` }}
                            >
                                {/* Card */}
                                <div className="relative h-full bg-card rounded-3xl p-6 border border-border/50 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden">
                                    {/* Gradient Overlay on Hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                                    {/* Step Number */}
                                    <div className={`absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300`}>
                                        <span className="text-2xl font-bold text-white">{index + 1}</span>
                                    </div>

                                    {/* Icon */}
                                    <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-lg font-heading font-bold text-foreground mb-3 group-hover:text-blue-600 transition-colors pr-8">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Arrow indicator */}
                                    {index < features.length - 1 && (
                                        <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-background rounded-full items-center justify-center border-2 border-blue-500/30 group-hover:border-blue-500 group-hover:bg-blue-600 transition-all duration-300">
                                            <ArrowRight className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
