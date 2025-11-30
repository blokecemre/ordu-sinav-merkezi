import { PrismaClient } from '@prisma/client'
import { compare } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Checking admin user...')

    try {
        const user = await prisma.user.findUnique({
            where: { username: 'admin' },
        })

        if (!user) {
            console.error('❌ Admin user NOT found in database!')
            return
        }

        console.log('✅ Admin user found:', {
            id: user.id,
            username: user.username,
            role: user.role,
            passwordHashLength: user.password.length,
            passwordHashPrefix: user.password.substring(0, 10) + '...'
        })

        const isMatch = await compare('admin123', user.password)
        console.log('Testing password "admin123":', isMatch ? '✅ MATCH' : '❌ DO NOT MATCH')

    } catch (error) {
        console.error('Error checking user:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
