"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export function PrintStudyPlanButton() {
    return (
        <Button
            variant="outline"
            size="sm"
            className="gap-2 print-hidden"
            onClick={() => window.print()}
        >
            <Printer className="w-4 h-4" />
            Yazdır
        </Button>
    )
}
