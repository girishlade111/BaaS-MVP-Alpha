import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateProjectAuth } from "@/lib/auth";

// GET /api/projects/me - Get current project info (requires auth)
export async function GET(request: NextRequest) {
  const authResult = await validateProjectAuth(request);

  if (!authResult.success) {
    return NextResponse.json(
      { error: authResult.error },
      { status: 401 }
    );
  }

  return NextResponse.json({
    name: authResult.project!.name,
    projectId: authResult.project!.projectId,
    createdAt: authResult.project!.createdAt,
  });
}

// PATCH /api/projects/me - Update project name (requires auth)
export async function PATCH(request: NextRequest) {
  const authResult = await validateProjectAuth(request);

  if (!authResult.success) {
    return NextResponse.json(
      { error: authResult.error },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    if (trimmedName.length === 0 || trimmedName.length > 100) {
      return NextResponse.json(
        { error: "Project name must be between 1 and 100 characters" },
        { status: 400 }
      );
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: authResult.project!.id,
      },
      data: {
        name: trimmedName,
      },
    });

    return NextResponse.json({
      name: updatedProject.name,
      projectId: updatedProject.projectId,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
