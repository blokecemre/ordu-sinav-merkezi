"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import * as XLSX from "xlsx"

export function AdminPerformanceExportButton({ data }: { data: any[] }) {
    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "TumVeriler")
        XLSX.writeFile(wb, "tum_ogrenci_verileri.xlsx")
    }

    return (
        <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white gap-2">
            <Download className="w-4 h-4" />
            Tüm Verileri İndir (.xlsx)
        </Button>
    )
}
