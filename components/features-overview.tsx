import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, ClipboardList, MessageSquare, BarChart3, Calendar, Users, Settings, Shield } from "lucide-react"

export function FeaturesOverview() {
  const features = {
    sales: [
      {
        icon: <CreditCard className="h-6 w-6" />,
        title: "Direct Booking Engine",
        description: "Convert more visitors with a seamless booking experience on your own website.",
      },
      {
        icon: <BarChart3 className="h-6 w-6" />,
        title: "Dynamic Pricing Intelligence",
        description: "Maximize revenue with AI-powered pricing that adapts to market conditions.",
      },
      {
        icon: <Calendar className="h-6 w-6" />,
        title: "OTA Channel Management",
        description: "Sync calendars and rates across Airbnb, Booking.com, and other platforms.",
      },
      {
        icon: <Users className="h-6 w-6" />,
        title: "Lead Management System",
        description: "Track and nurture leads with automated follow-ups and personalized offers.",
      },
    ],
    operations: [
      {
        icon: <ClipboardList className="h-6 w-6" />,
        title: "Cleaning Management",
        description: "Automate scheduling, task assignment, and quality verification for cleaning staff.",
      },
      {
        icon: <Settings className="h-6 w-6" />,
        title: "Maintenance Coordination",
        description: "Track issues, assign vendors, and monitor resolution status in real-time.",
      },
      {
        icon: <Shield className="h-6 w-6" />,
        title: "Quality Assurance",
        description: "Ensure consistent property standards with digital checklists and photo verification.",
      },
      {
        icon: <Users className="h-6 w-6" />,
        title: "Team Communication",
        description: "Keep everyone in sync with role-based updates and task notifications.",
      },
    ],
    communications: [
      {
        icon: <MessageSquare className="h-6 w-6" />,
        title: "AI-Powered Messaging",
        description: "Respond to guest inquiries instantly with intelligent, context-aware automation.",
      },
      {
        icon: <Calendar className="h-6 w-6" />,
        title: "Automated Message Sequences",
        description: "Deliver the right message at the right time throughout the guest journey.",
      },
      {
        icon: <Users className="h-6 w-6" />,
        title: "Guest Support Portal",
        description: "Provide self-service options for common questions and requests.",
      },
      {
        icon: <BarChart3 className="h-6 w-6" />,
        title: "Review Management",
        description: "Encourage positive reviews and address feedback systematically.",
      },
    ],
  }

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-black">Comprehensive</span> <span className="text-primary">Automation Suite</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            PropCloud.io handles every aspect of your property management business
          </p>
        </div>

        <Tabs defaultValue="sales" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="sales">Sales Automation</TabsTrigger>
            <TabsTrigger value="operations">Operations Automation</TabsTrigger>
            <TabsTrigger value="communications">Communications Automation</TabsTrigger>
          </TabsList>

          {Object.entries(features).map(([key, featureList]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featureList.map((feature, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <div className="bg-primary/10 p-2 rounded-full">{feature.icon}</div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center">
                {key === "sales" && (
                  <div className="aspect-video max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden border">
                    <div className="bg-gray-50 p-3 border-b flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                      <div className="text-xs text-gray-500 ml-2">PropCloud Sales Dashboard</div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded-md">
                          <div className="text-sm font-medium text-gray-700 mb-1">Total Bookings</div>
                          <div className="text-2xl font-bold text-primary">128</div>
                          <div className="text-xs text-green-600 flex items-center mt-1">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                              />
                            </svg>
                            12% from last month
                          </div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-md">
                          <div className="text-sm font-medium text-gray-700 mb-1">Revenue</div>
                          <div className="text-2xl font-bold text-primary">$24,500</div>
                          <div className="text-xs text-green-600 flex items-center mt-1">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                              />
                            </svg>
                            8% from last month
                          </div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-md">
                          <div className="text-sm font-medium text-gray-700 mb-1">Occupancy Rate</div>
                          <div className="text-2xl font-bold text-primary">86%</div>
                          <div className="text-xs text-green-600 flex items-center mt-1">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                              />
                            </svg>
                            5% from last month
                          </div>
                        </div>
                      </div>
                      <div className="h-40 bg-gray-50 rounded-md flex items-center justify-center">
                        <div className="w-full px-8">
                          <div className="flex justify-between mb-2">
                            <div className="text-xs text-gray-500">Revenue Trend</div>
                            <div className="text-xs text-gray-500">Last 6 months</div>
                          </div>
                          <div className="relative h-24">
                            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between">
                              <div className="w-1/6 h-12 bg-primary rounded-t-sm mx-1"></div>
                              <div className="w-1/6 h-16 bg-primary rounded-t-sm mx-1"></div>
                              <div className="w-1/6 h-10 bg-primary rounded-t-sm mx-1"></div>
                              <div className="w-1/6 h-14 bg-primary rounded-t-sm mx-1"></div>
                              <div className="w-1/6 h-20 bg-primary rounded-t-sm mx-1"></div>
                              <div className="w-1/6 h-22 bg-primary rounded-t-sm mx-1"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {key === "operations" && (
                  <div className="aspect-video max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden border">
                    <div className="bg-gray-50 p-3 border-b flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                      <div className="text-xs text-gray-500 ml-2">PropCloud Operations Dashboard</div>
                    </div>
                    <div className="p-4">
                      <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                          <div className="bg-gray-50 p-3 rounded-md h-full">
                            <div className="text-sm font-medium text-gray-700 mb-2">Today's Tasks</div>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                <div className="text-xs text-gray-600">Cleaning: Villa Sunset (Completed)</div>
                              </div>
                              <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                                <div className="text-xs text-gray-600">Maintenance: Beach House (In Progress)</div>
                              </div>
                              <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                                <div className="text-xs text-gray-600">Inspection: Mountain Cabin (Scheduled)</div>
                              </div>
                              <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                                <div className="text-xs text-gray-600">Cleaning: Downtown Loft (Scheduled)</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-2/3 pl-2">
                          <div className="bg-gray-50 p-3 rounded-md h-full">
                            <div className="text-sm font-medium text-gray-700 mb-2">Property Status Overview</div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-white p-2 rounded border">
                                <div className="text-xs font-medium text-gray-700">Villa Sunset</div>
                                <div className="flex items-center mt-1">
                                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                                  <div className="text-xs text-gray-600">Ready for guests</div>
                                </div>
                              </div>
                              <div className="bg-white p-2 rounded border">
                                <div className="text-xs font-medium text-gray-700">Beach House</div>
                                <div className="flex items-center mt-1">
                                  <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                                  <div className="text-xs text-gray-600">Maintenance in progress</div>
                                </div>
                              </div>
                              <div className="bg-white p-2 rounded border">
                                <div className="text-xs font-medium text-gray-700">Mountain Cabin</div>
                                <div className="flex items-center mt-1">
                                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                                  <div className="text-xs text-gray-600">Occupied until 05/10</div>
                                </div>
                              </div>
                              <div className="bg-white p-2 rounded border">
                                <div className="text-xs font-medium text-gray-700">Downtown Loft</div>
                                <div className="flex items-center mt-1">
                                  <div className="w-2 h-2 rounded-full bg-purple-500 mr-1"></div>
                                  <div className="text-xs text-gray-600">Checkout today</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-sm font-medium text-gray-700 mb-2">Team Activity</div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-gray-300 mr-2"></div>
                              <div className="text-xs text-gray-600">Sarah completed cleaning at Villa Sunset</div>
                            </div>
                            <div className="text-xs text-gray-400">10:32 AM</div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-gray-300 mr-2"></div>
                              <div className="text-xs text-gray-600">Mike started maintenance at Beach House</div>
                            </div>
                            <div className="text-xs text-gray-400">09:15 AM</div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-gray-300 mr-2"></div>
                              <div className="text-xs text-gray-600">
                                Jessica confirmed inspection for Mountain Cabin
                              </div>
                            </div>
                            <div className="text-xs text-gray-400">Yesterday</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {key === "communications" && (
                  <div className="aspect-video max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden border">
                    <div className="bg-gray-50 p-3 border-b flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                      <div className="text-xs text-gray-500 ml-2">PropCloud Communications Dashboard</div>
                    </div>
                    <div className="p-4 flex h-full">
                      <div className="w-1/3 pr-3 border-r">
                        <div className="text-sm font-medium text-gray-700 mb-3">Conversations</div>
                        <div className="space-y-2">
                          <div className="bg-blue-50 p-2 rounded-md">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-xs">John Smith</div>
                              <div className="text-xs text-gray-500">10m</div>
                            </div>
                            <div className="text-xs text-gray-600 truncate">Hi, I'm interested in booking your...</div>
                          </div>
                          <div className="bg-gray-50 p-2 rounded-md">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-xs">Emma Johnson</div>
                              <div className="text-xs text-gray-500">1h</div>
                            </div>
                            <div className="text-xs text-gray-600 truncate">What's the check-in process for...</div>
                          </div>
                          <div className="bg-gray-50 p-2 rounded-md">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-xs">Michael Brown</div>
                              <div className="text-xs text-gray-500">3h</div>
                            </div>
                            <div className="text-xs text-gray-600 truncate">Is there parking available at the...</div>
                          </div>
                          <div className="bg-gray-50 p-2 rounded-md">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-xs">Sarah Wilson</div>
                              <div className="text-xs text-gray-500">1d</div>
                            </div>
                            <div className="text-xs text-gray-600 truncate">Thank you for the wonderful stay...</div>
                          </div>
                        </div>
                      </div>
                      <div className="w-2/3 pl-3">
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-sm font-medium text-gray-700">John Smith - Villa Sunset</div>
                          <div className="text-xs text-gray-500">Booking #12345</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md h-32 mb-3 overflow-y-auto">
                          <div className="flex flex-col space-y-3">
                            <div className="flex items-start">
                              <div className="w-6 h-6 rounded-full bg-gray-300 mr-2 flex-shrink-0"></div>
                              <div className="bg-white p-2 rounded-md text-xs text-gray-700 shadow-sm">
                                Hi, I'm interested in booking your Villa Sunset property for next month. Is it available
                                from the 15th to the 20th?
                              </div>
                            </div>
                            <div className="flex items-start justify-end">
                              <div className="bg-primary/10 p-2 rounded-md text-xs text-gray-700 shadow-sm">
                                Hello John! Thank you for your interest. Yes, Villa Sunset is available for those dates.
                                Would you like me to send you more information?
                              </div>
                              <div className="w-6 h-6 rounded-full bg-primary/20 ml-2 flex-shrink-0 flex items-center justify-center text-xs font-medium text-primary">
                                AI
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="w-6 h-6 rounded-full bg-gray-300 mr-2 flex-shrink-0"></div>
                              <div className="bg-white p-2 rounded-md text-xs text-gray-700 shadow-sm">
                                That would be great. Could you also tell me about the amenities?
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex">
                          <input
                            type="text"
                            className="flex-1 text-xs p-2 border rounded-l-md focus:outline-none"
                            placeholder="Type your message..."
                          />
                          <button className="bg-primary text-white px-3 py-2 rounded-r-md text-xs">Send</button>
                        </div>
                        <div className="mt-3">
                          <div className="text-xs text-gray-500 mb-2">Suggested Responses:</div>
                          <div className="flex flex-wrap gap-2">
                            <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700 cursor-pointer hover:bg-gray-200">
                              Villa Sunset has a pool, hot tub, and ocean views.
                            </div>
                            <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700 cursor-pointer hover:bg-gray-200">
                              Would you like to proceed with booking?
                            </div>
                            <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700 cursor-pointer hover:bg-gray-200">
                              I can offer a 10% discount for a 5-night stay.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
