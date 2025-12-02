import { SiteHeader } from "@/components/SiteHeader"
import { getStudyPlan } from "@/app/actions/study-plan"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, BookOpen, Lock } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const DAYS = [
    "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"
]

export default async function StudyPlanPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <SiteHeader />
                <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
                    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Giriş Yapmalısınız</h1>
                        <p className="text-gray-600 mb-6">
                            Size özel çalışma planınızı görüntülemek için lütfen giriş yapın.
                        </p>
                        <Link href="/login">
                            <Button className="w-full">Giriş Yap</Button>
                        </Link>
                    </div>
                </main>
            </div>
        )
    }

    const { data: items } = await getStudyPlan(session.user.id)

    // Group by day
    const plan: { [key: string]: any[] } = {}
    DAYS.forEach(day => plan[day] = [])

    if (items) {
        items.forEach((item: any) => {
            if (!plan[item.day]) plan[item.day] = []
            plan[item.day].push(item)
        })
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <SiteHeader />

            <main className="flex-1 container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Haftalık Ders Çalışma Programı</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Sayın <span className="font-semibold text-gray-900">{session.user.name}</span>, başarıya giden yolda planlı çalışmak en önemli adımdır. Sizin için hazırladığımız haftalık programı aşağıdan inceleyebilirsiniz.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {DAYS.map(day => (
                        <Card key={day} className="overflow-hidden hover:shadow-md transition-shadow duration-300 border-t-4 border-t-blue-600">
                            <CardHeader className="bg-white border-b pb-4">
                                <CardTitle className="text-xl text-center text-gray-800">{day}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {plan[day]?.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400 text-sm italic">
                                        Bugün için planlanmış ders yok.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {plan[day]?.map((lesson, index) => (
                                            <div key={index} className="p-4 flex items-center justify-between hover:bg-blue-50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                                        {index + 1}
                                                    </div>
                                                    <span className="font-medium text-gray-700">{lesson.subject}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    <Clock className="w-3 h-3" />
                                                    {lesson.duration} dk
                                                </div>
                                            </div>
                                        ))}
                                        <div className="p-4 bg-gray-50 text-center text-sm font-medium text-gray-600 border-t">
                                            Toplam: {plan[day]?.reduce((acc: any, curr: any) => acc + curr.duration, 0)} dk
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>

            <footer className="bg-gray-900 text-white py-8 mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-400 text-sm">
                        © 2024 Ordu Sınav Merkezi. Tüm hakları saklıdır.
                    </p>
                </div>
            </footer>
        </div>
    )
}
