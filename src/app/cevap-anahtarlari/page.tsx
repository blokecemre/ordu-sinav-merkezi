import { SiteHeader } from "@/components/SiteHeader"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FileText, Search, Download } from "lucide-react"
import { getAnswerKeys } from "@/app/actions/answer-key"
import Link from "next/link"

export default async function AnswerKeysPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q } = await searchParams
    const { data: keys } = await getAnswerKeys(q)

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <SiteHeader />

            <main className="flex-1 container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-blue-600 mb-4">
                        Aşağıdaki tablodan dilediğiniz cevap anahtarını inceleyebilir yada indirebilirsiniz.
                    </h1>
                    <p className="text-gray-600">
                        Buradan arama yapabilir yada direkt aşağıdaki tablodan bakabilirsiniz.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto mb-8">
                    <form className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            name="q"
                            defaultValue={q}
                            placeholder="ARA..."
                            className="pl-12 h-14 text-lg rounded-full shadow-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </form>
                </div>

                <div className="max-w-4xl mx-auto space-y-4">
                    {keys && keys.length > 0 ? (
                        keys.map((key) => (
                            <div
                                key={key.id}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow"
                            >
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate" title={key.title}>
                                        {key.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(key.createdAt).toLocaleDateString("tr-TR")}
                                    </p>
                                </div>
                                <Link href={`/api/answer-key/${key.id}`} target="_blank">
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Download className="w-4 h-4" />
                                        İndir
                                    </Button>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed">
                            <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>Aradığınız kriterlere uygun cevap anahtarı bulunamadı.</p>
                        </div>
                    )}
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
