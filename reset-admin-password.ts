import { prisma } from "./src/lib/prisma"
import { hash } from "bcryptjs"

async function main() {
    const password = await hash('admin123', 10)

    const user = await prisma.user.update({
        where: { username: 'admin' },
        data: { password }
    })

    console.log("Admin password updated successfully:", user.username)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
