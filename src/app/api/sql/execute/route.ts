import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/sql/execute - Execute raw SQL query
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // Validate query type (basic validation)
    const queryUpper = query.trim().toUpperCase();
    const isReadOnly = 
      queryUpper.startsWith("SELECT") ||
      queryUpper.startsWith("SHOW") ||
      queryUpper.startsWith("DESCRIBE") ||
      queryUpper.startsWith("EXPLAIN");

    const startTime = Date.now();
    
    // Execute query against the database using Prisma
    let result;
    let rowCount = 0;
    
    if (isReadOnly) {
      // For SELECT queries, use $queryRaw to get results
      result = await prisma.$queryRawUnsafe(query);
      // Convert BigInt values to strings for JSON serialization
      const serializedResult = JSON.parse(JSON.stringify(result));
      rowCount = serializedResult.length;
      
      // Extract columns from the first row if available
      const columns = rowCount > 0 ? Object.keys(serializedResult[0]) : [];
      
      return NextResponse.json({
        columns,
        rows: serializedResult,
        rowCount,
        executionTime: Date.now() - startTime,
      });
    } else {
      // For INSERT, UPDATE, DELETE, etc., use $executeRaw
      result = await prisma.$executeRawUnsafe(query);
      rowCount = typeof result === 'number' ? result : 0;
      
      return NextResponse.json({
        columns: [],
        rows: [],
        rowCount,
        executionTime: Date.now() - startTime,
      });
    }
  } catch (error: any) {
    console.error("Failed to execute query:", error);
    return NextResponse.json(
      { error: error.message || "Failed to execute query" },
      { status: 400 }
    );
  }
}
