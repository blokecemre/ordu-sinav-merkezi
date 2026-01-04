
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const mistakes = await prisma.mistake.findMany({
        where: {
            imageUrl: {
                contains: "r2.dev"
            }
        }
    })

    console.log(`Found ${mistakes.length} mistakes with R2 URLs. Updating to Proxy URLs...`)

    for (const mistake of mistakes) {
        if (!mistake.imageUrl) continue

        // Extract key from URL
        // Old: https://pub-xxx.r2.dev/mistakes/legacy-123.jpg
        // Key: mistakes/legacy-123.jpg

        let key = ""
        if (mistake.imageUrl.includes("/mistakes/")) {
            const parts = mistake.imageUrl.split("/mistakes/")
            if (parts.length > 1) {
                key = "mistakes/" + parts[1]
            }
        }

        if (!key) {
            console.log(`Skipping invalid URL format: ${mistake.imageUrl}`)
            continue
        }

        const newUrl = `/api/images?key=${key}`

        await prisma.mistake.update({
            where: { id: mistake.id },
            data: { imageUrl: newUrl }
        })

        console.log(`Updated ${mistake.id}: ${key}`)
    }

    // --- Fix Exams ---
    const exams = await prisma.exam.findMany({
        where: {
            pdfUrl: {
                contains: "r2.dev"
            }
        }
    })

    console.log(`Found ${exams.length} exams with R2 URLs. Updating...`)

    for (const exam of exams) {
        if (!exam.pdfUrl) continue

        let key = ""
        // Exams might be stored differently? Let's assume URL structure is similar
        // https://pub.../exams/file.pdf or just key
        // We need to parse relative to domain.

        const urlObj = new URL(exam.pdfUrl)
        // pathname starts with /
        key = urlObj.pathname.substring(1) // remove leading slash

        if (!key) {
            console.log(`Skipping invalid Exam URL: ${exam.pdfUrl}`)
            continue
        }

        const newUrl = `/api/images?key=${key}`

        await prisma.exam.update({
            where: { id: exam.id },
            data: { pdfUrl: newUrl }
        })
        console.log(`Updated Exam ${exam.id}: ${key}`)
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
