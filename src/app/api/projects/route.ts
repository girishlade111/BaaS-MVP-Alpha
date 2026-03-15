import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateUniqueProjectId } from "@/lib/auth";

// POST /api/projects - Create a new project
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    // Trim and validate name
    const trimmedName = name.trim();
    if (trimmedName.length === 0 || trimmedName.length > 100) {
      return NextResponse.json(
        { error: "Project name must be between 1 and 100 characters" },
        { status: 400 }
      );
    }

    // Generate unique Project ID
    const projectId = await generateUniqueProjectId();

    // Create the project
    const project = await prisma.project.create({
      data: {
        name: trimmedName,
        projectId: projectId,
      },
    });

    // Return the project with the generated Project ID (not the internal UUID)
    return NextResponse.json(
      {
        id: project.id,
        name: project.name,
        projectId: project.projectId,
        createdAt: project.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
