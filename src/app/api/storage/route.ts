import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/storage - List all files
export async function GET() {
  try {
    const files = await prisma.storageFile.findMany({
      orderBy: { uploadedAt: "desc" },
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error("Failed to fetch files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}

// POST /api/storage/upload - Upload a file
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // In a real implementation, you would save the file to storage
    // For now, we'll just create a database record
    const buffer = Buffer.from(await file.arrayBuffer());
    
    const storageFile = await prisma.storageFile.create({
      data: {
        name: file.name,
        path: `/files/${file.name}`,
        size: buffer.length,
        mimeType: file.type,
      },
    });

    return NextResponse.json(storageFile, { status: 201 });
  } catch (error) {
    console.error("Failed to upload file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
