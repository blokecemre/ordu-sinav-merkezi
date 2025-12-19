"use client";

import { FileText, BarChart3, Calendar, Users, ArrowRight } from "lucide-react";

const features = [
    {
        icon: FileText,
        title: "Türkiye Geneli Kurumsal Denemeler",
        description: "Öğrencimiz, en kaliteli yayınların Türkiye geneli sınavlarına katılarak gerçek sıralamasını görür.",
        gradient: "from-primary to-accent",
    },
    {
        icon: BarChart3,
        title: "Detaylı Performans Analizi",
        description: "Uzman rehberlik birimimiz, sonuçları en ince ayrıntısına kadar inceler. Veri odaklı tespit yapılır.",
        gradient: "from-accent to-primary",
    },
    {
        icon: Calendar,
        title: "Kişiye Özel Gerçekçi Planlama",
        description: "Analiz sonuçlarına göre, öğrenci merkezli ve 'uygulanabilir' bir ders çalışma programı hazırlanır.",
        gradient: "from-primary to-accent",
    },
    {
        icon: Users,
        title: "Nokta Atışı Özel Dersler",
        description: "Sadece eksik tespit edilen konularda, bire bir veya küçük gruplarda özel ders planlanır.",
        gradient: "from-accent to-primary",
    },
];

export function Features() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 text-primary text-sm font-semibold mb-6 border border-primary/20">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Sistemimiz
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
                        Sistemimiz Nasıl{" "}
                        <span className="relative">
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
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full -translate-y-1/2 opacity-20" />

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className="group relative opacity-0 animate-fade-in-up"
                                style={{ animationDelay: `${0.15 + index * 0.15}s` }}
                            >
                                {/* Card */}
                                <div className="relative h-full bg-card rounded-3xl p-6 border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden">
                                    {/* Gradient Overlay on Hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                                    {/* Step Number */}
                                    <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-2xl font-bold text-primary-foreground">{index + 1}</span>
                                    </div>

                                    {/* Icon */}
                                    <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                        <feature.icon className="w-7 h-7 text-primary-foreground" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-lg font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors pr-8">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Arrow indicator */}
                                    {index < features.length - 1 && (
                                        <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-background rounded-full items-center justify-center border-2 border-primary/30 group-hover:border-primary group-hover:bg-primary transition-all duration-300">
                                            <ArrowRight className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
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
