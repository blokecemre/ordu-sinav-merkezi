import { BlogForm } from "@/components/admin/BlogForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function EditBlogPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const post = await prisma.blogPost.findUnique({
        where: { id }
    })

    if (!post) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Blog Yazısını Düzenle</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Yazı Detayları</CardTitle>
                </CardHeader>
                <CardContent>
                    <BlogForm initialData={post} />
                </CardContent>
            </Card>
        </div>
    )
}
