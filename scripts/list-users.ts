
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany({
        take: 50,
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            username: true,
            name: true,
            surname: true,
            role: true,
            createdAt: true
        }
    })

    console.log("Latest 50 Users:")
    users.forEach(u => {
        console.log(`[${u.role}] ${u.username} (${u.name} ${u.surname})`)
    })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
