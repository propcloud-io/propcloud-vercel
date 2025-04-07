"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Mail } from "lucide-react"

export default function Confirmation() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4">
        <div className="container">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            <span className="font-bold text-primary">PropCloud.io</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-md">
          <Card>
            <CardHeader>
              <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full w-fit">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-center">Check your email</CardTitle>
              <CardDescription className="text-center">
                We've sent you a confirmation link to verify your email address
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Please check your inbox and click the verification link to complete your registration. If you don't see
                the email, check your spam folder.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/login">Return to login</Link>
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Need help? Contact{" "}
                <a href="mailto:contact@propcloud.io" className="text-primary hover:underline">
                  contact@propcloud.io
                </a>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

