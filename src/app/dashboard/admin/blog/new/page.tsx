import { BlogForm } from "@/components/admin/BlogForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewBlogPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Yeni Blog Yazısı</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Yazı Detayları</CardTitle>
                </CardHeader>
                <CardContent>
                    <BlogForm />
                </CardContent>
            </Card>
        </div>
    )
}
