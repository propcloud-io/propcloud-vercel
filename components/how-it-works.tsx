"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Upload, Settings, Calendar, MessageSquare, CheckCircle } from "lucide-react"

export function HowItWorks() {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      icon: <Upload className="h-10 w-10 text-primary" />,
      title: "Connect Your Properties",
      description: "Import your properties from Airbnb, Booking.com, or manually add them to PropCloud.",
    },
    {
      icon: <Settings className="h-10 w-10 text-primary" />,
      title: "Configure Automation Rules",
      description: "Set up your pricing strategy, cleaning schedules, and communication preferences.",
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Manage Bookings",
      description: "View and manage all your reservations in one unified calendar across platforms.",
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "Automate Guest Communications",
      description: "Let AI handle routine inquiries and send personalized messages at key moments.",
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: "Monitor Performance",
      description: "Track your properties' performance and identify opportunities for improvement.",
    },
  ]

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length)
  }

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length)
  }

  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How PropCloud Works</h2>
        <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto mb-12">
          Get started in minutes and let automation handle the rest
        </p>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2 z-0">
              <div
                className="h-full bg-primary transition-all duration-500 ease-in-out"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <button
                    onClick={() => setCurrentStep(index)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </button>
                  <p className="mt-2 text-sm font-medium text-center hidden md:block">{step.title}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-12"
          >
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="bg-primary/10 p-6 rounded-full">{steps[currentStep].icon}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h3>
                    <p className="text-muted-foreground text-lg">{steps[currentStep].description}</p>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button onClick={nextStep}>
                    {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
