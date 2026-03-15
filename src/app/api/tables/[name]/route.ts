import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/tables/[name] - Get table schema
export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const table = await prisma.table.findUnique({
      where: { name },
    });

    if (!table) {
      return NextResponse.json(
        { error: "Table not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(table);
  } catch (error) {
    console.error("Failed to fetch table:", error);
    return NextResponse.json(
      { error: "Failed to fetch table" },
      { status: 500 }
    );
  }
}

// DELETE /api/tables/[name] - Delete a table
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    await prisma.table.delete({
      where: { name },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete table:", error);
    return NextResponse.json(
      { error: "Failed to delete table" },
      { status: 500 }
    );
  }
}
