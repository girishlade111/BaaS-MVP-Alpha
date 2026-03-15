import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireProjectAuth } from "@/lib/auth";

// GET /api/storage - List all files (requires auth)
export async function GET(request: NextRequest) {
  const authError = await requireProjectAuth(request);
  if (authError) return authError;

  const project = (request as any).project;

  try {
    const files = await prisma.storageFile.findMany({
      where: {
        projectId: project.id,
      },
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

// POST /api/storage - Upload a file (requires auth)
export async function POST(request: NextRequest) {
  const authError = await requireProjectAuth(request);
  if (authError) return authError;

  const project = (request as any).project;

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
        path: `/files/${project.id}/${file.name}`,
        size: buffer.length,
        mimeType: file.type,
        projectId: project.id,
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
