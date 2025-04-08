import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { headers } from "next/headers"
import { Resend } from "resend"

// Conditionally initialize Resend
let resend: Resend | null = null
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY)
}

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

    const { data: updatedUser, error } = await supabase
      .from("waitlist")
      .update({
        status: "invited",
        invited_at: new Date().toISOString(),
      })
      .eq("email", email)
      .select("id, full_name")
      .single()

    if (error) {
      throw error
    }

    if (!updatedUser) {
      return NextResponse.json({ error: "Email not found in waitlist" }, { status: 404 })
    }

    // Send invitation email if Resend is configured
    if (resend) {
      try {
        // Construct the signup link (adjust URL as needed)
        const signupLink = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/signup?email=${encodeURIComponent(email)}`

        await resend.emails.send({
          from: "PropCloud.io Invitations <invite@propcloud.io>",
          to: email,
          subject: "You're Invited to Join PropCloud.io!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
              <h1 style="color: #1E3A8A;">You're Invited!</h1>
              <p>Hello ${updatedUser.full_name || "there"},</p>
              <p>Great news! You've been invited to join PropCloud.io, the autonomous property management platform.</p>
              <p>Click the link below to create your account and get started:</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${signupLink}" style="background-color: #1E3A8A; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Create Your PropCloud Account
                </a>
              </p>
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p><a href="${signupLink}">${signupLink}</a></p>
              <p>We're excited to have you onboard!</p>
              <p>Best regards,<br>The PropCloud.io Team</p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error("Error sending invitation email:", emailError)
        // Optionally: Decide if you want to return an error here or just log it
        // Returning success even if email fails, as DB update succeeded.
      }
    } else {
      console.log("Resend API key not configured. Skipping invitation email.")
      // Consider returning a specific message indicating email wasn't sent?
    }

    return NextResponse.json({
      message: "Invitation status updated successfully. Email sent if configured.",
    })
  } catch (error) {
    console.error("Invite error:", error)
    return NextResponse.json({ error: "Failed to send invitation" }, { status: 500 })
  }
}
