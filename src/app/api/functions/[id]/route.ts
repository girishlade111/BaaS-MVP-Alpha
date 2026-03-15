import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// PUT /api/functions/[id] - Update a function
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { code, status } = body;

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

// DELETE /api/functions/[id] - Delete a function
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
