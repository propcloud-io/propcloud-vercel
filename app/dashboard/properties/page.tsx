"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Building,
  Plus,
  Search,
  Bed,
  Bath,
  Users,
  DollarSign,
  MapPin,
  Calendar,
  MoreHorizontal,
  Loader2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Property {
  id: string
  name: string
  address?: string
  city?: string
  state?: string
  country?: string
  bedrooms?: number
  bathrooms?: number
  max_guests?: number
  price_per_night?: number
  images?: string[]
  status: string
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    if (user) {
      fetchProperties()
    }
  }, [user])

  const fetchProperties = async () => {
    try {
      setIsLoading(true)

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setProperties(data || [])
      setFilteredProperties(data || [])
    } catch (error) {
      console.error("Error fetching properties:", error)
      toast({
        variant: "destructive",
        title: "Failed to load properties",
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

    const filtered = properties.filter(
      (property) =>
        property.name.toLowerCase().includes(term) ||
        property.city?.toLowerCase().includes(term) ||
        property.address?.toLowerCase().includes(term),
    )

    setFilteredProperties(filtered)
  }

  const filterByTab = (tab: string) => {
    setActiveTab(tab)

    if (tab === "all") {
      setFilteredProperties(properties)
    } else {
      const filtered = properties.filter((property) => property.status === tab)
      setFilteredProperties(filtered)
    }
  }

  const handleTabChange = (value: string) => {
    filterByTab(value)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "inactive":
        return (
          <Badge variant="outline" className="text-gray-500">
            Inactive
          </Badge>
        )
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Maintenance</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-muted-foreground">Manage your rental properties</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link href="/dashboard/properties/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search properties..." value={searchTerm} onChange={handleSearch} className="pl-10" />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">All Properties</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProperties.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No properties found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm ? "No properties match your search criteria." : "You haven't added any properties yet."}
                </p>
                <Button asChild>
                  <Link href="/dashboard/properties/add">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Property
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="aspect-video relative bg-muted">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0] || "/placeholder.svg"}
                        alt={property.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted">
                        <Building className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">{getStatusBadge(property.status)}</div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{property.name}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/properties/${property.id}`)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/properties/${property.id}/edit`)}>
                            Edit Property
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/properties/${property.id}/bookings`)}
                          >
                            View Bookings
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/properties/${property.id}/calendar`)}
                          >
                            Calendar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {property.city && (
                      <CardDescription className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {[property.city, property.state, property.country].filter(Boolean).join(", ")}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                      {property.bedrooms !== undefined && (
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>
                            {property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}
                          </span>
                        </div>
                      )}
                      {property.bathrooms !== undefined && (
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>
                            {property.bathrooms} {property.bathrooms === 1 ? "Bath" : "Baths"}
                          </span>
                        </div>
                      )}
                      {property.max_guests !== undefined && (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{property.max_guests} Guests</span>
                        </div>
                      )}
                    </div>
                    {property.price_per_night !== undefined && (
                      <div className="flex items-center font-medium">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>${property.price_per_night}</span>
                        <span className="text-muted-foreground ml-1">/ night</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/properties/${property.id}`}>View Details</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/properties/${property.id}/bookings`}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Bookings
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
