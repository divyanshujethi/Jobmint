import { NextRequest, NextResponse } from "next/server";
import { db, sql } from "@repo/database";
import { verifyAdminSession } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminSession();

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Forbidden: SuperAdmin clearance required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const tableName = searchParams.get("table");

    // 1. Fetch all public tables & columns metadata
    const tablesQuery: any = await db.execute(sql`
      SELECT 
        t.table_name,
        COALESCE(s.n_live_tup, 0)::bigint as estimated_rows
      FROM information_schema.tables t
      LEFT JOIN pg_stat_user_tables s ON s.relname = t.table_name
      WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE'
      ORDER BY t.table_name;
    `);

    const tableRows = Array.isArray(tablesQuery) ? tablesQuery : tablesQuery.rows || [];
    const validTableNames = tableRows.map((r: any) => r.table_name);

    // Fetch column metadata for public tables
    const columnsQuery: any = await db.execute(sql`
      SELECT 
        table_name, 
        column_name, 
        data_type, 
        is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      ORDER BY table_name, ordinal_position;
    `);

    const colRows = Array.isArray(columnsQuery) ? columnsQuery : columnsQuery.rows || [];
    const tableColumnsMap: Record<string, any[]> = {};
    colRows.forEach((c: any) => {
      if (!tableColumnsMap[c.table_name]) {
        tableColumnsMap[c.table_name] = [];
      }
      tableColumnsMap[c.table_name].push({
        name: c.column_name,
        type: c.data_type,
        isNullable: c.is_nullable === "YES",
      });
    });

    const tablesList = tableRows.map((r: any) => ({
      name: r.table_name,
      estimatedRows: Number(r.estimated_rows || 0),
      columns: tableColumnsMap[r.table_name] || [],
    }));

    // If no specific table requested, return all tables & schema
    if (!tableName) {
      return NextResponse.json({
        success: true,
        tables: tablesList,
      });
    }

    // Security check: validate table exists in public schema
    if (!validTableNames.includes(tableName)) {
      return NextResponse.json(
        { error: `Table '${tableName}' not found in public schema.` },
        { status: 404 }
      );
    }

    const currentColumns = tableColumnsMap[tableName] || [];
    const validColNames = currentColumns.map((c) => c.name);

    // Pagination parameters
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(10, parseInt(searchParams.get("limit") || "50", 10)));
    const offset = (page - 1) * limit;
    const search = searchParams.get("search")?.trim() || "";
    const sort = searchParams.get("sort") || "";
    const order = searchParams.get("order")?.toLowerCase() === "asc" ? "ASC" : "DESC";

    // Build WHERE clause for search
    let searchCondition = "";
    if (search) {
      // Find text-like columns to search across
      const textCols = currentColumns
        .filter((c) =>
          ["text", "character varying", "varchar", "character", "character varying[]"].includes(
            c.type.toLowerCase()
          )
        )
        .slice(0, 5); // limit to first 5 text columns for speed

      if (textCols.length > 0) {
        const escaped = search.replace(/'/g, "''");
        const orClauses = textCols.map((c) => `"${c.name}"::text ILIKE '%${escaped}%'`);
        searchCondition = `WHERE (${orClauses.join(" OR ")})`;
      }
    }

    // Count total rows matching condition
    const countSql = `SELECT count(*)::bigint as total FROM "${tableName}" ${searchCondition};`;
    const countResult: any = await db.execute(sql.raw(countSql));
    const countRows = Array.isArray(countResult) ? countResult : countResult.rows || [];
    const totalRows = Number(countRows[0]?.total || 0);

    // Build ORDER BY clause
    let orderByClause = "";
    if (sort && validColNames.includes(sort)) {
      orderByClause = `ORDER BY "${sort}" ${order}`;
    } else if (validColNames.includes("created_at")) {
      orderByClause = `ORDER BY "created_at" DESC`;
    } else if (validColNames.includes("updated_at")) {
      orderByClause = `ORDER BY "updated_at" DESC`;
    } else if (validColNames.includes("id")) {
      orderByClause = `ORDER BY "id" DESC`;
    } else if (validColNames.length > 0) {
      orderByClause = `ORDER BY "${validColNames[0]}" ASC`;
    }

    // Query paginated rows
    const dataSql = `SELECT * FROM "${tableName}" ${searchCondition} ${orderByClause} LIMIT ${limit} OFFSET ${offset};`;
    const dataResult: any = await db.execute(sql.raw(dataSql));
    const rows = Array.isArray(dataResult) ? dataResult : dataResult.rows || [];

    return NextResponse.json({
      success: true,
      tables: tablesList,
      currentTable: {
        name: tableName,
        columns: currentColumns,
        rows,
        totalRows,
        page,
        limit,
        totalPages: Math.ceil(totalRows / limit) || 1,
      },
    });
  } catch (error: any) {
    console.error("[Admin Table Editor API Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to query table data" },
      { status: 500 }
    );
  }
}
