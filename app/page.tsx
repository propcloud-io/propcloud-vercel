import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ValueProposition } from "@/components/value-proposition"
import { FeaturesOverview } from "@/components/features-overview"
import { HowItWorks } from "@/components/how-it-works"
import { AboutUs } from "@/components/about-us"
import { FAQ } from "@/components/faq"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <Hero />
      <ValueProposition />
      <FeaturesOverview />
      <HowItWorks />
      <AboutUs />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  )
}

