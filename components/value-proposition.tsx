import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, TrendingUp, CheckCircle, Heart } from "lucide-react"

export function ValueProposition() {
  const benefits = [
    {
      icon: <Clock className="h-12 w-12 text-primary" />,
      title: "Save Valuable Time",
      description:
        "Reduce property management time by up to 80% with our autonomous platform that handles routine tasks and communications.",
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-primary" />,
      title: "Increase Revenue",
      description:
        "Boost your earnings by 15-30% through optimized pricing, direct bookings, and improved occupancy rates.",
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-primary" />,
      title: "Operational Excellence",
      description:
        "Maintain consistent quality across all your properties with automated workflows and quality assurance tools.",
    },
    {
      icon: <Heart className="h-12 w-12 text-primary" />,
      title: "Enhance Guest Experience",
      description:
        "Delight your guests with prompt, personalized communication and seamless stays that lead to better reviews.",
    },
  ]

  return (
    <section id="benefits" className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-black">Complete</span> <span className="text-primary">End-to-End Platform</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            PropCloud.io unifies all aspects of property management into one seamless platform, eliminating the need for
            multiple tools and reducing operational complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="mb-4">{benefit.icon}</div>
                <CardTitle>{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{benefit.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

