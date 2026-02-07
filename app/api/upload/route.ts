import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file received.' },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary via stream
        const result = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'celred-products', // Optional folder
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        return NextResponse.json({
            message: 'Success',
            url: result.secure_url
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
}
