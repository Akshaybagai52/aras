import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("alerts")
      .select("severity, animal_type");

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const totalReports = data.length;
    const criticalCases = data.filter((a) => a.severity === 5).length;

    // Count most common animal
    const countMap: Record<string, number> = {};
    data.forEach((a) => {
      countMap[a.animal_type] = (countMap[a.animal_type] || 0) + 1;
    });

    const mostCommonAnimal =
      Object.entries(countMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown";

    return NextResponse.json({
      total_reports: totalReports,
      critical_cases: criticalCases,
      most_common_animal: mostCommonAnimal,
    });
  } catch (err: any) {
    console.error("Error in /api/stats:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
