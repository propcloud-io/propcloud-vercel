import { WaitlistForm } from "@/components/waitlist-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function WaitlistPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-4">Join the PropCloud.io Waitlist</h1>
            <p className="text-xl text-muted-foreground text-center mb-8">
              Be among the first to experience our autonomous property management platform
            </p>

            <WaitlistForm expanded className="w-full" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

