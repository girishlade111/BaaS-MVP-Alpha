import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/functions - List all functions
export async function GET() {
  try {
    const functions = await prisma.edgeFunction.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        logs: {
          orderBy: { invokedAt: "desc" },
          take: 1,
        },
      },
    });

    const functionsWithLastInvoked = functions.map((fn: any) => ({
      ...fn,
      lastInvoked: fn.logs[0]?.invokedAt.toISOString() || null,
    }));

    return NextResponse.json(functionsWithLastInvoked);
  } catch (error) {
    console.error("Failed to fetch functions:", error);
    return NextResponse.json(
      { error: "Failed to fetch functions" },
      { status: 500 }
    );
  }
}

// POST /api/functions - Create a new function
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, code } = body;

    if (!name || !code) {
      return NextResponse.json(
        { error: "Name and code are required" },
        { status: 400 }
      );
    }

    const fn = await prisma.edgeFunction.create({
      data: {
        name,
        code,
        status: "deployed",
      },
    });

    return NextResponse.json(fn, { status: 201 });
  } catch (error) {
    console.error("Failed to create function:", error);
    return NextResponse.json(
      { error: "Failed to create function" },
      { status: 500 }
    );
  }
}
