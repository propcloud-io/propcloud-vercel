"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, Calendar, MessageSquare, TrendingUp, Loader2 } from "lucide-react"

interface DashboardStats {
  propertyCount: number
  upcomingBookings: number
  unreadMessages: number
  recentRevenue: number
}

interface RecentBooking {
  id: string
  property_name: string
  guest_name: string
  check_in: string
  check_out: string
  status: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    propertyCount: 0,
    upcomingBookings: 0,
    unreadMessages: 0,
    recentRevenue: 0,
  })
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createBrowserClient()

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)

      // Get property count
      const { count: propertyCount, error: propertyError } = await supabase
        .from("properties")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user?.id)

      if (propertyError) {
        throw propertyError
      }

      // Get properties for joining with bookings
      const { data: properties, error: propertiesError } = await supabase
        .from("properties")
        .select("id, name")
        .eq("user_id", user?.id)

      if (propertiesError) {
        throw propertiesError
      }

      let upcomingBookings = 0
      let recentRevenue = 0
      let recentBookingsData: RecentBooking[] = []

      if (properties && properties.length > 0) {
        const propertyIds = properties.map((p) => p.id)
        const propertyMap = properties.reduce(
          (map, property) => {
            map[property.id] = property.name
            return map
          },
          {} as Record<string, string>,
        )

        // Get upcoming bookings count
        const today = new Date().toISOString().split("T")[0]
        const { count: bookingsCount, error: bookingsError } = await supabase
          .from("bookings")
          .select("id", { count: "exact", head: true })
          .in("property_id", propertyIds)
          .gte("check_in", today)
          .eq("status", "confirmed")

        if (bookingsError) {
          throw bookingsError
        }

        upcomingBookings = bookingsCount || 0

        // Get recent revenue (last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0]

        const { data: recentBookings, error: revenueError } = await supabase
          .from("bookings")
          .select("total_price")
          .in("property_id", propertyIds)
          .gte("created_at", thirtyDaysAgoStr)
          .in("status", ["confirmed", "completed"])

        if (revenueError) {
          throw revenueError
        }

        recentRevenue = recentBookings?.reduce((sum, booking) => sum + booking.total_price, 0) || 0

        // Get recent bookings
        const { data: bookings, error: recentError } = await supabase
          .from("bookings")
          .select("id, property_id, guest_name, check_in, check_out, status")
          .in("property_id", propertyIds)
          .order("created_at", { ascending: false })
          .limit(5)

        if (recentError) {
          throw recentError
        }

        recentBookingsData = (bookings || []).map((booking) => ({
          ...booking,
          property_name: propertyMap[booking.property_id],
        }))
      }

      // Get unread messages count
      // This is a placeholder - in a real app, you would implement this
      const unreadMessages = 0

      setStats({
        propertyCount: propertyCount || 0,
        upcomingBookings,
        unreadMessages,
        recentRevenue,
      })

      setRecentBookings(recentBookingsData)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.user_metadata?.full_name || "there"}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your properties today.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link href="/dashboard/properties/add">Add Property</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.propertyCount}</div>
            <p className="text-xs text-muted-foreground">Total properties</p>
            <Button variant="link" className="px-0 mt-2" asChild>
              <Link href="/dashboard/properties">View properties</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
            <p className="text-xs text-muted-foreground">Upcoming bookings</p>
            <Button variant="link" className="px-0 mt-2" asChild>
              <Link href="/dashboard/bookings">View bookings</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">Unread messages</p>
            <Button variant="link" className="px-0 mt-2" asChild>
              <Link href="/dashboard/messages">View messages</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.recentRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
            <Button variant="link" className="px-0 mt-2" asChild>
              <Link href="/dashboard/analytics">View analytics</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your latest bookings across all properties</CardDescription>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No bookings yet</div>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <div className="font-medium">{booking.guest_name}</div>
                      <div className="text-sm text-muted-foreground">{booking.property_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                      </div>
                    </div>
                    <div>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/bookings/${booking.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center" asChild>
                <Link href="/dashboard/properties/add">
                  <Building className="h-8 w-8 mb-2" />
                  <span>Add Property</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center" asChild>
                <Link href="/dashboard/bookings/add">
                  <Calendar className="h-8 w-8 mb-2" />
                  <span>Add Booking</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center" asChild>
                <Link href="/dashboard/messages">
                  <MessageSquare className="h-8 w-8 mb-2" />
                  <span>Messages</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center" asChild>
                <Link href="/dashboard/analytics">
                  <TrendingUp className="h-8 w-8 mb-2" />
                  <span>Analytics</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
