"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, Loader2 } from "lucide-react"

export default function AddPropertyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createBrowserClient()

  // Basic information
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [status, setStatus] = useState("active")

  // Location
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zip, setZip] = useState("")
  const [country, setCountry] = useState("")

  // Details
  const [bedrooms, setBedrooms] = useState("")
  const [bathrooms, setBathrooms] = useState("")
  const [maxGuests, setMaxGuests] = useState("")
  const [pricePerNight, setPricePerNight] = useState("")
  const [cleaningFee, setCleaningFee] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Property name is required.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("properties")
        .insert([
          {
            user_id: user?.id,
            name,
            description,
            property_type: propertyType,
            status,
            address,
            city,
            state,
            zip,
            country,
            bedrooms: bedrooms ? Number.parseInt(bedrooms) : null,
            bathrooms: bathrooms ? Number.parseFloat(bathrooms) : null,
            max_guests: maxGuests ? Number.parseInt(maxGuests) : null,
            price_per_night: pricePerNight ? Number.parseFloat(pricePerNight) : null,
            cleaning_fee: cleaningFee ? Number.parseFloat(cleaningFee) : null,
          },
        ])
        .select()

      if (error) {
        throw error
      }

      toast({
        title: "Property added",
        description: "Your property has been added successfully.",
      })

      router.push("/dashboard/properties")
    } catch (error) {
      console.error("Error adding property:", error)
      toast({
        variant: "destructive",
        title: "Failed to add property",
        description: "Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/dashboard/properties">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Properties
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Property</CardTitle>
          <CardDescription>Enter the details of your property to add it to your portfolio.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="details">Property Details</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Property Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Beachfront Villa"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger id="propertyType">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                        <SelectItem value="cabin">Cabin</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button type="button" onClick={() => handleTabChange("location")}>
                    Next: Location
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="location" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      placeholder="State/Province"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP/Postal Code</Label>
                    <Input
                      id="zip"
                      placeholder="ZIP/Postal Code"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={() => handleTabChange("basic")}>
                    Back
                  </Button>
                  <Button type="button" onClick={() => handleTabChange("details")}>
                    Next: Property Details
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      min="0"
                      placeholder="Number of bedrooms"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="Number of bathrooms"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxGuests">Max Guests</Label>
                    <Input
                      id="maxGuests"
                      type="number"
                      min="1"
                      placeholder="Maximum number of guests"
                      value={maxGuests}
                      onChange={(e) => setMaxGuests(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricePerNight">Price per Night ($)</Label>
                    <Input
                      id="pricePerNight"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Price per night"
                      value={pricePerNight}
                      onChange={(e) => setPricePerNight(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cleaningFee">Cleaning Fee ($)</Label>
                    <Input
                      id="cleaningFee"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Cleaning fee"
                      value={cleaningFee}
                      onChange={(e) => setCleaningFee(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={() => handleTabChange("location")}>
                    Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding Property...
                      </>
                    ) : (
                      "Add Property"
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
