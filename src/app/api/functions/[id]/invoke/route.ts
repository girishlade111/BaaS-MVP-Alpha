import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireProjectAuth } from "@/lib/auth";

// POST /api/functions/[id]/invoke - Invoke a function (requires auth)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireProjectAuth(request);
  if (authError) return authError;

  const project = (request as any).project;
  const { id } = await params;

  try {
    const body = await request.json();
    const { input } = body;

    const fn = await prisma.edgeFunction.findFirst({
      where: { id, projectId: project.id },
    });

    if (!fn) {
      return NextResponse.json(
        { error: "Function not found" },
        { status: 404 }
      );
    }

    // In a real implementation, you would execute the function
    // For now, we'll simulate execution
    const startTime = Date.now();
    const mockResponse = {
      status: 200,
      body: { success: true, message: "Function executed successfully" },
    };
    const duration = Date.now() - startTime;

    // Log the invocation
    await prisma.functionLog.create({
      data: {
        functionId: id,
        duration,
        success: true,
        response: JSON.stringify(mockResponse),
      },
    });

    return NextResponse.json({
      ...mockResponse,
      duration,
    });
  } catch (error) {
    console.error("Failed to invoke function:", error);
    
    // Log the failed invocation
    try {
      await prisma.functionLog.create({
        data: {
          functionId: id,
          duration: 0,
          success: false,
          response: JSON.stringify({ error: "Function execution failed" }),
        },
      });
    } catch {}

    return NextResponse.json(
      { error: "Failed to invoke function" },
      { status: 500 }
    );
  }
}
