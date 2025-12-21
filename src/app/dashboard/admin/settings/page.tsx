"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getSettings, updateSettings } from "@/app/actions/settings"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"

export default function SettingsPage() {
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [settings, setSettings] = useState<Record<string, string>>({})

    useEffect(() => {
        const fetchSettings = async () => {
            const result = await getSettings()
            if (result.success && result.data) {
                setSettings(result.data)
            }
            setLoading(false)
        }
        fetchSettings()
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitting(true)

        const formData = new FormData(e.currentTarget)
        const result = await updateSettings(formData)

        if (result.success) {
            toast.success("Ayarlar başarıyla güncellendi")
        } else {
            toast.error("Ayarlar güncellenirken bir hata oluştu")
        }
        setSubmitting(false)
    }

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Genel Ayarlar</h1>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>İletişim Bilgileri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="address">Adres</Label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    defaultValue={settings.address}
                                    placeholder="Kurum adresi..."
                                    rows={3}
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefon</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        defaultValue={settings.phone}
                                        placeholder="0555 555 55 55"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-posta</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        defaultValue={settings.email}
                                        placeholder="info@ornek.com"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Diğer Ayarlar</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="lgsDate">LGS Tarihi</Label>
                                    <Input
                                        id="lgsDate"
                                        name="lgsDate"
                                        type="datetime-local"
                                        defaultValue={settings.lgsDate}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tytDate">TYT Tarihi</Label>
                                    <Input
                                        id="tytDate"
                                        name="tytDate"
                                        type="datetime-local"
                                        defaultValue={settings.tytDate}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="aytDate">AYT Tarihi</Label>
                                    <Input
                                        id="aytDate"
                                        name="aytDate"
                                        type="datetime-local"
                                        defaultValue={settings.aytDate}
                                    />
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Sayaçlar için kullanılacak tarih ve saatler.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={submitting} size="lg">
                            {submitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Kaydediliyor...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Kaydet
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
