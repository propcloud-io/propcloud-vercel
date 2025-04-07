import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { Resend } from "resend"

// Initialize Resend for email notifications
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      fullName,
      companyName,
      propertiesCount,
      phone,
      website,
      currentSoftware,
      painPoints,
      marketingConsent,
    } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check if email already exists
    const { data: existingEntry, error: checkError } = await supabase
      .from("waitlist")
      .select("id, email, position")
      .eq("email", email)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "no rows returned"
      console.error("Error checking waitlist:", checkError)
      return NextResponse.json({ error: "Failed to check waitlist" }, { status: 500 })
    }

    if (existingEntry) {
      return NextResponse.json({
        message: "Email already registered",
        position: existingEntry.position,
      })
    }

    // Add to waitlist
    const { data, error } = await supabase
      .from("waitlist")
      .insert([
        {
          email,
          full_name: fullName || null,
          company_name: companyName || null,
          properties_count: propertiesCount || null,
          phone: phone || null,
          website: website || null,
          current_software: currentSoftware || null,
          pain_points: painPoints || null,
          marketing_consent: marketingConsent || false,
        },
      ])
      .select("position, id")
      .single()

    if (error) {
      console.error("Error adding to waitlist:", error)
      return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 })
    }

    // Send confirmation email to user
    try {
      await resend.emails.send({
        from: "PropCloud.io <notifications@propcloud.io>",
        to: email,
        subject: "Welcome to the PropCloud.io Waitlist",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #00A8E8;">Welcome to PropCloud.io!</h1>
            <p>Hi ${fullName || "there"},</p>
            <p>Thank you for joining the PropCloud.io waitlist! You're now in position <strong>#${data.position}</strong>.</p>
            <p>We're building an autonomous property management platform that will help you:</p>
            <ul>
              <li>Save time with automated operations</li>
              <li>Increase revenue with dynamic pricing</li>
              <li>Improve guest experiences with AI-powered communications</li>
            </ul>
            <p>We'll notify you as soon as we're ready to welcome you to the platform.</p>
            <p>In the meantime, if you have any questions, feel free to reply to this email.</p>
            <p>Best regards,<br>The PropCloud.io Team</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError)
      // Continue execution even if email fails
    }

    // Send notification email to PropCloud team
    try {
      await resend.emails.send({
        from: "PropCloud Waitlist <notifications@propcloud.io>",
        to: "contact@propcloud.io",
        subject: "New Waitlist Signup",
        html: `
          <h1>New Waitlist Signup</h1>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Name:</strong> ${fullName || "Not provided"}</p>
          <p><strong>Company:</strong> ${companyName || "Not provided"}</p>
          <p><strong>Properties:</strong> ${propertiesCount || "Not provided"}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Website:</strong> ${website || "Not provided"}</p>
          <p><strong>Current Software:</strong> ${currentSoftware || "Not provided"}</p>
          <p><strong>Pain Points:</strong> ${painPoints || "Not provided"}</p>
          <p><strong>Marketing Consent:</strong> ${marketingConsent ? "Yes" : "No"}</p>
          <p><strong>Waitlist Position:</strong> ${data.position}</p>
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/waitlist">View in Admin Dashboard</a></p>
        `,
      })
    } catch (emailError) {
      console.error("Error sending notification email:", emailError)
      // Continue execution even if email fails
    }

    return NextResponse.json({
      message: "Successfully joined waitlist",
      position: data.position,
    })
  } catch (error) {
    console.error("Waitlist error:", error)
    return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 })
  }
}

