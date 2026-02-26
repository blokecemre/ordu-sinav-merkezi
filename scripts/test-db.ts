import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })
const prisma = new PrismaClient()

async function main() {
    const results = await prisma.result.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
            id: true,
            studentId: true,
            resultPdfUrl: true,
            resultPdfName: true,
        }
    })
    console.log("Latest 5 results:")
    console.dir(results, { depth: null })
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
