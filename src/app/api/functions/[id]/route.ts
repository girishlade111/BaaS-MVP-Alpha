import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireProjectAuth } from "@/lib/auth";

// PUT /api/functions/[id] - Update a function (requires auth)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireProjectAuth(request);
  if (authError) return authError;

  const project = (request as any).project;
  const { id } = await params;

  try {
    const body = await request.json();
    const { code, status } = body;

    // Verify function belongs to this project
    const existingFn = await prisma.edgeFunction.findFirst({
      where: { id, projectId: project.id },
    });

    if (!existingFn) {
      return NextResponse.json(
        { error: "Function not found" },
        { status: 404 }
      );
    }

    const fn = await prisma.edgeFunction.update({
      where: { id },
      data: {
        ...(code && { code }),
        ...(status && { status }),
      },
    });

    return NextResponse.json(fn);
  } catch (error) {
    console.error("Failed to update function:", error);
    return NextResponse.json(
      { error: "Failed to update function" },
      { status: 500 }
    );
  }
}

// DELETE /api/functions/[id] - Delete a function (requires auth)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireProjectAuth(request);
  if (authError) return authError;

  const project = (request as any).project;
  const { id } = await params;

  try {
    // Verify function belongs to this project
    const existingFn = await prisma.edgeFunction.findFirst({
      where: { id, projectId: project.id },
    });

    if (!existingFn) {
      return NextResponse.json(
        { error: "Function not found" },
        { status: 404 }
      );
    }

    await prisma.edgeFunction.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete function:", error);
    return NextResponse.json(
      { error: "Failed to delete function" },
      { status: 500 }
    );
  }
}
