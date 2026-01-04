
import { PrismaClient } from "@prisma/client"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import dotenv from "dotenv"

dotenv.config()

const prisma = new PrismaClient()

// R2 Setup
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL

const s3Client = (R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY)
    ? new S3Client({
        region: "auto",
        endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: R2_ACCESS_KEY_ID,
            secretAccessKey: R2_SECRET_ACCESS_KEY,
        },
    })
    : null

async function main() {
    if (!s3Client || !R2_BUCKET_NAME) {
        throw new Error("R2 Credentials invalid")
    }

    // Find exams with data in DB but NO url
    const exams = await prisma.exam.findMany({
        where: {
            pdfData: { not: null },
            pdfUrl: null
        },
        select: {
            id: true,
            name: true,
            pdfName: true,
            pdfMimeType: true,
            pdfData: true
        }
    })

    console.log(`Found ${exams.length} exams to migrate.`)

    for (const exam of exams) {
        if (!exam.pdfData) continue

        console.log(`Migrating: ${exam.name} (${exam.id})...`)

        const fileName = exam.pdfName || `exam-${exam.id}.pdf`
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_")
        const key = `exams/legacy-${Date.now()}-${sanitizedFileName}`

        try {
            // 1. Upload to R2
            await s3Client.send(new PutObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: key,
                Body: exam.pdfData,
                ContentType: exam.pdfMimeType || 'application/pdf',
            }))

            const publicUrl = R2_PUBLIC_URL
                ? `${R2_PUBLIC_URL}/${key}`
                : key // Fallback

            // 2. Update DB: Set URL, Clear Data
            await prisma.exam.update({
                where: { id: exam.id },
                data: {
                    pdfUrl: publicUrl,
                    pdfData: null // CLEAR DB STORAGE
                }
            })

            console.log(`✅ Success: ${exam.name} -> ${publicUrl}`)

        } catch (err) {
            console.error(`❌ Failed: ${exam.name}`, err)
        }
    }

    console.log("Migration complete.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
