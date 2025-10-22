import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const event = await request.json();

    // Validate event structure
    if (!event.event || typeof event.event !== 'string') {
      return NextResponse.json(
        { error: "Invalid event structure" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    // Store event in analytics table
    const { data, error } = await supabase
      .from("analytics_events")
      .insert([
        {
          event_name: event.event,
          properties: event.properties || {},
          timestamp: new Date(event.timestamp || Date.now()).toISOString(),
          user_agent: request.headers.get('user-agent'),
          ip_address: request.ip || request.headers.get('x-forwarded-for'),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error storing analytics event:", error);
      return NextResponse.json(
        { error: "Failed to store event" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Event stored successfully", id: data.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



