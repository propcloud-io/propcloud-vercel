import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { headers } from "next/headers"

// Simple auth middleware for admin routes
function isAuthenticated(request: NextRequest) {
  const headersList = headers()
  const authHeader = headersList.get("authorization")

  // In a real implementation, you would validate a proper JWT or session
  // This is just a placeholder for demonstration
  return authHeader === `Bearer ${process.env.ADMIN_API_KEY}`
}

export async function GET(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerClient()

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

