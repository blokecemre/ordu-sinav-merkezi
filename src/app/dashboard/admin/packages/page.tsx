"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getPackages, deletePackage } from "@/app/actions/package"
import { Loader2, Plus, Trash2, Edit } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function AdminPackagesPage() {
    const [packages, setPackages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchPackages = async () => {
        setLoading(true)
        const result = await getPackages()
        if (result.success) {
            setPackages(result.data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchPackages()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("Bu paketi silmek istediğinize emin misiniz?")) return

        const result = await deletePackage(id)
        if (result.success) {
            toast.success("Paket silindi")
            fetchPackages()
        } else {
            toast.error("Silme işlemi başarısız")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Paket Yönetimi</h1>
                <Link href="/dashboard/admin/packages/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Paket Ekle
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                        <Card key={pkg.id} className="overflow-hidden flex flex-col">
                            <div className="aspect-video relative bg-gray-100">
                                <img
                                    src={`/api/package/${pkg.id}/image`}
                                    alt={pkg.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg mb-2">{pkg.title}</h3>
                                <div className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
                                    {pkg.description}
                                </div>
                                <div className="flex justify-end gap-2 pt-2 border-t">
                                    <Link href={`/dashboard/admin/packages/${pkg.id}`}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="h-4 w-4 mr-1" />
                                            Düzenle
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(pkg.id)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Sil
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {packages.length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted-foreground bg-gray-50 rounded-lg border border-dashed">
                            Henüz hiç paket eklenmemiş.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
