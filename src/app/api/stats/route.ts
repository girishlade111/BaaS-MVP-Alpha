import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireProjectAuth } from "@/lib/auth";

// GET /api/stats - Get dashboard stats (requires auth)
export async function GET(request: NextRequest) {
  const authError = await requireProjectAuth(request);
  if (authError) return authError;

  const project = (request as any).project;

  try {
    const [tableCount, storageSize, functionCount, activityCount] = await Promise.all([
      prisma.table.count({
        where: {
          projectId: project.id,
        },
      }),
      prisma.storageFile.aggregate({
        where: {
          projectId: project.id,
        },
        _sum: { size: true },
      }),
      prisma.edgeFunction.count({
        where: {
          projectId: project.id,
        },
      }),
      prisma.queryHistory.count({
        where: {
          projectId: project.id,
          executedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
    ]);

    return NextResponse.json({
      tables: tableCount,
      storageUsed: storageSize._sum.size || 0,
      functions: functionCount,
      recentActivity: activityCount,
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
