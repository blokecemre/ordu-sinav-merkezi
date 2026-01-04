
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

    const BATCH_SIZE = 1
    let processed = 0
    let hasMore = true

    console.log("Starting slow/safe migration for mistakes...")

    while (hasMore) {
        // Find existing non-migrated items
        const mistakes = await prisma.mistake.findMany({
            where: {
                // @ts-ignore
                imageData: { not: null },
                imageUrl: null
            },
            take: BATCH_SIZE,
            select: {
                id: true,
                imageData: true,
                imageMimeType: true
            }
        })

        if (mistakes.length === 0) {
            hasMore = false
            break
        }

        console.log(`Processing batch of ${mistakes.length}...`)

        for (const mistake of mistakes) {
            if (!mistake.imageData) continue

            const buffer = mistake.imageData
            const mimeType = mistake.imageMimeType || "image/jpeg"
            const ext = mimeType.split('/')[1] || 'jpg'
            const key = `mistakes/legacy-${Date.now()}-${mistake.id}.${ext}`

            try {
                // 1. Upload to R2
                await s3Client.send(new PutObjectCommand({
                    Bucket: R2_BUCKET_NAME,
                    Key: key,
                    Body: buffer,
                    ContentType: mimeType,
                }))

                const publicUrl = R2_PUBLIC_URL
                    ? `${R2_PUBLIC_URL}/${key}`
                    : key

                // 2. Update DB
                await prisma.mistake.update({
                    where: { id: mistake.id },
                    data: {
                        imageUrl: publicUrl,
                        imageData: null
                    }
                })

                console.log(`✅ Success: ${mistake.id} -> ${publicUrl}`)
            } catch (err) {
                console.error(`❌ Failed: ${mistake.id}`, err)
            }
        }

        processed += mistakes.length
        console.log(`Batch complete. Total processed so far: ${processed}`)

        // Wait 1s to be gentle
        await new Promise(r => setTimeout(r, 1000))
    }

    console.log("Mistake migration complete.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
