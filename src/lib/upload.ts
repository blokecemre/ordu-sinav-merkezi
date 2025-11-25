import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function saveFile(file: File, folder: string): Promise<string> {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure directory exists
    const uploadDir = join(process.cwd(), "public", "uploads", folder)
    await mkdir(uploadDir, { recursive: true })

    // Generate unique filename
    const uniqueName = `${uuidv4()}-${file.name}`
    const path = join(uploadDir, uniqueName)

    await writeFile(path, buffer)

    return `/uploads/${folder}/${uniqueName}`
}
