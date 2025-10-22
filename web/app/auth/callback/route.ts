import { getSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = await getSupabaseServerClient();
  await supabase.auth.exchangeCodeForSession(code);

  return NextResponse.redirect(`${origin}${next}`);
}



