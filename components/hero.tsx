"use client"

import { WaitlistForm } from "@/components/waitlist-form"
import { Badge } from "@/components/ui/badge"
import { Lock } from "lucide-react"

export function Hero() {
  return (
    <section className="relative py-20 md:py-32">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 bg-blue-50 text-primary border-primary/20 px-3 py-1">
            NOW IN PRIVATE BETA
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="text-black">All-in-One</span>{" "}
            <span className="text-primary">
              Property
              <br />
              Management
            </span>{" "}
            <span className="text-black">Platform</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Automate your entire property management workflow with AI-powered tools for communication, bookings, dynamic
            pricing, operations, and analytics - all in one unified platform.
          </p>

          <WaitlistForm className="max-w-md mx-auto" variant="hero" />

          <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
            <Lock className="h-4 w-4 mr-2" />
            <p>Early access spots limited. Join the waitlist to secure your spot.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

