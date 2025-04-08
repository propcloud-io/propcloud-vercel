import { WaitlistForm } from "@/components/waitlist-form"

export function FinalCTA() {
  return (
    <section id="waitlist" className="py-20 bg-primary text-white">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Property Management?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join the waitlist today and be among the first to experience the future of autonomous property management.
          </p>

          <WaitlistForm className="max-w-md mx-auto" variant="cta" />

          <p className="mt-4 text-sm opacity-80">Limited spots available. No credit card required.</p>
        </div>
      </div>
    </section>
  )
}
