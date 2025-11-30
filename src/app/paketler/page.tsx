import { SiteHeader } from "@/components/SiteHeader"
import { getPackages } from "@/app/actions/package"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ShoppingCart } from "lucide-react"

export default async function PackagesPage() {
    const result = await getPackages()
    const packages = result.success ? result.data : []

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <SiteHeader />

            <main className="flex-1 container mx-auto px-4 py-12">
                <div className="bg-[#b9009a] text-white p-4 rounded-t-lg flex items-center gap-2 mb-0">
                    <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                        <div className="w-1 h-3 bg-white rotate-45 transform origin-bottom translate-y-[-2px] translate-x-[1px]"></div>
                    </div>
                    <h1 className="text-xl font-medium">Kamp Paketleri</h1>
                </div>

                <div className="bg-white rounded-b-lg shadow-sm p-8 space-y-12">
                    {packages && packages.length > 0 ? (
                        packages.map((pkg: any) => (
                            <div key={pkg.id} className="flex flex-col md:flex-row gap-8 items-start border-b pb-12 last:border-0 last:pb-0">
                                {/* Left: Image */}
                                <div className="w-full md:w-1/3 flex-shrink-0">
                                    <div className="aspect-square relative rounded-xl overflow-hidden shadow-md">
                                        <img
                                            src={`/api/package/${pkg.id}/image`}
                                            alt={pkg.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Right: Content */}
                                <div className="flex-1 space-y-6 w-full">
                                    <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide text-center md:text-left">
                                        {pkg.title}
                                    </h2>

                                    <div className="prose prose-gray max-w-none">
                                        {/* We'll split by newlines and render as list items if they look like list items, or just paragraphs */}
                                        <div className="space-y-3">
                                            {pkg.description.split('\n').map((line: string, i: number) => {
                                                if (line.trim().length === 0) return <br key={i} />;
                                                return (
                                                    <div key={i} className="flex items-start gap-2 text-gray-600">
                                                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                        <span>{line}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>


                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 text-gray-500">
                            <p className="text-xl">Henüz aktif paket bulunmamaktadır.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
