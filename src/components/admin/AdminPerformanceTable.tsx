"use client"

import { useState } from "react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2, Download } from "lucide-react"
import { deleteActivity } from "@/app/actions/performance"
import { toast } from "sonner"
import * as XLSX from "xlsx"

interface Props {
    logs: any[]
}

export function AdminPerformanceTable({ logs }: Props) {
    const [loading, setLoading] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return

        setLoading(id)
        const result = await deleteActivity(id)
        setLoading(null)

        if (result.success) {
            toast.success("Kayıt silindi.")
            // Ideally we should refresh the page here
            window.location.reload()
        } else {
            toast.error(result.message)
        }
    }

    const handleExport = () => {
        const data = logs.map(log => ({
            Tarih: format(new Date(log.date), "d.MM.yyyy HH:mm"),
            Ders: log.subject.name,
            Doğru: log.correctCount,
            Yanlış: log.wrongCount,
            "Okuma (Sayfa)": log.readingPage
        }))

        const ws = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Performans")
        XLSX.writeFile(wb, "ogrenci_performans_verileri.xlsx")
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button variant="outline" onClick={handleExport} className="gap-2">
                    <Download className="w-4 h-4" />
                    Excel İndir
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tarih</TableHead>
                            <TableHead>Ders</TableHead>
                            <TableHead className="text-center">Doğru</TableHead>
                            <TableHead className="text-center">Yanlış</TableHead>
                            <TableHead className="text-center">Okuma</TableHead>
                            <TableHead className="text-right">İşlem</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                    Henüz kayıt bulunmuyor.
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>
                                        {format(new Date(log.date), "d MMM yyyy HH:mm", { locale: tr })}
                                    </TableCell>
                                    <TableCell className="font-medium">{log.subject.name}</TableCell>
                                    <TableCell className="text-center text-green-600 font-bold">{log.correctCount}</TableCell>
                                    <TableCell className="text-center text-red-600 font-bold">{log.wrongCount}</TableCell>
                                    <TableCell className="text-center text-blue-600 font-bold">{log.readingPage}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(log.id)}
                                            disabled={loading === log.id}
                                        >
                                            {loading === log.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
