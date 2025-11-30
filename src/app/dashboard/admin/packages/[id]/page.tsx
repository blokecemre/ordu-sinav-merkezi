import { PackageForm } from "@/components/admin/PackageForm"
import { updatePackage, getPackage } from "@/app/actions/package"
import { notFound } from "next/navigation"

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const result = await getPackage(id)

    if (!result.success || !result.data) {
        notFound()
    }

    const handleSubmit = async (formData: FormData) => {
        "use server"
        return await updatePackage(id, formData)
    }

    return <PackageForm initialData={result.data} onSubmit={handleSubmit} />
}
