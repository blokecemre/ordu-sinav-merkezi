import { getStudyPlan } from "@/app/actions/study-plan"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

const DAYS = [
    "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"
]

export default async function StudentStudyPlanPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect("/login")
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
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Ders Çalışma Programı</h1>
                <p className="text-muted-foreground">
                    Haftalık ders çalışma programınızı buradan takip edebilirsiniz.
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
                                        <div key={index} className="border-b last:border-0 hover:bg-blue-50 transition-colors">
                                            <div className="p-4 flex items-center justify-between">
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
                                            {lesson.outcome && (
                                                <div className="px-4 pb-3 text-xs text-muted-foreground pl-14">
                                                    <div className="bg-blue-50 p-2 rounded text-blue-700 border border-blue-100">
                                                        {lesson.outcome}
                                                    </div>
                                                </div>
                                            )}
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
        </div >
    )
}
