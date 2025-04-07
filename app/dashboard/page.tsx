"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, Calendar, MessageSquare, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const { user } = useAuth()

  const stats = [
    {
      title: "Properties",
      value: "0",
      description: "Total properties",
      icon: Building,
      link: "/dashboard/properties",
    },
    {
      title: "Bookings",
      value: "0",
      description: "Upcoming bookings",
      icon: Calendar,
      link: "/dashboard/bookings",
    },
    {
      title: "Messages",
      value: "0",
      description: "Unread messages",
      icon: MessageSquare,
      link: "/dashboard/messages",
    },
    {
      title: "Revenue",
      value: "$0",
      description: "Last 30 days",
      icon: TrendingUp,
      link: "/dashboard/analytics",
    },
  ]

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
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <Button variant="link" className="px-0 mt-2" asChild>
                <Link href={stat.link}>View details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your latest bookings across all properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">No bookings yet</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>Your latest guest communications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">No messages yet</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

