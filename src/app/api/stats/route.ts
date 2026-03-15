import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/stats - Get dashboard stats
export async function GET() {
  try {
    const [tableCount, storageSize, functionCount, activityCount] = await Promise.all([
      prisma.table.count(),
      prisma.storageFile.aggregate({
        _sum: { size: true },
      }),
      prisma.edgeFunction.count(),
      prisma.queryHistory.count({
        where: {
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
