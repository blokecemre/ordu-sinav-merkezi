"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPartners, createPartner, deletePartner } from "@/app/actions/partner"
import { Loader2, Plus, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function AdminPartnersPage() {
    const [partners, setPartners] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        url: "",
    })
    const [logoFile, setLogoFile] = useState<File | null>(null)

    const fetchPartners = async () => {
        setLoading(true)
        const result = await getPartners()
        if (result.success) {
            setPartners(result.data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchPartners()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setSubmitting(true)
        const data = new FormData()
        data.append("name", formData.name)
        data.append("url", formData.url)
        if (logoFile) {
            data.append("logo", logoFile)
        }

        const result = await createPartner(data)

        if (result.success) {
            toast.success("Partner başarıyla eklendi")
            setIsDialogOpen(false)
            setFormData({ name: "", url: "" })
            setLogoFile(null)
            fetchPartners()
        } else {
            toast.error(result.error || "Bir hata oluştu")
        }
        setSubmitting(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Bu partneri silmek istediğinize emin misiniz?")) return

        const result = await deletePartner(id)
        if (result.success) {
            toast.success("Partner silindi")
            fetchPartners()
        } else {
            toast.error("Silme işlemi başarısız")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Partner Yönetimi</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni Partner Ekle
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Yeni Partner Ekle</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Yayıncı Adı</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="Örn: Algoritma Yayınları"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="url">Web Sitesi (URL)</Label>
                                <Input
                                    id="url"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={submitting}>
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Ekleniyor...
                                    </>
                                ) : (
                                    "Ekle"
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {partners.map((partner) => (
                        <Card key={partner.id} className="overflow-hidden group relative">
                            <div className="text-center w-full">
                                <p className="font-bold text-sm truncate" title={partner.name}>
                                    {partner.name}
                                </p>
                                {partner.url && (
                                    <a href={partner.url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline truncate block max-w-full">
                                        {partner.url}
                                    </a>
                                )}
                            </div>

                            <div className="p-3 text-center border-t">
                                <p className="font-medium text-sm truncate" title={partner.name}>
                                    {partner.name}
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                                onClick={() => handleDelete(partner.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </Card>
                    ))}
                    {partners.length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted-foreground bg-gray-50 rounded-lg border border-dashed">
                            Henüz hiç partner eklenmemiş.
                        </div>
                    )}
                </div>
            )
            }
        </div >
    )
}
