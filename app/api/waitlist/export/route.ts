import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { headers } from "next/headers"

export async function GET(request: NextRequest) {
  const supabase = createServerClient()

  // Check user authentication using Supabase
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error("Export API - Auth Error:", authError)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if user has admin role
  const isAdmin = user.app_metadata?.role === "admin"
  if (!isAdmin) {
    console.warn(`Export API - Non-admin user attempt: ${user.id}`)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // If authenticated and admin, proceed
  try {
    const { data: waitlist, error } = await supabase
      .from("waitlist")
      .select("*")
      .order("created_at", { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json({ waitlist })
  } catch (error) {
    console.error("Waitlist export error:", error)
    return NextResponse.json({ error: "Failed to export waitlist" }, { status: 500 })
  }
}
