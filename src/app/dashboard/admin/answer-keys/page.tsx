"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, Trash2, FileText } from "lucide-react"
import { uploadAnswerKey, deleteAnswerKey, getAnswerKeys } from "@/app/actions/answer-key"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

// We need to fetch keys client side or pass them as props. 
// Since this is a client component for the form, let's fetch data here or make it a server component with client islands.
// Let's make this a client component for simplicity of state management for upload, 
// but ideally we should separate the list (server) and form (client).
// For now, I'll implement a hybrid approach where I fetch data on mount/update.

export default function AdminAnswerKeysPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const [keys, setKeys] = useState<any[]>([])

    const fetchKeys = async () => {
        const result = await getAnswerKeys()
        if (result.success) {
            setKeys(result.data || [])
        }
    }

    useEffect(() => {
        fetchKeys()
    }, [])

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        const formData = new FormData(e.currentTarget)
        const result = await uploadAnswerKey(formData)

        if (result.success) {
            setSuccess(result.message)
            formRef.current?.reset()
            fetchKeys()
        } else {
            setError(result.error || "Bir hata oluştu")
        }
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Bu cevap anahtarını silmek istediğinize emin misiniz?")) return

        const result = await deleteAnswerKey(id)
        if (result.success) {
            fetchKeys()
        } else {
            alert("Silme başarısız: " + result.error)
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Cevap Anahtarları Yönetimi</h1>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Upload Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Yeni Cevap Anahtarı Yükle</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form ref={formRef} onSubmit={handleUpload} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            {success && (
                                <Alert className="bg-green-50 text-green-900 border-green-200">
                                    <AlertDescription>{success}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="title">Başlık</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="Örn: 8. Sınıf Deneme 1 Cevap Anahtarı"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="file">PDF Dosyası</Label>
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept="application/pdf"
                                    required
                                />
                            </div>

                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Yükleniyor...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Yükle
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Mevcut Cevap Anahtarları</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                            {keys.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">
                                    Henüz cevap anahtarı yüklenmemiş.
                                </p>
                            ) : (
                                keys.map((key) => (
                                    <div
                                        key={key.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FileText className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium truncate" title={key.title}>
                                                    {key.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(key.createdAt).toLocaleDateString("tr-TR")}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(key.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
