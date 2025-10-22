import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Check if user is authenticated and is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { is_active } = await request.json();

    if (typeof is_active !== "boolean") {
      return NextResponse.json({ error: "Invalid is_active value" }, { status: 400 });
    }

    // Update the course status
    const { data, error } = await supabase
      .from("courses")
      .update({ is_active })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating course status:", error);
      return NextResponse.json({ error: "Failed to update course status" }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "Course status updated successfully",
      course: data 
    });

  } catch (error) {
    console.error("Error in toggle course status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

