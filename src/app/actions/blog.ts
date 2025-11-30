"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const BlogPostSchema = z.object({
    title: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
    slug: z.string().min(3, "Slug en az 3 karakter olmalıdır"),
    content: z.string().min(10, "İçerik en az 10 karakter olmalıdır"),
    excerpt: z.string().optional(),
    imageUrl: z.string().url("Geçersiz resim URL'si").optional().or(z.literal("")),
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
            where: { slug }
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

export async function createBlogPost(data: z.infer<typeof BlogPostSchema>) {
    try {
        const validated = BlogPostSchema.safeParse(data)

        if (!validated.success) {
            return { success: false, error: "Geçersiz veri" }
        }

        // Check if slug exists
        const existing = await prisma.blogPost.findUnique({
            where: { slug: validated.data.slug }
        })

        if (existing) {
            return { success: false, error: "Bu URL adresi zaten kullanımda" }
        }

        const post = await prisma.blogPost.create({
            data: validated.data
        })

        revalidatePath("/blog")
        revalidatePath("/dashboard/admin/blog")
        return { success: true, data: post }
    } catch (error) {
        console.error("Error creating blog post:", error)
        return { success: false, error: "Blog yazısı oluşturulamadı" }
    }
}

export async function updateBlogPost(id: string, data: Partial<z.infer<typeof BlogPostSchema>>) {
    try {
        // Check if slug exists (if changing slug)
        if (data.slug) {
            const existing = await prisma.blogPost.findUnique({
                where: { slug: data.slug }
            })

            if (existing && existing.id !== id) {
                return { success: false, error: "Bu URL adresi zaten kullanımda" }
            }
        }

        const post = await prisma.blogPost.update({
            where: { id },
            data
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
