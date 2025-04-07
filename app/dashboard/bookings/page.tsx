"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Search, User, Home, Eye, Download } from "lucide-react"
import Link from "next/link"

type Booking = {
  id: string
  property_id: string
  property_name: string
  guest_name: string
  guest_email: string
  guest_phone: string
  check_in: string
  check_out: string
  total_price: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  created_at: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createBrowserClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
  }, [activeFilter])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)

      if (!user) return

      // First get all properties for this user
      const { data: properties, error: propertiesError } = await supabase
        .from("properties")
        .select("id")
        .eq("user_id", user.id)

      if (propertiesError) throw propertiesError

      if (!properties || properties.length === 0) {
        setBookings([])
        return
      }

      const propertyIds = properties.map((p) => p.id)

      // Then get all bookings for these properties
      let query = supabase
        .from("bookings")
        .select(`
          *,
          properties:property_id (name)
        `)
        .in("property_id", propertyIds)
        .order("check_in", { ascending: true })

      if (activeFilter && activeFilter !== "all") {
        query = query.eq("status", activeFilter)
      }

      const { data, error } = await query

      if (error) throw error

      // Format the data to include property name
      const formattedBookings = data.map((booking) => ({
        ...booking,
        property_name: booking.properties.name,
      }))

      setBookings(formattedBookings || [])
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load bookings. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (value: string) => {
    setActiveFilter(value)
  }

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.property_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Placeholder for when we have no bookings yet
  if (bookings.length === 0 && !isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Bookings</h1>
        </div>

        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No bookings yet</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Once you receive bookings for your properties, they will appear here.
            </p>
            <Button asChild>
              <Link href="/dashboard/properties">Manage Your Properties</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <Button asChild>
          <Link href="/dashboard/bookings/calendar">
            <Calendar className="mr-2 h-4 w-4" /> Calendar View
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search bookings..." className="pl-10" value={searchTerm} onChange={handleSearch} />
        </div>
        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={handleFilterChange}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No bookings found</h2>
            <p className="text-muted-foreground text-center">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Guest</th>
                    <th className="text-left py-3 px-4 font-medium">Property</th>
                    <th className="text-left py-3 px-4 font-medium">Check-in</th>
                    <th className="text-left py-3 px-4 font-medium">Check-out</th>
                    <th className="text-left py-3 px-4 font-medium">Total</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{booking.guest_name}</div>
                            <div className="text-sm text-muted-foreground">{booking.guest_email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <Home className="h-4 w-4 text-primary" />
                          </div>
                          <div className="font-medium">{booking.property_name}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{new Date(booking.check_in).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{new Date(booking.check_out).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-medium">${booking.total_price.toFixed(2)}</td>
                      <td className="py-3 px-4">{getStatusBadge(booking.status)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/bookings/${booking.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

