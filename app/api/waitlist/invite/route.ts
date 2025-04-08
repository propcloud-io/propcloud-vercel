import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { headers } from "next/headers"

// Simple auth middleware for admin routes
function isAuthenticated(request: NextRequest) {
  const headersList = headers()
  const authHeader = headersList.get("authorization")

  // In a real implementation, you would validate a proper JWT or session
  return authHeader === `Bearer ${process.env.ADMIN_API_KEY}`
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("waitlist")
      .update({
        status: "invited",
        invited_at: new Date().toISOString(),
      })
      .eq("email", email)
      .select()

    if (error) {
      throw error
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Email not found in waitlist" }, { status: 404 })
    }

    // In a real implementation, you would send an invitation email here

    return NextResponse.json({
      message: "Invitation sent successfully",
    })
  } catch (error) {
    console.error("Invite error:", error)
    return NextResponse.json({ error: "Failed to send invitation" }, { status: 500 })
  }
}
