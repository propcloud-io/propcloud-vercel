"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Send, Search, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createBrowserClient } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"

interface WaitlistEntry {
  id: string
  email: string
  full_name: string | null
  company_name: string | null
  properties_count: number | null
  position: number
  status: "pending" | "invited" | "active"
  created_at: string
}

export default function AdminWaitlist() {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([])
  const [filteredWaitlist, setFilteredWaitlist] = useState<WaitlistEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [apiKey, setApiKey] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { user, isLoading: isAuthLoading, isAdmin } = useAuth()
  const { toast } = useToast()
  const supabase = createBrowserClient()

  const fetchWaitlist = async () => {
    try {
      setIsLoading(true)

      const { data, error } = await supabase.from("waitlist").select("*").order("position", { ascending: true })

      if (error) {
        throw error
      }

      setWaitlist(data || [])
      setFilteredWaitlist(data || [])
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Error fetching waitlist:", error)
      toast({
        variant: "destructive",
        title: "Failed to fetch waitlist",
        description: "Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user && !isAuthLoading) {
      fetchWaitlist()
    }
  }, [user, isAuthLoading])

  const handleInvite = async (email: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch("/api/waitlist/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send invitation")
      }

      toast({
        title: "Invitation Processed",
        description: data.message || `Invitation processed for ${email}`,
      })

      fetchWaitlist()
    } catch (error: any) {
      console.error("Error sending invitation:", error)
      toast({
        variant: "destructive",
        title: "Failed to send invitation",
        description: error.message || "Please try again later.",
      })
    }
  }

  const handleExport = () => {
    const csv = [
      ["Email", "Full Name", "Company", "Properties", "Position", "Date Joined", "Status"],
      ...waitlist.map((entry) => [
        entry.email,
        entry.full_name || "",
        entry.company_name || "",
        entry.properties_count || "",
        entry.position,
        new Date(entry.created_at).toLocaleDateString(),
        entry.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `propcloud-waitlist-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    if (term.trim() === "") {
      setFilteredWaitlist(waitlist)
      return
    }

    const filtered = waitlist.filter(
      (entry) =>
        entry.email.toLowerCase().includes(term) ||
        (entry.full_name && entry.full_name.toLowerCase().includes(term)) ||
        (entry.company_name && entry.company_name.toLowerCase().includes(term)),
    )

    setFilteredWaitlist(filtered)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "invited":
        return <Badge variant="secondary">Invited</Badge>
      case "active":
        return <Badge variant="default">Active</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !isAdmin) {
    return (
      <div className="container py-10 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have permission to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please log in with an administrator account.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Waitlist Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by email, name or company..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Waitlist Entries</CardTitle>
          <CardDescription>
            {waitlist.length} {waitlist.length === 1 ? "person" : "people"} on the waitlist
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">Loading waitlist...</div>
          ) : filteredWaitlist.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {searchTerm ? "No entries match your search" : "No entries yet"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Properties</TableHead>
                    <TableHead>Date Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWaitlist.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.position}</TableCell>
                      <TableCell>{entry.email}</TableCell>
                      <TableCell>{entry.full_name || "-"}</TableCell>
                      <TableCell>{entry.company_name || "-"}</TableCell>
                      <TableCell className="text-center">{entry.properties_count || "-"}</TableCell>
                      <TableCell>{new Date(entry.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(entry.status)}</TableCell>
                      <TableCell className="text-right">
                        {entry.status === "pending" && (
                          <Button variant="outline" size="sm" onClick={() => handleInvite(entry.email)}>
                            <Send className="mr-2 h-4 w-4" />
                            Invite
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
