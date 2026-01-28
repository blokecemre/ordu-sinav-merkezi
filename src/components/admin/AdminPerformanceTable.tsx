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
import { Trash2, Loader2, Download, Pencil, Save } from "lucide-react"
import { deleteActivity, updateActivity } from "@/app/actions/performance"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
    logs: any[]
}

export function AdminPerformanceTable({ logs }: Props) {
    const [loading, setLoading] = useState<string | null>(null)
    const [editingLog, setEditingLog] = useState<any | null>(null)
    const [editValues, setEditValues] = useState({ correct: 0, wrong: 0, reading: 0 })
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleDelete = async (id: string) => {
        if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return

        setLoading(id)
        const result = await deleteActivity(id)
        setLoading(null)

        if (result.success) {
            toast.success("Kayıt silindi.")
            window.location.reload()
        } else {
            toast.error(result.message)
        }
    }

    const handleEditClick = (log: any) => {
        setEditingLog(log)
        setEditValues({
            correct: log.correctCount,
            wrong: log.wrongCount,
            reading: log.readingPage
        })
        setIsDialogOpen(true)
    }

    const handleUpdate = async () => {
        if (!editingLog) return

        setLoading("update")
        const result = await updateActivity({
            id: editingLog.id,
            correctCount: editValues.correct,
            wrongCount: editValues.wrong,
            readingPage: editValues.reading
        })
        setLoading(null)

        if (result.success) {
            toast.success("Kayıt güncellendi.")
            setIsDialogOpen(false)
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
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                                onClick={() => handleEditClick(log)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(log.id)}
                                                disabled={loading === log.id}
                                            >
                                                {loading === log.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Kayıt Düzenle</DialogTitle>
                        <DialogDescription>
                            {editingLog && `${format(new Date(editingLog.date), "d MMM HH:mm", { locale: tr })} - ${editingLog.subject.name}`}
                        </DialogDescription>
                    </DialogHeader>
                    {editingLog && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="correct" className="text-right text-green-600 font-bold">
                                    Doğru
                                </Label>
                                <Input
                                    id="correct"
                                    type="number"
                                    value={editValues.correct}
                                    onChange={(e) => setEditValues({ ...editValues, correct: parseInt(e.target.value) || 0 })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="wrong" className="text-right text-red-600 font-bold">
                                    Yanlış
                                </Label>
                                <Input
                                    id="wrong"
                                    type="number"
                                    value={editValues.wrong}
                                    onChange={(e) => setEditValues({ ...editValues, wrong: parseInt(e.target.value) || 0 })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="reading" className="text-right text-blue-600 font-bold">
                                    Okuma
                                </Label>
                                <Input
                                    id="reading"
                                    type="number"
                                    value={editValues.reading}
                                    onChange={(e) => setEditValues({ ...editValues, reading: parseInt(e.target.value) || 0 })}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>İptal</Button>
                        <Button onClick={handleUpdate} disabled={loading === "update"}>
                            {loading === "update" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Güncelle
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
