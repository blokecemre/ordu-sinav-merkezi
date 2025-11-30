"use client"

import { PackageForm } from "@/components/admin/PackageForm"
import { createPackage } from "@/app/actions/package"

export default function NewPackagePage() {
    return <PackageForm onSubmit={createPackage} />
}
