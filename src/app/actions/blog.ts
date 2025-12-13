"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const BlogPostSchema = z.object({
    title: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
    slug: z.string().min(3, "Slug en az 3 karakter olmalıdır"),
    content: z.string().min(10, "İçerik en az 10 karakter olmalıdır"),
    excerpt: z.string().optional(),
    author: z.string().optional(),
    published: z.boolean().default(false),
})

export async function getBlogPosts(page = 1, limit = 10, publishedOnly = true) {
    try {
        const skip = (page - 1) * limit
        const where = publishedOnly ? { published: true } : {}

        const [posts, total] = await Promise.all([
            prisma.blogPost.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    excerpt: true,
                    author: true,
                    published: true,
                    createdAt: true,
                    updatedAt: true,
                    content: true, // Needed for excerpt generation if excerpt is empty
                    imageData: false, // Don't fetch heavy image data
                    imageMimeType: true
                }
            }),
            prisma.blogPost.count({ where })
        ])

        return {
            success: true,
            data: posts,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit
            }
        }
    } catch (error) {
        console.error("Error fetching blog posts:", error)
        return { success: false, error: "Blog yazıları getirilemedi" }
    }
}

export async function getBlogPost(slug: string) {
    try {
        const post = await prisma.blogPost.findUnique({
            where: { slug },
            select: {
                id: true,
                title: true,
                slug: true,
                content: true,
                excerpt: true,
                author: true,
                published: true,
                createdAt: true,
                updatedAt: true,
                imageData: false,
                imageMimeType: true
            }
        })

        if (!post) {
            return { success: false, error: "Yazı bulunamadı" }
        }

        return { success: true, data: post }
    } catch (error) {
        console.error("Error fetching blog post:", error)
        return { success: false, error: "Blog yazısı getirilemedi" }
    }
}

export async function createBlogPost(formData: FormData) {
    try {
        const title = formData.get("title") as string
        const slug = formData.get("slug") as string
        const content = formData.get("content") as string
        const excerpt = formData.get("excerpt") as string
        const author = formData.get("author") as string
        const published = formData.get("published") === "true"
        const imageFile = formData.get("image") as File | null

        const validated = BlogPostSchema.safeParse({
            title,
            slug,
            content,
            excerpt,
            author,
            published
        })

        if (!validated.success) {
            return { success: false, error: "Geçersiz veri: " + JSON.stringify(validated.error.flatten().fieldErrors) }
        }

        // Check if slug exists
        const existing = await prisma.blogPost.findUnique({
            where: { slug: validated.data.slug }
        })

        if (existing) {
            return { success: false, error: "Bu URL adresi zaten kullanımda" }
        }

        let imageData: Buffer | undefined
        let imageMimeType: string | undefined

        if (imageFile && imageFile.size > 0) {
            imageData = Buffer.from(await imageFile.arrayBuffer())
            imageMimeType = imageFile.type
        }

        const post = await prisma.blogPost.create({
            data: {
                ...validated.data,
                author: validated.data.author || "Ordu Sınav Merkezi",
                imageData: imageData as any,
                imageMimeType
            }
        })

        revalidatePath("/blog")
        revalidatePath("/dashboard/admin/blog")
        return { success: true, data: post }
    } catch (error) {
        console.error("Error creating blog post:", error)
        return { success: false, error: "Blog yazısı oluşturulamadı" }
    }
}

export async function updateBlogPost(id: string, formData: FormData) {
    try {
        const title = formData.get("title") as string
        const slug = formData.get("slug") as string
        const content = formData.get("content") as string
        const excerpt = formData.get("excerpt") as string
        const author = formData.get("author") as string
        const published = formData.get("published") === "true"
        const imageFile = formData.get("image") as File | null

        // We only validate fields that are present, but for update we might want to validate all if we are replacing
        // But here we are constructing the object from form data, so it's similar to create
        const validated = BlogPostSchema.safeParse({
            title,
            slug,
            content,
            excerpt,
            author,
            published
        })

        if (!validated.success) {
            return { success: false, error: "Geçersiz veri" }
        }

        // Check if slug exists (if changing slug)
        if (validated.data.slug) {
            const existing = await prisma.blogPost.findUnique({
                where: { slug: validated.data.slug }
            })

            if (existing && existing.id !== id) {
                return { success: false, error: "Bu URL adresi zaten kullanımda" }
            }
        }

        const updateData: any = {
            ...validated.data,
            author: validated.data.author || "Ordu Sınav Merkezi"
        }

        if (imageFile && imageFile.size > 0) {
            updateData.imageData = Buffer.from(await imageFile.arrayBuffer())
            updateData.imageMimeType = imageFile.type
        }

        const post = await prisma.blogPost.update({
            where: { id },
            data: updateData
        })

        revalidatePath("/blog")
        revalidatePath(`/blog/${post.slug}`)
        revalidatePath("/dashboard/admin/blog")
        return { success: true, data: post }
    } catch (error) {
        console.error("Error updating blog post:", error)
        return { success: false, error: "Blog yazısı güncellenemedi" }
    }
}

export async function deleteBlogPost(id: string) {
    try {
        await prisma.blogPost.delete({
            where: { id }
        })

        revalidatePath("/blog")
        revalidatePath("/dashboard/admin/blog")
        return { success: true, message: "Blog yazısı silindi" }
    } catch (error) {
        console.error("Error deleting blog post:", error)
        return { success: false, error: "Blog yazısı silinemedi" }
    }
}

export async function toggleBlogPostPublish(id: string, published: boolean) {
    try {
        await prisma.blogPost.update({
            where: { id },
            data: { published }
        })

        revalidatePath("/blog")
        revalidatePath("/dashboard/admin/blog")
        return { success: true, message: "Yayın durumu güncellendi" }
    } catch (error) {
        console.error("Error toggling blog post publish status:", error)
        return { success: false, error: "Yayın durumu güncellenemedi" }
    }
}
