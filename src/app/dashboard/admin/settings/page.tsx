"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSystemSetting, setSystemSetting } from "@/app/actions/settings"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [lgsDate, setLgsDate] = useState("")

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true)
            const result = await getSystemSetting("lgsDate")
            if (result.success && result.value) {
                setLgsDate(result.value)
            }
            setLoading(false)
        }
        fetchSettings()
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const result = await setSystemSetting("lgsDate", lgsDate)

        if (result.success) {
            toast.success("Ayarlar başarıyla kaydedildi")
        } else {
            toast.error("Ayarlar kaydedilirken bir hata oluştu")
        }
        setSaving(false)
    }

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Ayarlar</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Genel Ayarlar</CardTitle>
                    <CardDescription>
                        Sistem genelindeki ayarları buradan yönetebilirsiniz.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="lgsDate">LGS Sınav Tarihi ve Saati</Label>
                            <Input
                                id="lgsDate"
                                type="datetime-local"
                                value={lgsDate}
                                onChange={(e) => setLgsDate(e.target.value)}
                                required
                            />
                            <p className="text-sm text-muted-foreground">
                                Hakkımızda sayfasındaki geri sayım sayacı için kullanılır.
                            </p>
                        </div>

                        <Button type="submit" disabled={saving}>
                            {saving ? (
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
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
