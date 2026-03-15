import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/tables/[name]/data - Get table rows with pagination
export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // First, get the table to validate it exists
    const table = await prisma.table.findUnique({
      where: { name },
    });

    if (!table) {
      return NextResponse.json(
        { error: "Table not found" },
        { status: 404 }
      );
    }

    // For now, we'll return mock data since we don't have a dynamic schema implementation
    // In a real implementation, we would parse the table.schema and query the actual table
    const mockData = Array.from({ length: limit }, (_, i) => ({
      id: offset + i + 1,
      name: `Item ${offset + i + 1}`,
      email: `item${offset + i + 1}@example.com`,
      created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    }));

    const totalRows = 1000; // Mock total count

    return NextResponse.json({
      data: mockData,
      pagination: {
        page,
        limit,
        totalRows,
        totalPages: Math.ceil(totalRows / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch table data:", error);
    return NextResponse.json(
      { error: "Failed to fetch table data" },
      { status: 500 }
    );
  }
}

// POST /api/tables/[name]/data - Insert a new row
export async function POST(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const body = await request.json();

    // Validate table exists
    const table = await prisma.table.findUnique({
      where: { name },
    });

    if (!table) {
      return NextResponse.json(
        { error: "Table not found" },
        { status: 404 }
      );
    }

    // For now, we'll just return success with mock data
    // In a real implementation, we would insert into the actual table based on schema
    const newRow = {
      id: Math.floor(Math.random() * 10000) + 1,
      ...body,
      createdAt: new Date(),
    };

    return NextResponse.json(newRow, { status: 201 });
  } catch (error) {
    console.error("Failed to insert table row:", error);
    return NextResponse.json(
      { error: "Failed to insert table row" },
      { status: 500 }
    );
  }
}

// DELETE /api/tables/[name]/data/[id] - Delete a row
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ name: string; id: string }> }
) {
  try {
    const { name, id } = await params;

    // Validate table exists
    const table = await prisma.table.findUnique({
      where: { name },
    });

    if (!table) {
      return NextResponse.json(
        { error: "Table not found" },
        { status: 404 }
      );
    }

    // For now, we'll just return success
    // In a real implementation, we would delete from the actual table
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete table row:", error);
    return NextResponse.json(
      { error: "Failed to delete table row" },
      { status: 500 }
    );
  }
}