
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 Client for Cloudflare R2
// Credentials should be in .env
// R2_ACCOUNT_ID
// R2_ACCESS_KEY_ID
// R2_SECRET_ACCESS_KEY
// R2_BUCKET_NAME
// R2_PUBLIC_URL (Optional, for public access without signing)

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // e.g., https://pub-xxxx.r2.dev or https://assets.ordusinav.com

const s3Client = (R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY)
    ? new S3Client({
        region: "auto",
        endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: R2_ACCESS_KEY_ID,
            secretAccessKey: R2_SECRET_ACCESS_KEY,
        },
    })
    : null;

export async function uploadToR2(
    fileBuffer: Buffer | Uint8Array,
    fileName: string,
    contentType: string,
    folder: string = "uploads"
): Promise<string | null> {
    if (!s3Client || !R2_BUCKET_NAME) {
        console.warn("R2 credentials not configured. Skipping R2 upload.");
        return null;
    }

    // Sanitize filename to avoid weird chars
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `${folder}/${Date.now()}-${sanitizedFileName}`;

    try {
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            Body: fileBuffer,
            ContentType: contentType,
        });

        await s3Client.send(command);

        // Return public URL if configured, otherwise construct it
        if (R2_PUBLIC_URL) {
            return `${R2_PUBLIC_URL}/${key}`;
        }

        // Construct default public URL (assuming bucket is public)
        // Note: R2 dev domains are like pub-xxx.r2.dev, user must provide this usually
        // Returning key effectively if no public URL is set, so implementation must handle
        return key;
    } catch (error) {
        console.error("Error uploading to R2:", error);
        return null;
    }
}
