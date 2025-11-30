"use server"

import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"

export async function checkCredentials(username: string, password: string) {
    const logs: string[] = []
    const log = (msg: string) => logs.push(`[${new Date().toISOString().split('T')[1].split('.')[0]}] ${msg}`)

    log(`Checking credentials for user: '${username}'`)

    try {
        // 1. Check DB Connection
        log("Testing DB connection...")
        try {
            await prisma.$queryRaw`SELECT 1`
            log("✅ DB Connection successful")
        } catch (e) {
            log("❌ DB Connection FAILED: " + String(e))
            return logs
        }

        // 2. Find User
        log("Searching for user...")
        const user = await prisma.user.findUnique({
            where: { username }
        })

        if (!user) {
            log("❌ User NOT FOUND in database")
            return logs
        }

        log(`✅ User found: ID=${user.id}, Role=${user.role}`)
        log(`Stored Password Hash: ${user.password.substring(0, 15)}...`)

        // 3. Compare Password
        log("Comparing passwords...")
        const isMatch = await compare(password, user.password)

        if (isMatch) {
            log("✅ Password MATCHES! Login should work.")
        } else {
            log("❌ Password DOES NOT MATCH.")
        }

    } catch (e) {
        log("❌ Unexpected Error: " + String(e))
    }

    return logs
}
