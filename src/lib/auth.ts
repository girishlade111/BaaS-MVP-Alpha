import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Header names for project credentials
 */
export const PROJECT_ID_HEADER = "x-project-id";
export const PROJECT_NAME_HEADER = "x-project-name";

/**
 * Extended NextRequest with authenticated project
 */
export interface AuthenticatedRequest extends NextRequest {
  project?: any; // Using any to avoid Prisma type issues
}

/**
 * Result of authentication attempt
 */
export interface AuthResult {
  success: boolean;
  project?: any;
  error?: string;
}

/**
 * Validate project credentials from request headers
 * 
 * @param request - The Next.js request object
 * @returns AuthResult with project if valid, error message if invalid
 */
export async function validateProjectAuth(request: NextRequest): Promise<AuthResult> {
  const projectId = request.headers.get(PROJECT_ID_HEADER)?.toUpperCase();
  const projectName = request.headers.get(PROJECT_NAME_HEADER);

  if (!projectId || !projectName) {
    return {
      success: false,
      error: "Missing credentials. Please provide Project ID and Project Name.",
    };
  }

  // Find project by projectId (case-insensitive)
  const project = await prisma.project.findFirst({
    where: {
      projectId: projectId.toUpperCase(),
    },
  });

  if (!project) {
    return {
      success: false,
      error: "Invalid credentials. Please check your Project ID.",
    };
  }

  // Verify project name matches (case-sensitive as per spec)
  if (project.name !== projectName) {
    return {
      success: false,
      error: "Invalid credentials. Please check your Project Name and Project ID.",
    };
  }

  return {
    success: true,
    project,
  };
}

/**
 * Middleware factory for protecting API routes
 * 
 * @returns NextResponse if unauthorized, void if authorized
 */
export async function requireProjectAuth(request: NextRequest): Promise<NextResponse | null> {
  const authResult = await validateProjectAuth(request);

  if (!authResult.success) {
    return NextResponse.json(
      { error: authResult.error },
      { status: 401 }
    );
  }

  // Attach project to request for later use
  (request as AuthenticatedRequest).project = authResult.project;

  return null; // Authorization passed
}

/**
 * Generate a unique 8-character alphanumeric Project ID
 * Excludes confusing characters: 0, O, 1, I, L
 */
export function generateProjectId(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // Excludes 0, O, 1, I, L
  let result = "";
  
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  
  return result;
}

/**
 * Check if a Project ID already exists
 */
export async function projectIdExists(projectId: string): Promise<boolean> {
  const count = await prisma.project.count({
    where: {
      projectId: projectId.toUpperCase(),
    },
  });
  return count > 0;
}

/**
 * Generate a unique Project ID (retry if collision)
 */
export async function generateUniqueProjectId(): Promise<string> {
  let projectId = generateProjectId();
  let attempts = 0;
  const maxAttempts = 10;

  while (await projectIdExists(projectId) && attempts < maxAttempts) {
    projectId = generateProjectId();
    attempts++;
  }

  if (attempts >= maxAttempts) {
    throw new Error("Failed to generate unique project ID");
  }

  return projectId;
}
