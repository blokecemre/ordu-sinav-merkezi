
import { NextResponse } from "next/server"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"

export const dynamic = "force-dynamic"

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

export async function GET(request: Request) {
    if (!s3Client || !R2_BUCKET_NAME) {
        return new NextResponse("Storage not configured", { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")

    if (!key) {
        return new NextResponse("Key is required", { status: 400 })
    }

    try {
        const command = new GetObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
        })

        const response = await s3Client.send(command)

        // Convert data to response
        // response.Body is a stream in Node environment
        // NextResponse accepts web ReadableStream or Buffer.
        // AWS SDK v3 .Body is usually IncomingMessage (Node) or ReadableStream (Web).
        // Passing it directly usually works in App Router.

        return new NextResponse(response.Body as any, {
            headers: {
                "Content-Type": response.ContentType || "application/octet-stream",
                "Cache-Control": "public, max-age=31536000, immutable"
            }
        })

    } catch (error) {
        console.error("Image proxy error:", error)
        return new NextResponse("Image not found", { status: 404 })
    }
}
