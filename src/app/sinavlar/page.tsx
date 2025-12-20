import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import {
    TrendingUp,
    Target,
    PuzzleIcon,
    BarChart3,
    Search,
    Shield,
    Brain,
    BookOpen,
    GraduationCap,
    Calculator,
    FlaskConical,
    Users,
    ArrowRight,
    CheckCircle2,
    Sparkles
} from "lucide-react";

const analysisFeatures = [
    {
        icon: BarChart3,
        title: "Kesintisiz Trend Takibi",
        description: "Öğrencinin ilk denemeden son denemeye kadar olan puan ve net değişimlerini grafiklerle takip ediyoruz.",
        gradient: "from-primary to-primary-glow"
    },
    {
        icon: Target,
        title: "Puan Bandı Sistemi",
        description: "Öğrencinin bulunduğu seviyeyi belirleyerek, bir üst banda çıkması için gereken net sayısını hesaplıyoruz.",
        gradient: "from-emerald-500 to-teal-400"
    },
    {
        icon: PuzzleIcon,
        title: "Kazanım Odaklı Eksik Tespiti",
        description: "Sistemimiz, yüzlerce kazanım arasından öğrencinin 'tam öğrenemediği' konuları nokta atışı belirler.",
        gradient: "from-violet-500 to-purple-400"
    },
    {
        icon: TrendingUp,
        title: "Kurum ve Geçmiş Kıyaslaması",
        description: "Öğrencinin kendi geçmişiyle ve kurum ortalamasıyla olan durumunu kıyaslayarak gerçekçi analiz yapıyoruz.",
        gradient: "from-orange-500 to-amber-400"
    }
];

const questionTypes = [
    { number: 1, title: "Bilgi Sorusu", subtitle: "Konu eksiği" },
    { number: 2, title: "Dikkat Sorusu", subtitle: "Odak eksikliği" },
    { number: 3, title: "Yeni Nesil Soru", subtitle: "Yorumlama becerisi" },
    { number: 4, title: "Hibrit Soru", subtitle: "Çoklu beceri" },
    { number: 5, title: "Kazanım Sorusu", subtitle: "Hedef kazanım" },
    { number: 6, title: "X Çeldirici", subtitle: "Dikkat tuzağı" },
    { number: 7, title: "Yan Kesici", subtitle: "İnce detay" }
];

const examTypes = [
    {
        title: "TYT",
        subtitle: "Temel Yeterlilik Testi",
        description: "Temel Yeterlilik Testi için detaylı analiz ve ders bazlı net takibi",
        icon: Calculator,
        features: ["Türkçe - Matematik", "Fen Bilimleri - Sosyal Bilimler", "Soru bazlı çözümleme"],
        gradient: "from-primary to-primary-glow",
        delay: 0
    },
    {
        title: "AYT",
        subtitle: "Alan Yeterlilik Testi",
        description: "Alan Yeterlilik Testi için branş bazlı detaylı raporlama",
        icon: FlaskConical,
        features: ["Sayısal - Sözel - Eşit Ağırlık", "Dil sınavları", "Konu bazlı analiz"],
        gradient: "from-violet-500 to-purple-400",
        delay: 100
    },
    {
        title: "LGS",
        subtitle: "Liseye Geçiş Sınavı",
        description: "Liseye Geçiş Sınavı için kapsamlı hazırlık ve takip sistemi",
        icon: GraduationCap,
        features: ["Türkçe - Matematik", "Fen - Sosyal - İnkılap - Din", "Kazanım bazlı analiz"],
        gradient: "from-emerald-500 to-teal-400",
        delay: 200
    }
];

export default function Sinavlar() {
    return (
        <div className="min-h-screen bg-background">
            <SiteHeader />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 hero-gradient opacity-90" />
                <div className="absolute inset-0 pattern-dots" />

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary-glow/20 rounded-full blur-3xl float" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl float-delayed" />

                <div className="container relative z-10 mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
                            <Sparkles className="w-4 h-4 text-white" />
                            <span className="text-sm font-medium text-white">Yapay Zeka Destekli Analiz</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Sadece Sınava Girmek Yetmez;
                            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-foreground to-white/80">
                                Başarı, Doğru Analizle Gelir
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                            Ordu Sınav Merkezi olarak, öğrencilerimizi sadece sınavlarla test etmiyor;
                            sonuçlarını yapay zeka destekli gelişmiş sistemlerle analiz ediyoruz.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg btn-glow"
                            >
                                <BookOpen className="w-5 h-5 mr-2" />
                                Hemen Başla
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg"
                            >
                                Daha Fazla Bilgi
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))" />
                    </svg>
                </div>
            </section>

            {/* Analysis Section 1 */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Section Header */}
                        <div className="flex items-start gap-6 mb-12">
                            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg glow">
                                <TrendingUp className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                                    1. Bütüncül Deneme Takip ve Trend Analizi
                                </h2>
                                <p className="text-lg text-primary italic font-medium">
                                    &quot;Büyük resmi görün, rotanızı kaybetmeyin.&quot;
                                </p>
                            </div>
                        </div>

                        <p className="text-lg text-muted-foreground mb-12 max-w-4xl">
                            LGS maratonu uzun bir süreçtir. Tek bir denemenin sonucu, gerçek potansiyelinizi göstermez.
                            &quot;Deneme Analiz Sistemimiz&quot; ile öğrencinin tüm sınav geçmişini birleştirerek size stratejik bir yol haritası sunuyoruz.
                        </p>

                        {/* Feature Cards */}
                        <div className="grid md:grid-cols-2 gap-6 mb-12">
                            {analysisFeatures.map((feature, index) => (
                                <div
                                    key={index}
                                    className="glass-card rounded-2xl p-6 card-lift group"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Benefit Box */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary-glow/10 to-primary/10 border border-primary/20 p-8">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                            <div className="relative flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-foreground mb-2">Öğrenciye Faydası</h4>
                                    <p className="text-muted-foreground">
                                        Rastgele ders çalışmak yerine, nokta atışı eksiklerine odaklanarak zaman kazanır ve netlerini istikrarlı bir şekilde artırır.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Analysis Section 2 */}
            <section className="py-20 bg-card/50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Section Header */}
                        <div className="flex items-start gap-6 mb-12">
                            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center shadow-lg">
                                <Brain className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                                    2. Derinlemesine Soru Türü Analizi ve Kök Neden Tespiti
                                </h2>
                                <p className="text-lg text-violet-500 italic font-medium">
                                    &quot;Soruyu neden kaçırdığınızı biliyor musunuz?&quot;
                                </p>
                            </div>
                        </div>

                        <p className="text-lg text-muted-foreground mb-12 max-w-4xl">
                            Her yanlış cevap, &quot;bilgi eksikliği&quot; değildir. Bazen dikkat, bazen zaman yönetimi, bazen de sorunun tuzağına düşmek yanlışı getirir.
                            Sektörde bir ilk olan <strong className="text-foreground">7 Kategorili Soru Analiz Sistemimiz</strong> ile yanlışların &quot;DNA&apos;sını&quot; inceliyoruz.
                        </p>

                        {/* Question Types Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-12">
                            {questionTypes.map((type, index) => (
                                <div
                                    key={index}
                                    className="glass-card rounded-xl p-4 text-center card-lift group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-white font-bold">{type.number}</span>
                                    </div>
                                    <h4 className="font-bold text-foreground text-sm mb-1">{type.title}</h4>
                                    <p className="text-xs text-muted-foreground">{type.subtitle}</p>
                                </div>
                            ))}
                        </div>

                        {/* Analysis Features */}
                        <div className="grid md:grid-cols-2 gap-6 mb-12">
                            <div className="glass-card rounded-2xl p-6 card-lift">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center mb-4">
                                    <Search className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Kök Neden Analizi</h3>
                                <p className="text-muted-foreground">
                                    Sadece &quot;yanlış&quot; deyip geçmeyiz. Hatanın kaynağını (Dikkat, Bilgi, Zaman Baskısı, Kavram Yanılgısı) tespit ederiz.
                                </p>
                            </div>

                            <div className="glass-card rounded-2xl p-6 card-lift">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center mb-4">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Kişiselleştirilmiş Çözüm Stratejileri</h3>
                                <p className="text-muted-foreground">
                                    Öğrenciye özel &quot;Dikkat hatalarını azaltmak için soru kökünü daire içine al&quot; veya &quot;Çeldirici sorularda şık eleme yöntemini kullan&quot; gibi somut taktikler veririz.
                                </p>
                            </div>
                        </div>

                        {/* Benefit Box */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500/10 via-purple-400/10 to-violet-500/10 border border-violet-500/20 p-8">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />
                            <div className="relative flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center">
                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-foreground mb-2">Öğrenciye Faydası</h4>
                                    <p className="text-muted-foreground">
                                        Öğrenci &quot;Ben bu konuyu anlamıyorum&quot; yanılgısından kurtulur. Sorunu tam olarak tanımladığı için, aynı hatayı tekrar yapmamayı öğrenir.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                            Ordu Sınav Merkezi&apos;nde tesadüfe yer yok.
                        </h2>
                        <p className="text-lg text-muted-foreground mb-10">
                            Veriye dayalı analizler ve kişiye özel stratejilerle potansiyelinizi zirveye taşıyın.
                            Gelin, eksiklerinizi birlikte keşfedelim ve başarı hikayenizi yazalım.
                        </p>
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 text-white font-semibold px-10 py-6 text-lg btn-glow"
                        >
                            Hemen İletişime Geç
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Exam Types Section */}
            <section className="py-20 bg-card/50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Sınav Türleri
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Tüm önemli sınavlar için kapsamlı analiz ve takip sistemleri
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {examTypes.map((exam, index) => (
                                <div
                                    key={index}
                                    className="glass-card rounded-2xl p-8 card-lift group relative overflow-hidden"
                                    style={{ animationDelay: `${exam.delay}ms` }}
                                >
                                    {/* Background Gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${exam.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                                    <div className="relative">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${exam.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                            <exam.icon className="w-8 h-8 text-white" />
                                        </div>

                                        <h3 className="text-2xl font-bold text-foreground mb-1">{exam.title}</h3>
                                        <p className={`text-sm font-medium mb-4 bg-gradient-to-r ${exam.gradient} bg-clip-text text-transparent`}>
                                            {exam.subtitle}
                                        </p>
                                        <p className="text-muted-foreground mb-6">{exam.description}</p>

                                        <ul className="space-y-3">
                                            {exam.features.map((feature, fIndex) => (
                                                <li key={fIndex} className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${index === 0 ? 'text-primary' :
                                                            index === 1 ? 'text-violet-500' :
                                                                'text-emerald-500'
                                                        }`} />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
}
