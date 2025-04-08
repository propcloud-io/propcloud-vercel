"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface WaitlistFormProps {
  className?: string
  variant?: "default" | "hero" | "cta"
  expanded?: boolean
}

export function WaitlistForm({ className = "", variant = "default", expanded = false }: WaitlistFormProps) {
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [propertiesCount, setPropertiesCount] = useState<string>("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")
  const [currentSoftware, setCurrentSoftware] = useState("")
  const [painPoints, setPainPoints] = useState("")
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [position, setPosition] = useState<number | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus("idle")

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          fullName: expanded ? fullName : undefined,
          companyName: expanded ? companyName : undefined,
          propertiesCount: expanded && propertiesCount ? Number.parseInt(propertiesCount) : undefined,
          phone: expanded ? phone : undefined,
          website: expanded ? website : undefined,
          currentSoftware: expanded ? currentSoftware : undefined,
          painPoints: expanded ? painPoints : undefined,
          marketingConsent: expanded ? marketingConsent : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to join waitlist")
      }

      setStatus("success")
      setPosition(data.position)
      setEmail("")
      setFullName("")
      setCompanyName("")
      setPropertiesCount("")
      setPhone("")
      setWebsite("")
      setCurrentSoftware("")
      setPainPoints("")
      setMarketingConsent(false)

      toast({
        title: "You're on the list!",
        description: "We'll notify you when PropCloud.io launches.",
      })
    } catch (error) {
      console.error("Waitlist submission error:", error)
      setStatus("error")

      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getButtonVariant = () => {
    switch (variant) {
      case "hero":
        return "default"
      case "cta":
        return "secondary"
      default:
        return "default"
    }
  }

  const getInputClass = () => {
    switch (variant) {
      case "cta":
        return "bg-white/10 border-white/20 text-white placeholder:text-white/60"
      default:
        return ""
    }
  }

  if (status === "success") {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>
          You've joined the waitlist{position ? ` at position #${position}` : ""}. We'll notify you when PropCloud.io
          launches.
        </AlertDescription>
      </Alert>
    )
  }

  if (status === "error") {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  if (expanded) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Join the PropCloud.io Waitlist</CardTitle>
          <CardDescription>Be among the first to experience autonomous property management</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Your Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(123) 456-7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Your Company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Company Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yourcompany.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertiesCount">
                Number of Properties <span className="text-red-500">*</span>
              </Label>
              <Select value={propertiesCount} onValueChange={setPropertiesCount} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select number of properties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1-5 properties</SelectItem>
                  <SelectItem value="6-20">6-20 properties</SelectItem>
                  <SelectItem value="21-50">21-50 properties</SelectItem>
                  <SelectItem value="50+">More than 50 properties</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentSoftware">Current Property Management Software</Label>
              <Input
                id="currentSoftware"
                type="text"
                placeholder="e.g., Guesty, Hostfully, etc."
                value={currentSoftware}
                onChange={(e) => setCurrentSoftware(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="painPoints">What are your biggest challenges in property management?</Label>
              <Textarea
                id="painPoints"
                placeholder="Tell us about your pain points..."
                value={painPoints}
                onChange={(e) => setPainPoints(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="marketingConsent"
                checked={marketingConsent}
                onCheckedChange={(checked) => setMarketingConsent(checked as boolean)}
              />
              <Label
                htmlFor="marketingConsent"
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to receive marketing communications from PropCloud.io
              </Label>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Joining..." : "Join Waitlist"}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={`h-12 ${getInputClass()}`}
      />
      <Button
        type="submit"
        size="lg"
        variant={getButtonVariant()}
        disabled={isSubmitting}
        className="h-12 px-6 rounded-md"
      >
        {isSubmitting ? "Joining..." : "Join Waitlist"}
      </Button>
    </form>
  )
}
