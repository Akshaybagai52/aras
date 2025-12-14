import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase admin client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Required for reading full table
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Error in /api/alerts:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
