import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireProjectAuth } from "@/lib/auth";

// GET /api/functions - List all functions (requires auth)
export async function GET(request: NextRequest) {
  const authError = await requireProjectAuth(request);
  if (authError) return authError;

  const project = (request as any).project;

  try {
    const functions = await prisma.edgeFunction.findMany({
      where: {
        projectId: project.id,
      },
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

// POST /api/functions - Create a new function (requires auth)
export async function POST(request: NextRequest) {
  const authError = await requireProjectAuth(request);
  if (authError) return authError;

  const project = (request as any).project;

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
        projectId: project.id,
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
