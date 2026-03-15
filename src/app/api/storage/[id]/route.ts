import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireProjectAuth } from "@/lib/auth";

// GET /api/storage/[id] - Get file details (requires auth)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireProjectAuth(request);
  if (authError) return authError;

  const project = (request as any).project;
  const { id } = await params;

  try {
    const file = await prisma.storageFile.findFirst({
      where: { id, projectId: project.id },
    });

    if (!file) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(file);
  } catch (error) {
    console.error("Failed to fetch file:", error);
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 500 }
    );
  }
}

// DELETE /api/storage/[id] - Delete a file (requires auth)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireProjectAuth(request);
  if (authError) return authError;

  const project = (request as any).project;
  const { id } = await params;

  try {
    // Verify file belongs to this project
    const existingFile = await prisma.storageFile.findFirst({
      where: { id, projectId: project.id },
    });

    if (!existingFile) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    await prisma.storageFile.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
