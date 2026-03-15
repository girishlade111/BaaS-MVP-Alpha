import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/projects/auth - Authenticate with project credentials
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, projectName } = body;

    if (!projectId || !projectName) {
      return NextResponse.json(
        { error: "Project ID and Project Name are required" },
        { status: 400 }
      );
    }

    // Find project by projectId (case-insensitive)
    const project = await prisma.project.findFirst({
      where: {
        projectId: projectId.toUpperCase(),
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Invalid credentials. Please check your Project Name and Project ID." },
        { status: 401 }
      );
    }

    // Verify project name matches (case-sensitive)
    if (project.name !== projectName) {
      return NextResponse.json(
        { error: "Invalid credentials. Please check your Project Name and Project ID." },
        { status: 401 }
      );
    }

    // Return success with project info (but not the internal ID for security)
    return NextResponse.json({
      success: true,
      project: {
        name: project.name,
        projectId: project.projectId,
      },
    });
  } catch (error) {
    console.error("Error authenticating project:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
