"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Plus, Search, DollarSign, Home, MoreHorizontal, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Booking {
  id: string
  property_id: string
  property_name?: string
  guest_name: string
  guest_email: string
  check_in: string
  check_out: string
  total_price: number
  status: string
  created_at: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = createBrowserClient()

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)

      // First, get all properties for this user
      const { data: properties, error: propertiesError } = await supabase
        .from("properties")
        .select("id, name")
        .eq("user_id", user?.id)

      if (propertiesError) {
        throw propertiesError
      }

      if (!properties || properties.length === 0) {
        setBookings([])
        setFilteredBookings([])
        setIsLoading(false)
        return
      }

      const propertyIds = properties.map((p) => p.id)
      const propertyMap = properties.reduce(
        (map, property) => {
          map[property.id] = property.name
          return map
        },
        {} as Record<string, string>,
      )

      // Then get all bookings for these properties
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .in("property_id", propertyIds)
        .order("check_in", { ascending: true })

      if (error) {
        throw error
      }

      // Add property name to each booking
      const bookingsWithPropertyNames = (data || []).map((booking) => ({
        ...booking,
        property_name: propertyMap[booking.property_id],
      }))

      setBookings(bookingsWithPropertyNames)
      setFilteredBookings(bookingsWithPropertyNames)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast({
        variant: "destructive",
        title: "Failed to load bookings",
        description: "Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    if (term.trim() === "") {
      filterByTab(activeTab)
      return
    }

    const filtered = bookings.filter(
      (booking) =>
        booking.guest_name.toLowerCase().includes(term) ||
        booking.guest_email.toLowerCase().includes(term) ||
        booking.property_name?.toLowerCase().includes(term),
    )

    setFilteredBookings(filtered)
  }

  const filterByTab = (tab: string) => {
    setActiveTab(tab)

    if (tab === "all") {
      setFilteredBookings(bookings)
    } else {
      const filtered = bookings.filter((booking) => booking.status === tab)
      setFilteredBookings(filtered)
    }
  }

  const handleTabChange = (value: string) => {
    filterByTab(value)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "cancelled":
        return (
          <Badge variant="outline" className="text-red-500">
            Cancelled
          </Badge>
        )
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">Manage your property bookings</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link href="/dashboard/bookings/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Booking
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search bookings..." value={searchTerm} onChange={handleSearch} className="pl-10" />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No bookings found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm ? "No bookings match your search criteria." : "You don't have any bookings yet."}
                </p>
                <Button asChild>
                  <Link href="/dashboard/bookings/add">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Booking
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Nights</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.guest_name}</div>
                            <div className="text-sm text-muted-foreground">{booking.guest_email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{booking.property_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatDate(booking.check_in)}</div>
                            <div className="text-muted-foreground">to {formatDate(booking.check_out)}</div>
                          </div>
                        </TableCell>
                        <TableCell>{calculateNights(booking.check_in, booking.check_out)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.total_price.toFixed(2)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/bookings/${booking.id}`}>View Details</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/bookings/${booking.id}/edit`}>Edit Booking</Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/bookings/${booking.id}/messages`}>View Messages</Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
