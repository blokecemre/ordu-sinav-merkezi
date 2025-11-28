import { prisma } from "./src/lib/prisma"

async function main() {
    const user = await prisma.user.findUnique({
        where: { username: 'admin' },
    })
    console.log("User found:", user)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
