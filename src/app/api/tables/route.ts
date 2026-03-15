import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireProjectAuth } from "@/lib/auth";

// GET /api/tables - List all tables (requires auth)
export async function GET(request: NextRequest) {
  const authError = await requireProjectAuth(request);
  if (authError) return authError;

  const project = (request as any).project;

  try {
    const tables = await prisma.table.findMany({
      where: {
        projectId: project.id,
      },
      select: {
        id: true,
        name: true,
        schema: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform to match the expected format for the frontend
    const formattedTables = tables.map((table: any) => ({
      id: table.id,
      name: table.name,
      // Mock data for now - in a real app, we'd calculate actual row count and size
      rowCount: Math.floor(Math.random() * 10000) + 100,
      size: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)} MB`,
      createdAt: table.createdAt.toISOString().split("T")[0],
    }));

    return NextResponse.json(formattedTables);
  } catch (error) {
    console.error("Error fetching tables:", error);
    return NextResponse.json(
      { error: "Failed to fetch tables" },
      { status: 500 }
    );
  }
}

// POST /api/tables - Create a new table (requires auth)
export async function POST(request: NextRequest) {
  const authError = await requireProjectAuth(request);
  if (authError) return authError;

  const project = (request as any).project;

  try {
    const body = await request.json();
    const { name, schema } = body;

    if (!name || !schema) {
      return NextResponse.json(
        { error: "Name and schema are required" },
        { status: 400 }
      );
    }

    // Check if table already exists for this project
    const existingTable = await prisma.table.findFirst({
      where: { 
        name,
        projectId: project.id,
      },
    });

    if (existingTable) {
      return NextResponse.json(
        { error: "Table with this name already exists" },
        { status: 409 }
      );
    }

    const table = await prisma.table.create({
      data: {
        name,
        schema,
        projectId: project.id,
      },
    });

    return NextResponse.json(table, { status: 201 });
  } catch (error) {
    console.error("Error creating table:", error);
    return NextResponse.json(
      { error: "Failed to create table" },
      { status: 500 }
    );
  }
}
