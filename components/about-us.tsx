import { Card, CardContent } from "@/components/ui/card"
import { BadgeCheck, Award, TrendingUp, Shield, Settings, BarChart3 } from "lucide-react"

export function AboutUs() {
  return (
    <section id="about" className="py-20">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-muted-foreground mb-6">
              At PropCloud.io, we're transforming property management through intelligent automation. We believe that
              property managers should focus on growth and exceptional guest experiences, not repetitive tasks.
            </p>
            <p className="text-xl text-muted-foreground mb-8">
              Our platform is built by real estate industry experts with a deep understanding of the challenges and
              opportunities in the short-term rental industry.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <BadgeCheck className="h-8 w-8 text-primary mb-2" />
                  <p className="font-medium">Trusted by Professionals</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Award className="h-8 w-8 text-primary mb-2" />
                  <p className="font-medium">Industry Expertise</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <TrendingUp className="h-8 w-8 text-primary mb-2" />
                  <p className="font-medium">Proven Results</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            <Card className="col-span-full sm:col-span-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Security & Privacy</h3>
                  <p className="text-sm text-muted-foreground">
                    Your data is protected with enterprise-grade security and encryption.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-full sm:col-span-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Settings className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Customizable</h3>
                  <p className="text-sm text-muted-foreground">
                    Tailor the platform to your specific business needs and workflows.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-full sm:col-span-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Data-Driven</h3>
                  <p className="text-sm text-muted-foreground">
                    Make informed decisions with comprehensive analytics and reporting.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

