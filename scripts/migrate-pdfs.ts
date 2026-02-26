import { PrismaClient } from '@prisma/client'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME

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

const prisma = new PrismaClient()

async function uploadToR2(
    fileBuffer: Buffer | Uint8Array,
    fileName: string,
    contentType: string,
    folder: string
): Promise<string | null> {
    if (!s3Client || !R2_BUCKET_NAME) {
        console.warn("R2 credentials not configured. Skipping R2 upload.")
        return null
    }

    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_")
    const key = `${folder}/${Date.now()}-${sanitizedFileName}`

    try {
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            Body: fileBuffer,
            ContentType: contentType,
        })
        await s3Client.send(command)
        return `/api/images?key=${key}`
    } catch (error) {
        console.error("Error uploading to R2:", error)
        return null
    }
}

async function migrateExams() {
    console.log("--- Migrating Exams ---")
    const exams = await prisma.exam.findMany({
        where: {
            pdfData: { not: null },
            pdfUrl: null
        }
    })
    console.log(`Found ${exams.length} exams to migrate.`)

    for (const exam of exams) {
        if (!exam.pdfData) continue
        console.log(`Migrating Exam: ${exam.name} (${exam.id})`)

        const url = await uploadToR2(
            exam.pdfData,
            exam.pdfName || "exam.pdf",
            exam.pdfMimeType || "application/pdf",
            "exams"
        )

        if (url) {
            await prisma.exam.update({
                where: { id: exam.id },
                data: {
                    pdfUrl: url,
                    pdfData: null // Free up DB space
                }
            })
            console.log(`  -> Success. URL: ${url}. DB data cleared.`)
        } else {
            console.error(`  -> Failed to upload to R2.`)
        }
    }
}

async function migrateAnswerKeys() {
    console.log("\n--- Migrating Answer Keys ---")
    const keys = await prisma.answerKey.findMany({
        where: {
            pdfData: { not: null },
            pdfUrl: null
        }
    })
    console.log(`Found ${keys.length} answer keys to migrate.`)

    for (const key of keys) {
        if (!key.pdfData) continue
        console.log(`Migrating Answer Key: ${key.title} (${key.id})`)

        const url = await uploadToR2(
            key.pdfData,
            key.pdfName || "answer-key.pdf",
            key.pdfMimeType || "application/pdf",
            "answer-keys"
        )

        if (url) {
            await prisma.answerKey.update({
                where: { id: key.id },
                data: {
                    pdfUrl: url,
                    pdfData: null // Free up DB space
                }
            })
            console.log(`  -> Success. URL: ${url}. DB data cleared.`)
        } else {
            console.error(`  -> Failed to upload to R2.`)
        }
    }
}

async function migrateResults() {
    console.log("\n--- Migrating Student Results ---")
    const results = await prisma.result.findMany({
        where: {
            resultPdfData: { not: null },
            resultPdfUrl: null
        }
    })
    console.log(`Found ${results.length} results with PDFs to migrate.`)

    for (const result of results) {
        if (!result.resultPdfData) continue
        console.log(`Migrating Result: ${result.id}`)

        const url = await uploadToR2(
            result.resultPdfData,
            result.resultPdfName || "result.pdf",
            result.resultPdfMimeType || "application/pdf",
            "results"
        )

        if (url) {
            await prisma.result.update({
                where: { id: result.id },
                data: {
                    resultPdfUrl: url,
                    resultPdfData: null // Free up DB space
                }
            })
            console.log(`  -> Success. URL: ${url}. DB data cleared.`)
        } else {
            console.error(`  -> Failed to upload to R2.`)
        }
    }
}

async function main() {
    console.log("Starting R2 Migration...")
    if (!s3Client) {
        console.error("R2 CLOUD STORAGE NOT CONFIGURED. Aborting.")
        process.exit(1)
    }

    await migrateExams()
    await migrateAnswerKeys()
    await migrateResults()

    console.log("\nMigration completed successfully.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
